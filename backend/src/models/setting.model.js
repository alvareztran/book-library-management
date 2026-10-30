import mongoose from "mongoose";


const settingSchema = new Schema(
  {
    maxBorrowBooks: {
      type: Number,
      required: true,
      min: 1,
    },
    borrowDurationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    finePerDay: {
      type: Number,
      required: true,
      default: 5000, 
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.Schema("Setting", settingSchema);
