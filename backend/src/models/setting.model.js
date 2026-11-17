import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    maxBorrowBooks: {
      type: Number,
      required: true,
      default: 5,
    },
    maxBorrowDurationDays: {
      type: Number,
      required: true,
      default: 30,
    },
    finePerDay: {
      type: Number,
      required: true,
      default: 5000,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Setting", settingSchema);
