import mongoose from "mongoose";

const docGiaSchema = new mongoose.Schema(
  {
    HoLot: {
      type: String,
      required: true,
      trim: true,
    },
    Ten: {
      type: String,
      required: true,
      trim: true,
    },
    NgaySinh: {
      type: Date,
      required: true,
    },
    Phai: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    DiaChi: {
      type: String,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
      select: false,
    },
    SoDienThoai: {
      type: String,
      required: true,
      trim: true,
    },
    Status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("DocGia", docGiaSchema);
