import type { Express, Request, Response } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import { storagePut } from "./storage";
import { sdk } from "./_core/sdk";

// Store files in memory (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export function registerUploadRoute(app: Express) {
  app.post(
    "/api/upload",
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        // Authenticate the request - only admins can upload
        const user = await sdk.authenticateRequest(req).catch(() => null);
        if (!user || user.role !== "admin") {
          res.status(403).json({ error: "Forbidden" });
          return;
        }

        if (!req.file) {
          res.status(400).json({ error: "No file uploaded" });
          return;
        }

        const ext = req.file.originalname.split(".").pop() || "jpg";
        const key = `uploads/${nanoid()}.${ext}`;
        const { url } = await storagePut(key, req.file.buffer, req.file.mimetype);

        res.json({ url, key });
      } catch (err: any) {
        console.error("[Upload] Error:", err);
        res.status(500).json({ error: err.message || "Upload failed" });
      }
    }
  );
}
