import NhaXuatBan from "../models/publisher.model.js";
import ApiError from "../utils/api-error.js";
import { assertValidObjectId } from "../utils/object-id.util.js";

export const createPublisher = async (data) => {
  const { TenNXB, DiaChi, SoDienThoai } = data;
  if (!TenNXB || !DiaChi || !SoDienThoai) {
    throw new ApiError(400, "Missing required fields.");
  }
  const newPublisher = new NhaXuatBan({ TenNXB, DiaChi, SoDienThoai });
  const savedPublisher = await newPublisher.save();
  return savedPublisher;
};

export const getAllPublishers = async () => {
  const publishers = await NhaXuatBan.find();
  return publishers;
};

export const getPublisherById = async (id) => {
  assertValidObjectId(id, "Publisher id is invalid.");
  const publisher = await NhaXuatBan.findById(id);
  if (!publisher) {
    throw new ApiError(404, "Publisher not found.");
  }
  return publisher;
};

export const updatePublisher = async (id, data) => {
  const { TenNXB, DiaChi, SoDienThoai } = data;
  if (!TenNXB || !DiaChi || !SoDienThoai) {
    throw new ApiError(400, "Missing required fields.");
  }
  assertValidObjectId(id, "Publisher id is invalid.");
  const updatedPublisher = await NhaXuatBan.findByIdAndUpdate(
    id,
    { TenNXB, DiaChi, SoDienThoai },
    { new: true },
  );
  if (!updatedPublisher) {
    throw new ApiError(404, "Publisher not found.");
  }
  return updatedPublisher;
};

export const deletePublisher = async (id) => {
  assertValidObjectId(id, "Publisher id is invalid.");
  const deletedPublisher = await NhaXuatBan.findByIdAndDelete(id);
  if (!deletedPublisher) {
    throw new ApiError(404, "Publisher not found.");
  }
    return deletedPublisher;
};
