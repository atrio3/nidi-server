import { instance } from "../server.js";
import crypto from "crypto";

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100), // Ensure amount is in paise
    currency: "INR",
  };

  try {
    const order = await instance.orders.create(options);
    res.status(200).json({
      success: "true", // Corrected typo here
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      message: "Failed to create the order",
      error: error.message,
    });
  }
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({
        success: true,
        msg: "Payment verification successful",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        msg: "Transaction is not legit",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in payment verification",
      error: error.message,
    });
  }
};
