import mongoose from "mongoose";

const nhanVienSchema = new mongoose.Schema(
  {
    HoTenNV: {
      type: String,
      required: true,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
      select: false,
    },
    ChucVu: {
      type: String,
      required: true,
      enum: ["admin", "librarian"],
    },
    DiaChi: {
      type: String,
    },
    SoDienThoai: {
      type: String,
      trim: true
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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

export default mongoose.model("NhanVien", nhanVienSchema);
