import mongoose from "mongoose";


const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    authorIds: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true
    },
    publisherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    publicationYear: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 0
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0
    },
    imageUrl: {
      type: string,
      required: true,
      default: ""
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Book", bookSchema);
