import express from "express";
import {
  getSetting,
  updateSetting,
} from "../controllers/setting.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize("admin", "librarian"), getSetting);
router.put("/", authorize("admin"), updateSetting);

export default router;
