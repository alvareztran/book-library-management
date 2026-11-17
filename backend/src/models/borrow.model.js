import mongoose from "mongoose";

const theoDoiMuonSachSchema = new mongoose.Schema(
  {
    MaDocGia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocGia",
      required: true,
    },
    MaSach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sach",
      required: true,
    },
    NgayMuon: {
      type: Date,
      required: true,
      default: Date.now,
    },
    NgayHenTra: {
      type: Date,
      default: null,
    },
    NgayTra: {
      type: Date,
      default: null,
    },
    Status: {
      type: String,
      enum: ["pending", "borrowing", "returned", "overdue", "rejected"],
      required: true,
      default: "pending",
    },
    ApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhanVien",
    },
  },
  { timestamps: true },
);

export default mongoose.model("TheoDoiMuonSach", theoDoiMuonSachSchema);
