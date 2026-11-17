import * as borrowService from "../services/borrow.service.js";

export const createBorrowRecord = async (req, res) => {
  const data =
    req.userType === "DocGia"
      ? { ...req.body, MaDocGia: req.userId }
      : req.body;
  const borrowRecord = await borrowService.createBorrowRecord(data);
  return res.status(201).json({
    success: true,
    message: "Borrow record created successfully.",
    data: borrowRecord,
  });
};

export const getAllBorrowRecords = async (req, res) => {
  const borrowRecords = await borrowService.getAllBorrowRecords();
  return res.status(200).json({
    success: true,
    data: borrowRecords,
  });
};

export const getBorrowRecordById = async (req, res) => {
  const borrowRecord = await borrowService.getBorrowRecordById(req.params.id);
  return res.status(200).json({
    success: true,
    data: borrowRecord,
  });
};

export const updateBorrowRecord = async (req, res) => {
  const updatedBorrowRecord = await borrowService.updateBorrowRecord(
    req.params.id,
    req.body,
  );
  return res.status(200).json({
    success: true,
    message: "Borrow record updated successfully.",
    data: updatedBorrowRecord,
  });
};

export const approveBorrowRecord = async (req, res) => {
  const borrowRecord = await borrowService.approveBorrowRecord(
    req.params.id,
    req.userId,
  );
  return res.status(200).json({
    success: true,
    message: "Borrow record approved successfully.",
    data: borrowRecord,
  });
};

export const returnBorrowRecord = async (req, res) => {
  const borrowRecord = await borrowService.returnBorrowRecord(req.params.id);
  return res.status(200).json({
    success: true,
    message: "Borrow record returned successfully.",
    data: borrowRecord,
  });
};

export const deleteBorrowRecord = async (req, res) => {
  const deletedBorrowRecord = await borrowService.deleteBorrowRecord(
    req.params.id,
  );
  return res.status(200).json({
    success: true,
    message: "Borrow record deleted successfully.",
    data: deletedBorrowRecord,
  });
};
