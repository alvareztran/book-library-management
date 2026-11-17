import mongoose from "mongoose";
import ApiError from "./api-error.js";

export const assertValidObjectId = (value, message = "Invalid id.") => {
  if (!mongoose.isValidObjectId(value)) {
    throw new ApiError(400, message);
  }
};
