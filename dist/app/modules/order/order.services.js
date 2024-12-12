"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderIntoDB = void 0;
// services
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const payment_utils_1 = require("../../../utils/payment.utils");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createOrderIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = (0, uuid_1.v4)();
    const { shopId, items, totalPrice, discountedAmount, discount, grandTotal } = payload;
    if (!items || items.length === 0) {
        throw new Error("Order must include at least one item.");
    }
    //   find customer
    const customerData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            isDeleted: false,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    // Start a transaction
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Step 1: Create Order
        const order = yield tx.order.create({
            data: {
                customerId: customerData === null || customerData === void 0 ? void 0 : customerData.id,
                shopId,
                totalPrice,
                discountedAmount,
                discount,
                grandTotal,
                status: client_1.OrderStatus.PENDING,
            },
        });
        // Step 2: Create Order Items
        for (const item of items) {
            const { id, quantity, price, discount } = item;
            // Calculate the total and grand total
            const total = quantity * price;
            const totalPrice = total - total * (discount / 100); // Deduct discount percentage
            yield tx.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: id,
                    quantity,
                    price,
                    discount,
                    grandTotal: totalPrice,
                },
            });
            // Reduce product inventory
            yield tx.product.update({
                where: { id },
                data: { inventoryCount: { decrement: quantity } },
            });
        }
        // Step 3: Create Payment Record
        const payment = yield tx.payment.create({
            data: {
                customerId: customerData === null || customerData === void 0 ? void 0 : customerData.id,
                orderId: order.id,
                amount: grandTotal,
                transactionId, // This will be updated after generating the payment link
                status: "PENDING",
            },
        });
        return { order, payment };
    }));
    // Step 4: Generate Payment Link using Amarpay
    const paymentData = {
        transactionId,
        totalPrice: grandTotal,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phoneNumber,
        customerAddress: customerData.address,
    };
    // Generate payment  link
    const paymentLink = yield (0, payment_utils_1.initiatePayment)(paymentData);
    return paymentLink;
});
exports.createOrderIntoDB = createOrderIntoDB;
