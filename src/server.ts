import express from "express";
import { PORT } from "./config.js";
import { pingDatabase } from "./db.js";

const app = express();
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, database: pingDatabase() ? "up" : "down" });
});

// Your endpoints go here.

app.listen(PORT, () => {
  console.log(`api  http://localhost:${PORT}`);
});
