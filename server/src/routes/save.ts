import express from "express";
import { authMiddleware, type AuthPayload } from "../middleware/auth.js";
import { getSave, upsertSave } from "../db.js";
import type { Request } from "express";

const router = express.Router();

router.get("/", authMiddleware, (req: Request, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const row = getSave.get(userId) as { data: string; updated_at: string } | undefined;

    if (!row) {
      res.json({ data: null, updatedAt: null });
      return;
    }

    res.json({
      data: JSON.parse(row.data),
      updatedAt: row.updated_at,
    });
  } catch (err) {
    console.error("Get save error:", err);
    res.status(500).json({ error: "Erro ao carregar save" });
  }
});

router.put("/", authMiddleware, (req: Request, res) => {
  try {
    const { userId } = (req as Request & { user: AuthPayload }).user;
    const { data } = req.body;

    if (data === undefined || data === null) {
      res.status(400).json({ error: "data é obrigatório" });
      return;
    }

    upsertSave.run(userId, JSON.stringify(data));

    res.json({ success: true });
  } catch (err) {
    console.error("Put save error:", err);
    res.status(500).json({ error: "Erro ao salvar" });
  }
});

export default router;
