import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "counselor"],
      default: "client",
      required: true,
    },
    specialization: {
      type: String,
      enum: ["mental health", "relationship advice", "career counseling"],
      required: function () {
        return this.role === "counselor";
      },
    },
    experience: {
      type: Number,
      required: function () {
        return this.role === "counselor";
      },
    },
    amount: {
      type: Number,
      default: function () {
        return this.role === "counselor" ? 500 : undefined;
      },
    },
    availability: {
      type: [
        {
          day: { type: String, required: true },
          from: { type: String, required: true },
          to: { type: String, required: true },
        },
      ],
      required: function () {
        return this.role === "counselor";
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
