import express from "express";
import {
  createBorrowRecord,
  getAllBorrowRecords,
  getBorrowRecordById,
  updateBorrowRecord,
  approveBorrowRecord,
  returnBorrowRecord,
  deleteBorrowRecord,
} from "../controllers/borrow.controller.js";

const router = express.Router();

router.post("/", createBorrowRecord);
router.get("/", getAllBorrowRecords);
router.get("/:id", getBorrowRecordById);
router.put("/:id", updateBorrowRecord);
router.patch("/:id/approve", approveBorrowRecord);
router.patch("/:id/return", returnBorrowRecord);
router.delete("/:id", deleteBorrowRecord);

export default router;
