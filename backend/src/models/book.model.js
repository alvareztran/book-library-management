import { mongoose, Schema } from "mongoose";

const Book = new Schema({
  title: {
    type: String,
    required: true,
  },
  authorIds: [],
});
