import mongoose from "mongoose";

const sachSchema = new mongoose.Schema(
  {
    TenSach: {
      type: String,
      required: true,
    },
    DonGia: {
      type: Number,
      required: true,
      min: 0
    },
    SoQuyenDaMuon: {
      type: Number,
      default: 0,
      min: 0
    },
    SoLuong: {
      type: Number,
      required: true,
      min: 0
    },
    NamXuatBan: {
      type: Number,
      required: true
    },
    MaNXB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhaXuatBan",
      required: true,
    },
    TenTacGia: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
    },
    categories: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Sach", sachSchema);
