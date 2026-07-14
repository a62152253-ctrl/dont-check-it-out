import { Router } from "express";
import { getSecrets, createSecret, updateSecret, deleteSecret } from "../controllers/secrets.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Secure secret boundaries (Zero-knowledge envelope storage CRUD)
router.use(authenticateToken);

router.get("/", getSecrets);
router.post("/", createSecret);
router.put("/:id", updateSecret);
router.delete("/:id", deleteSecret);

export default router;
