import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import saveRoutes from "./routes/save.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/save", saveRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`⚔️  Jomasio server running on http://localhost:${PORT}`);
});
