import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/config.js";
import cors from "cors";
import userRouter from "./routers/users.router.js";
import councelorRouter from "./routers/councelor.router.js";
import appointmentRouter from "./routers/appointment.router.js";
import paymentRouter from "./routers/payment.router.js";

dotenv.config();

connectDB();
const app = express();

app.use(
  cors({
    origin: "http://localhost:4000", // Allow only this origin
    credentials: true, // Optional: if you’re sending cookies or auth headers
  })
);
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/councelors", councelorRouter);
app.use("/api/appointments", appointmentRouter);
app.use('/api/stripe', paymentRouter);

app.get("/", (req, res) => {
  res.send("Online Counselling is about to start...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
