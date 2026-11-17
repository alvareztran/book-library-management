import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import ApiError from "./utils/api-error.js";
import cookieParser from "cookie-parser";

const app = express();

// Khai báo Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Khai báo Routes
app.use("/api/auth", authRoutes);

// Route không tồn tại
app.use((req, res, next) => {
  next(new ApiError(404, `Không tìm thấy ${req.originalUrl}`));
});

export default app;
