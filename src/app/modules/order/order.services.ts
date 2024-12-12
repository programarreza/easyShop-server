// services
import { OrderStatus, UserStatus } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { initiatePayment } from "../../../utils/payment.utils";
import prisma from "../../shared/prisma";

const createOrderIntoDB = async (user: JwtPayload, payload: any) => {
  const transactionId = uuidv4();
  const { shopId, items, totalPrice, discountedAmount, discount, grandTotal } =
    payload;

  if (!items || items.length === 0) {
    throw new Error("Order must include at least one item.");
  }

  //   find customer
  const customerData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
      status: UserStatus.ACTIVE,
    },
  });

  // Start a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Step 1: Create Order
    const order = await tx.order.create({
      data: {
        customerId: customerData?.id,
        shopId,
        totalPrice,
        discountedAmount,
        discount,
        grandTotal,
        status: OrderStatus.PENDING,
      },
    });

    // Step 2: Create Order Items
    for (const item of items) {
      const { id, quantity, price, discount } = item;
      // Calculate the total and grand total
      const total = quantity * price;
      const totalPrice = total - total * (discount / 100); // Deduct discount percentage

      await tx.orderItem.create({
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
      await tx.product.update({
        where: { id },
        data: { inventoryCount: { decrement: quantity } },
      });
    }

    // Step 3: Create Payment Record
    const payment = await tx.payment.create({
      data: {
        customerId: customerData?.id,
        orderId: order.id,
        amount: grandTotal,
        transactionId, // This will be updated after generating the payment link
        status: "PENDING",
      },
    });

    return { order, payment };
  });

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
  const paymentLink = await initiatePayment(paymentData);
  console.log({ paymentLink, result, transactionId, paymentData });

  return paymentLink;
};

export { createOrderIntoDB };
