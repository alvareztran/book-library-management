import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    maxBorrowBooks: {
      type: Number,
      required: true,
    },
    borrowDurationDays: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Setting", settingSchema);
