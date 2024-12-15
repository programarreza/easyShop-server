import { OrderStatus, PaymentStatus, UserStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { initiatePayment, verifyPayment } from "../../../utils/payment.utils";
import AppError from "../../error/AppError";
import prisma from "../../shared/prisma";

const createOrderIntoDB = async (user: JwtPayload, payload: any) => {
  const transactionId = uuidv4().slice(0, 8);
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

  return paymentLink;
};

const confirmOrderIntoDB = async (transactionId: string, status: string) => {
  if (!transactionId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid notification.");
  }

  // verify payment
  const verifyPaymentResponse = await verifyPayment(transactionId);

  const payments = await prisma.payment.findMany({
    where: {
      transactionId,
    },
  });

  if (payments.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment not found.");
  }

  if (
    verifyPaymentResponse &&
    verifyPaymentResponse.pay_status === "Successful"
  ) {
    const payment = payments[0]; // Assuming only one payment is relevant

    const result = await prisma.$transaction(async (tx) => {
      // Update payment status
      const paymentData = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status:
            status === "success" ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
        },
      });

      // Update order status if payment is successful
      if (status === "success") {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.COMPLETED },
        });
      }

      return paymentData;
    });

    return result;
  }
};

const failedOrderIntoDB = async (transactionId: string) => {
  if (!transactionId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid notification.");
  }

  const payments = await prisma.payment.findMany({
    where: {
      transactionId,
    },
  });

  if (payments.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment not found.");
  }

  const payment = payments[0]; // Assuming only one payment is relevant

  const result = await prisma.$transaction(async (tx) => {
    // Update payment status
    const paymentData = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
      },
    });

    // Update order status
    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: OrderStatus.CANCELED },
    });

    return paymentData;
  });

  return result;
};

const getCustomerOrderHistoryFromDB = async (user: JwtPayload) => {
  // find customer data
  const customerData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  // find order history
  const result = await prisma.order.findMany({
    where: {
      customerId: customerData.id,
    },

    include: {
      // order items
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              images: true,
            },
          },
        },
      },

      // shop
      shop: {
        select: {
          name: true,
          logo: true,
        },
      },

      // payments
      payments: {
        select: {
          amount: true,
          status: true,
          transactionId: true,
        },
      },
    },

    // orderby
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getMyCustomersOrdersHistoryFromDB = async (user: JwtPayload) => {
  // find vendor data
  const vendorData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      shop: true,
    },
  });

  const shopData = await prisma.shop.findUniqueOrThrow({
    where: {
      vendorId: vendorData.id,
    },
  });

  // find vendor order history
  const result = await prisma.order.findMany({
    where: {
      shopId: shopData.id,
    },

    include: {
      // order items
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              images: true,
            },
          },
        },
      },

      // shop
      shop: {
        select: {
          name: true,
          logo: true,
        },
      },

      // payments
      payments: {
        select: {
          amount: true,
          status: true,
          transactionId: true,
        },
      },
    },

    // orderby
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getAllShopsOrdersHistoryFromDB = async () => {
  // find vendor data
  // const vendorData = await prisma.user.findUniqueOrThrow({
  //   where: {
  //     email: user.email,
  //     status: UserStatus.ACTIVE,
  //   },
  //   include: {
  //     shop: true,
  //   },
  // });

  // const shopData = await prisma.shop.findUniqueOrThrow({
  //   where: {
  //     vendorId: vendorData.id,
  //   },
  // });

  // find vendor order history
  const result = await prisma.order.findMany({
    // where: {
    //   shopId: shopData.id,
    // },

    include: {
      // order items
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              images: true,
            },
          },
        },
      },

      // shop
      shop: {
        select: {
          name: true,
          logo: true,
        },
      },

      // payments
      payments: {
        select: {
          amount: true,
          status: true,
          transactionId: true,
        },
      },
    },

    // orderby
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export {
  confirmOrderIntoDB,
  createOrderIntoDB,
  failedOrderIntoDB,
  getAllShopsOrdersHistoryFromDB,
  getCustomerOrderHistoryFromDB,
  getMyCustomersOrdersHistoryFromDB,
};
