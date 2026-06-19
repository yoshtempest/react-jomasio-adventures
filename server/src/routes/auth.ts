import { type Request, type Response } from "express";
import express from "express";
import bcrypt from "bcryptjs";
import { insertUser, findUserByEmail, findUserByUsername, findUserById } from "../db.js";
import type { UserRow } from "../db.js";
import { signToken, authMiddleware, type AuthPayload } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "username, email e password são obrigatórios" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });
      return;
    }

    const existingEmail = findUserByEmail.get(email);
    if (existingEmail) {
      res.status(409).json({ error: "Email já cadastrado" });
      return;
    }

    const existingUsername = findUserByUsername.get(username);
    if (existingUsername) {
      res.status(409).json({ error: "Nome de usuário já existe" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = insertUser.run(username, email, hashedPassword);

    const token = signToken({ userId: result.lastInsertRowid as number, username });

    res.status(201).json({
      token,
      user: { id: result.lastInsertRowid as number, username, email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "email e password são obrigatórios" });
      return;
    }

    const user = findUserByEmail.get(email) as UserRow | undefined;

    if (!user) {
      res.status(401).json({ error: "Email ou senha inválidos" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      res.status(401).json({ error: "Email ou senha inválidos" });
      return;
    }

    const token = signToken({ userId: user.id, username: user.username });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/me", authMiddleware, (req: Request, res) => {
  const userId = (req as Request & { user: AuthPayload }).user.userId;
  const user = findUserById.get(userId) as UserRow | undefined;

  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }

  res.json({ user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at } });
});

export default router;
