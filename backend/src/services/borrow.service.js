import TheoDoiMuonSach from "../models/borrow.model.js";
import DocGia from "../models/reader.model.js";
import Sach from "../models/book.model.js";
import Setting from "../models/setting.model.js";
import ApiError from "../utils/api-error.js";
import { assertValidObjectId } from "../utils/object-id.util.js";

const ACTIVE_STATUSES = ["pending", "borrowing", "overdue"];

const getSettings = async () => (await Setting.findOne()) ?? new Setting();

const countActiveBorrows = (maDocGia, excludeId) =>
  TheoDoiMuonSach.countDocuments({
    MaDocGia: maDocGia,
    Status: { $in: ACTIVE_STATUSES },
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  });

const assertReaderCanBorrow = async (maDocGia, excludeId) => {
  const reader = await DocGia.findById(maDocGia);
  if (!reader) {
    throw new ApiError(404, "Reader not found.");
  }
  if (reader.Status !== "active") {
    throw new ApiError(403, "Reader account is not active.");
  }

  const setting = await getSettings();
  const activeBorrows = await countActiveBorrows(maDocGia, excludeId);
  if (activeBorrows >= setting.maxBorrowBooks) {
    throw new ApiError(
      400,
      `Reader has reached the maximum of ${setting.maxBorrowBooks} borrowed books.`,
    );
  }

  return setting;
};

export const createBorrowRecord = async (data) => {
  const { MaDocGia, MaSach } = data;
  if (!MaDocGia || !MaSach) {
    throw new ApiError(400, "Missing required fields.");
  }
  assertValidObjectId(MaDocGia, "Reader id is invalid.");
  assertValidObjectId(MaSach, "Book id is invalid.");

  await assertReaderCanBorrow(MaDocGia);

  const book = await Sach.findById(MaSach);
  if (!book) {
    throw new ApiError(404, "Book not found.");
  }
  if (book.SoLuong - (book.SoQuyenDaMuon ?? 0) <= 0) {
    throw new ApiError(400, "Book is out of stock.");
  }

  const newBorrowRecord = new TheoDoiMuonSach({ MaDocGia, MaSach });
  const savedBorrowRecord = await newBorrowRecord.save();
  return savedBorrowRecord;
};

export const getAllBorrowRecords = async () => {
  const borrowRecords = await TheoDoiMuonSach.find();
  return borrowRecords;
};

export const getBorrowRecordById = async (id) => {
  assertValidObjectId(id, "Borrow record id is invalid.");
  const borrowRecord = await TheoDoiMuonSach.findById(id);
  if (!borrowRecord) {
    throw new ApiError(404, "Borrow record not found.");
  }
  return borrowRecord;
};

export const updateBorrowRecord = async (id, data) => {
  const { MaDocGia, MaSach } = data;
  assertValidObjectId(id, "Borrow record id is invalid.");
  if (MaDocGia != null) {
    assertValidObjectId(MaDocGia, "Reader id is invalid.");
  }
  if (MaSach != null) {
    assertValidObjectId(MaSach, "Book id is invalid.");
  }

  const borrowRecord = await TheoDoiMuonSach.findById(id);
  if (!borrowRecord) {
    throw new ApiError(404, "Borrow record not found.");
  }

  const changesTarget =
    (MaDocGia != null && String(MaDocGia) !== String(borrowRecord.MaDocGia)) ||
    (MaSach != null && String(MaSach) !== String(borrowRecord.MaSach));
  if (changesTarget && borrowRecord.Status !== "pending") {
    throw new ApiError(
      400,
      "Reader and book can only be changed while the record is pending.",
    );
  }

  if (MaDocGia != null) {
    const reader = await DocGia.findById(MaDocGia);
    if (!reader) {
      throw new ApiError(404, "Reader not found.");
    }
  }
  if (MaSach != null) {
    const book = await Sach.findById(MaSach);
    if (!book) {
      throw new ApiError(404, "Book not found.");
    }
  }

  const updatedBorrowRecord = await TheoDoiMuonSach.findByIdAndUpdate(
    id,
    { MaDocGia, MaSach },
    { new: true },
  );
  return updatedBorrowRecord;
};

export const approveBorrowRecord = async (id, approvedBy) => {
  assertValidObjectId(id, "Borrow record id is invalid.");
  assertValidObjectId(approvedBy, "Staff id is invalid.");

  const borrowRecord = await TheoDoiMuonSach.findById(id);
  if (!borrowRecord) {
    throw new ApiError(404, "Borrow record not found.");
  }
  if (borrowRecord.Status !== "pending") {
    throw new ApiError(400, "Only pending borrow records can be approved.");
  }

  const setting = await assertReaderCanBorrow(
    borrowRecord.MaDocGia,
    borrowRecord._id,
  );

  const book = await Sach.findOneAndUpdate(
    {
      _id: borrowRecord.MaSach,
      $expr: { $lt: [{ $ifNull: ["$SoQuyenDaMuon", 0] }, "$SoLuong"] },
    },
    { $inc: { SoQuyenDaMuon: 1 } },
    { new: true },
  );
  if (!book) {
    throw new ApiError(400, "Book is out of stock.");
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + setting.maxBorrowDurationDays);

  borrowRecord.Status = "borrowing";
  borrowRecord.NgayMuon = new Date();
  borrowRecord.NgayHenTra = dueDate;
  borrowRecord.ApprovedBy = approvedBy;
  await borrowRecord.save();
  return borrowRecord;
};

export const returnBorrowRecord = async (id) => {
  assertValidObjectId(id, "Borrow record id is invalid.");

  const borrowRecord = await TheoDoiMuonSach.findById(id);
  if (!borrowRecord) {
    throw new ApiError(404, "Borrow record not found.");
  }
  if (!["borrowing", "overdue"].includes(borrowRecord.Status)) {
    throw new ApiError(400, "Only borrowed records can be returned.");
  }

  const book = await Sach.findOneAndUpdate(
    { _id: borrowRecord.MaSach, SoQuyenDaMuon: { $gt: 0 } },
    { $inc: { SoQuyenDaMuon: -1 } },
  );
  if (!book) {
    throw new ApiError(
      404,
      "Book not found or borrowed copy count is invalid.",
    );
  }

  borrowRecord.Status = "returned";
  borrowRecord.NgayTra = new Date();
  await borrowRecord.save();
  return borrowRecord;
};

export const deleteBorrowRecord = async (id) => {
  assertValidObjectId(id, "Borrow record id is invalid.");

  const borrowRecord = await TheoDoiMuonSach.findById(id);
  if (!borrowRecord) {
    throw new ApiError(404, "Borrow record not found.");
  }
  if (["borrowing", "overdue"].includes(borrowRecord.Status)) {
    throw new ApiError(400, "Cannot delete an active borrow record.");
  }

  await TheoDoiMuonSach.deleteOne({ _id: id });
  return borrowRecord;
};
