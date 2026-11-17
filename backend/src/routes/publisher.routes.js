import express from "express";
import {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  updatePublisher,
  deletePublisher,
} from "../controllers/publisher.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getAllPublishers);
router.get("/:id", getPublisherById);
router.post("/", authorize("admin", "librarian"), createPublisher);
router.put("/:id", authorize("admin", "librarian"), updatePublisher);
router.delete("/:id", authorize("admin", "librarian"), deletePublisher);

export default router;
