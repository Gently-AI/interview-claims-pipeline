import express from "express";
import { PORT } from "./config.js";
import { pingDatabase } from "./db.js";

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, database: pingDatabase() ? "up" : "down" });
});

// Your endpoints go here.

const server = app.listen(PORT, () => {
  console.log(`api  http://localhost:${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} is already in use.\n` +
        `Set PORT to something else in .env.local, or free it with:  lsof -ti :${PORT} | xargs kill\n`,
    );
    process.exit(1);
  }
  throw error;
});
