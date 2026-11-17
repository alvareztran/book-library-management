import express from "express";
import {
  createReader,
  getAllReaders,
  getReaderById,
  updateReader,
  deleteReader,
} from "../controllers/reader.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authenticate, authorize("admin", "librarian"));

router.post("/", createReader);
router.get("/", getAllReaders);
router.get("/:id", getReaderById);
router.put("/:id", updateReader);
router.delete("/:id", deleteReader);

export default router;
