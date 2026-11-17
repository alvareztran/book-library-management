import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import borrowRoutes from "./routes/borrow.routes.js";
import publisherRoutes from "./routes/publisher.routes.js";
import readerRoutes from "./routes/reader.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import ApiError from "./utils/api-error.js";

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
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/readers", readerRoutes);
app.use("/api/settings", settingRoutes);

// Route không tồn tại
app.use((req, res, next) => {
  next(new ApiError(404, `Không tìm thấy ${req.originalUrl}`));
});

export default app;
