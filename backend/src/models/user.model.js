import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true
    },
    passwordHash: {
      type: String,
      requied: true,
      select: false
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "librarian", "reader"],
      default: "reader",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "blocked"],
      default: "active"
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
