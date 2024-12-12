import { PaymentStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { confirmOrderIntoDB, createOrderIntoDB } from "./order.services";

// controller
const createOrder = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await createOrderIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order created successfully!",
    data: result,
  });
});

const paymentConfirmation = catchAsync(async (req, res) => {
  const { transactionId, status } = req.query;

  const result = await confirmOrderIntoDB(
    transactionId as string,
    status as string
  );

  if (result?.status === PaymentStatus.SUCCESS) {
    const paymentUrl = `${
      config.client_url
    }/payment-successful?transactionId=${transactionId}&amount=${
      result?.amount
    }&status=${status}&date=${new Date().toISOString()}`;

    return res.redirect(paymentUrl);
  } else {
    const paymentUrl = `${config.client_url}/payment-failed?status=${status}`;

    return res.redirect(paymentUrl);
  }
});

export { createOrder, paymentConfirmation };
