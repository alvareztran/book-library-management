import { mongoose, Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      requied: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", ""],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);