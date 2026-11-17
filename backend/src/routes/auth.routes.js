import express from "express";
import {
  login,
  register,
  logout,
  refresh,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refresh);
router.post("/logout", logout);

export default router;
