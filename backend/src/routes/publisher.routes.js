import express from "express";
import {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  updatePublisher,
  deletePublisher,
} from "../controllers/publisher.controller.js";

const router = express.Router();

router.get("/", getAllPublishers);
router.get("/:id", getPublisherById);
router.post("/", createPublisher);
router.put("/:id", updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
