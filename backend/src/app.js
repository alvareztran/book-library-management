import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";


const app = express();

// Khai báo Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

// Khai báo Routes
app.use("/api/auth", authRoutes);

export default app;