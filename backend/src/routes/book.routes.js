import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", authorize("admin", "librarian"), createBook);
router.put("/:id", authorize("admin", "librarian"), updateBook);
router.delete("/:id", authorize("admin", "librarian"), deleteBook);

export default router;
