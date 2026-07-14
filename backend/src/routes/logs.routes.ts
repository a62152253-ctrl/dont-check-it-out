import { Router } from "express";
import { getAuditLogs, postAuditLog } from "../controllers/logs.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getAuditLogs);
router.post("/", postAuditLog);

export default router;
