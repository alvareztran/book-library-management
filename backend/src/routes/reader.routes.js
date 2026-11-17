import express from "express";
import {
  createReader,
  getAllReaders,
  getReaderById,
  updateReader,
  deleteReader,
} from "../controllers/reader.controller.js";

const router = express.Router();

router.post("/", createReader);
router.get("/", getAllReaders);
router.get("/:id", getReaderById);
router.put("/:id", updateReader);
router.delete("/:id", deleteReader);

export default router;
