import { mongoose, Schema } from "mongoose";

const publisherSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Publisher", publisherSchema);
