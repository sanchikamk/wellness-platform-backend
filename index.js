import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/config.js";
import cors from "cors";
import userRouter from "./routers/users.router.js";
import councelorRouter from "./routers/councelor.router.js";
import appointmentRouter from "./routers/appointment.router.js";
import paymentRouter from "./routers/payment.router.js";
import zoomRouter from "./routers/zoom.router.js";

dotenv.config();

connectDB();
const app = express();

app.use(
  cors()
);
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/councelors", councelorRouter);
app.use("/api/appointments", appointmentRouter);
app.use('/api/stripe', paymentRouter);
app.use('/api/zoom', zoomRouter);

app.get("/", (req, res) => {
  res.send("Online Counselling is about to start...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
