import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import authRoutes from "./routes/auth.routes.js";
import secretsRoutes from "./routes/secrets.routes.js";
import logsRoutes from "./routes/logs.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: "*" })); // Configure accordingly for prod
app.use(express.json());

// Loggers
app.use(morgan("dev"));
app.use(requestLogger);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// Routing Boundaries
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/secrets", secretsRoutes);
app.use("/api/v1/logs", logsRoutes);

// General Fallback
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[CipherVault Backend] running on http://localhost:${PORT}`);
});
