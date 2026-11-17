import DocGia from "../models/reader.model.js";
import ApiError from "../utils/api-error.js";
import { hashPassword } from "../utils/password.util.js";
import { assertValidObjectId } from "../utils/object-id.util.js";

const GENDERS = ["male", "female", "other"];
const STATUSES = ["active", "inactive", "blocked"];

export const createReader = async (data) => {
  const { HoLot, Ten, NgaySinh, Phai, Email, Password, SoDienThoai, DiaChi } =
    data;

  if (
    !HoLot?.trim() ||
    !Ten?.trim() ||
    !NgaySinh ||
    !Email?.trim() ||
    !Password ||
    !SoDienThoai?.trim()
  ) {
    throw new ApiError(400, "Missing required fields.");
  }

  const birthDate = new Date(NgaySinh);
  if (Number.isNaN(birthDate.getTime())) {
    throw new ApiError(400, "Birthday is invalid.");
  }

  if (Phai && !GENDERS.includes(Phai)) {
    throw new ApiError(400, "Gender is invalid.");
  }

  const normalizedEmail = Email.trim().toLowerCase();
  const normalizedPhone = SoDienThoai.trim();

  const existingReader = await DocGia.findOne({
    $or: [{ Email: normalizedEmail }, { SoDienThoai: normalizedPhone }],
  });
  if (existingReader) {
    throw new ApiError(
      400,
      "Reader with this email or phone number already exists.",
    );
  }

  const reader = await DocGia.create({
    HoLot: HoLot.trim(),
    Ten: Ten.trim(),
    NgaySinh: birthDate,
    Phai,
    Email: normalizedEmail,
    Password: await hashPassword(Password),
    SoDienThoai: normalizedPhone,
    DiaChi: DiaChi?.trim() || undefined,
  });

  const safeReader = reader.toObject();
  delete safeReader.Password;
  return safeReader;
};

export const getAllReaders = async () => {
  const readers = await DocGia.find();
  return readers;
};

export const getReaderById = async (id) => {
  assertValidObjectId(id, "Reader id is invalid.");
  const reader = await DocGia.findById(id);
  if (!reader) {
    throw new ApiError(404, "Reader not found.");
  }
  return reader;
};

export const updateReader = async (id, data) => {
  assertValidObjectId(id, "Reader id is invalid.");

  const { HoLot, Ten, NgaySinh, Phai, SoDienThoai, DiaChi, Status } = data;

  if (Phai && !GENDERS.includes(Phai)) {
    throw new ApiError(400, "Gender is invalid.");
  }
  if (Status && !STATUSES.includes(Status)) {
    throw new ApiError(400, "Status is invalid.");
  }

  const updatedReader = await DocGia.findByIdAndUpdate(
    id,
    { HoLot, Ten, NgaySinh, Phai, SoDienThoai, DiaChi, Status },
    { new: true, runValidators: true },
  );
  if (!updatedReader) {
    throw new ApiError(404, "Reader not found.");
  }
  return updatedReader;
};

export const deleteReader = async (id) => {
  assertValidObjectId(id, "Reader id is invalid.");
  const deletedReader = await DocGia.findByIdAndDelete(id);
  if (!deletedReader) {
    throw new ApiError(404, "Reader not found.");
  }
  return deletedReader;
};
