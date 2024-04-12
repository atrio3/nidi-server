import { instance } from "../server.js";
import crypto from "crypto";

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(200).json({
    sucess: "true",
    order,
  });
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "https://www.nidirentals.com";

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    res.redirect(`https://www.nidirentals.com/paymentsuccess?reference=${razorpay_payment_id}`);
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
