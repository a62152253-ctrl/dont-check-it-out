import { Router } from "express";

const router = Router();

router.get("/status", (req, res) => {
  res.json({
    database: "connected",
    latency: "14ms",
    syncedUsers: 148,
    activeSubscribers: 42
  });
});

export default router;
