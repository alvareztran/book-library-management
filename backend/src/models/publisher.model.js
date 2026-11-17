import mongoose from "mongoose";

const nhaXuatBanSchema = new mongoose.Schema(
  {
    TenNXB: {
      type: String,
      required: true,
    },
    DiaChi: {
      type: String,
    },
    SoDienThoai: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("NhaXuatBan", nhaXuatBanSchema);
