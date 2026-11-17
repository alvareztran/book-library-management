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
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createBorrowRecord);
router.get("/", authorize("admin", "librarian"), getAllBorrowRecords);
router.get("/:id", authorize("admin", "librarian"), getBorrowRecordById);
router.put("/:id", authorize("admin", "librarian"), updateBorrowRecord);
router.patch(
  "/:id/approve",
  authorize("admin", "librarian"),
  approveBorrowRecord,
);
router.patch(
  "/:id/return",
  authorize("admin", "librarian"),
  returnBorrowRecord,
);
router.delete("/:id", authorize("admin", "librarian"), deleteBorrowRecord);

export default router;
