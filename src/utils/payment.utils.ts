import axios from "axios";
import config from "../app/config";

interface IPayment {
  transactionId: string;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
}

export const initiatePayment = async (paymentData: IPayment) => {
  try {
    const response = await axios.post(config.payment_url!, {
      store_id: config.store_id,
      signature_key: config.signature_key,
      tran_id: paymentData.transactionId,
      success_url: `${config.base_url}/api/v1/orders/confirmation?transactionId=${paymentData.transactionId}&status=success`,
      fail_url: `${config.base_url}/api/v1/orders/confirmation?status=failed`,
      cancel_url: `${config.client_url}`,
      amount: paymentData.totalPrice,
      currency: "BDT",
      desc: "Merchant Registration Payment",
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: paymentData.customerAddress,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1206",
      cus_country: "Bangladesh",
      cus_phone: paymentData.customerPhone,
      type: "json",
    });

    return response.data;
  } catch (error) {
    throw new Error("Payment initiation failed!");
  }
};

export const verifyPayment = async (transactionId: string) => {
  try {
    const response = await axios.get(config.payment_verify_url!, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        type: "json",
        request_id: transactionId,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Payment validation failed!");
  }
};
