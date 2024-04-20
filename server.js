import { app } from "./app.js";

import Razorpay from "razorpay";

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const PORT = process.env.PORT||3000
app.listen(PORT, () =>
  console.log(`Server is listening on ${process.env.PORT}`)
);
