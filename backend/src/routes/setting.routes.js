import express from "express";
import {
  getSetting,
  updateSetting,
} from "../controllers/setting.controller.js";

const router = express.Router();

router.get("/", getSetting);
router.put("/", updateSetting);

export default router;
