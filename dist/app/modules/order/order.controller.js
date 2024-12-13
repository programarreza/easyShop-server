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
exports.paymentConfirmation = exports.failedOrder = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const order_services_1 = require("./order.services");
// controller
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield (0, order_services_1.createOrderIntoDB)(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Order created successfully!",
        data: result,
    });
}));
exports.createOrder = createOrder;
const paymentConfirmation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, status } = req.query;
    const result = yield (0, order_services_1.confirmOrderIntoDB)(transactionId, status);
    if ((result === null || result === void 0 ? void 0 : result.status) === client_1.PaymentStatus.SUCCESS) {
        const paymentUrl = `${config_1.default.client_url}/payment-successful?transactionId=${transactionId}&amount=${result === null || result === void 0 ? void 0 : result.amount}&status=${status}&date=${new Date().toISOString()}`;
        return res.redirect(paymentUrl);
    }
    else {
        const paymentUrl = `${config_1.default.client_url}/payment-failed?status=${status}`;
        return res.redirect(paymentUrl);
    }
}));
exports.paymentConfirmation = paymentConfirmation;
const failedOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.query;
    const result = yield (0, order_services_1.failedOrderIntoDB)(transactionId);
    if ((result === null || result === void 0 ? void 0 : result.status) === client_1.PaymentStatus.FAILED) {
        const paymentUrl = `${config_1.default.client_url}/payment-failed`;
        return res.redirect(paymentUrl);
    }
}));
exports.failedOrder = failedOrder;
