import type { Express, Request, Response } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
import { sdk } from "./_core/sdk";

// Determine uploads directory: next to dist/public in production, or project root in dev
function getUploadsDir(): string {
  // In production: dist/public/uploads (served as static files)
  // In development: client/public/uploads
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    // import.meta.dirname is dist/ in production bundle
    const distPublic = path.resolve(
      typeof __dirname !== "undefined" ? __dirname : process.cwd(),
      "public",
      "uploads"
    );
    return distPublic;
  }
  return path.resolve(process.cwd(), "client", "public", "uploads");
}

// Store files in memory then write to disk
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

        // Try S3 first (works on Manus platform), fall back to local storage
        try {
          const { storagePut } = await import("./storage");
          const ext = req.file.originalname.split(".").pop() || "jpg";
          const key = `uploads/${nanoid()}.${ext}`;
          const { url } = await storagePut(key, req.file.buffer, req.file.mimetype);
          res.json({ url, key });
          return;
        } catch (s3Err) {
          console.warn("[Upload] S3 unavailable, falling back to local storage:", (s3Err as Error).message);
        }

        // Local storage fallback (for Namecheap and similar shared hosting)
        const uploadsDir = getUploadsDir();
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const ext = req.file.originalname.split(".").pop()?.toLowerCase() || "jpg";
        const filename = `${nanoid()}.${ext}`;
        const filePath = path.join(uploadsDir, filename);

        fs.writeFileSync(filePath, req.file.buffer);

        // Return URL relative to the site root
        const url = `/uploads/${filename}`;
        res.json({ url, key: url });
      } catch (err: any) {
        console.error("[Upload] Error:", err);
        res.status(500).json({ error: err.message || "Upload failed" });
      }
    }
  );

  // Serve uploaded files as static assets (for local storage fallback)
  app.use("/uploads", (req: Request, res: Response, next: any) => {
    const uploadsDir = getUploadsDir();
    const filePath = path.join(uploadsDir, path.basename(req.path));
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });
}
