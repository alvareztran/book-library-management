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
  },
  { timestamps: true },
);

export default mongoose.model("NhaXuatBan", nhaXuatBanSchema);
