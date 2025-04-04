import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentTimings: {
      day: { type: String, required: true }, // e.g., "Monday"
      from: { type: String, required: true }, // e.g., "10:00 AM"
      to: { type: String, required: true }, // e.g., "11:00 AM"
    },
    sessionType: {
      type: String,
      enum: ["mental health", "relationship advice", "career counseling"],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
      required: true,
    },
    notes: {
      text: {
        type: String,
      },
      attachments: [{ type: String }],
    },
    paymentId: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
