import "dotenv/config";
// Polyfill global fetch with node-fetch to avoid undici/WebAssembly issues on shared hosting
import nodeFetch, { Headers as NodeHeaders, Request as NodeRequest, Response as NodeResponse } from "node-fetch";
if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = nodeFetch;
  // @ts-ignore
  globalThis.Headers = NodeHeaders;
  // @ts-ignore
  globalThis.Request = NodeRequest;
  // @ts-ignore
  globalThis.Response = NodeResponse;
}
import express from "express";
import { createServer } from "http";
import net from "net";
import fs from "fs";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

function serveStatic(app: express.Express) {
  // In production bundle, __dirname points to dist/ folder
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}`);
    console.error("Make sure dist/public exists with the built frontend files.");
  } else {
    console.log(`Serving static files from: ${distPath}`);
  }

  app.use(express.static(distPath));

  // fall through to index.html for SPA routing
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend not found. Please build the frontend first.");
    }
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Trust the first proxy (Namecheap / cPanel reverse proxy)
  // This allows req.protocol to correctly reflect https when behind a proxy
  app.set("trust proxy", 1);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback
  registerOAuthRoutes(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Serve static frontend files
  serveStatic(app);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
