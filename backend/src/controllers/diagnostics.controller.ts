import { Request, Response } from "express";

export function handleDiagnostics(req: Request, res: Response) {
  res.status(200).json({
    message: "Diagnostics diagnostic payload",
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpu: process.cpuUsage()
  });
}
