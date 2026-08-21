import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(username, email, password);
      void navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authContainer">
      <form className="authForm" onSubmit={handleSubmit}>
        <h1 className="authTitle">Criar Conta</h1>

        {error && <p className="authError">{error}</p>}

        <label className="authLabel">
          Nome de usuário
          <input
            className="authInput"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            placeholder="mínimo 3 caracteres"
          />
        </label>

        <label className="authLabel">
          Email
          <input
            className="authInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
          />
        </label>

        <label className="authLabel">
          Senha
          <input
            className="authInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="mínimo 6 caracteres"
          />
        </label>

        <button className="authButton" type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="authLink">
          Já tem conta? <Link to="/login">Entre</Link>
        </p>
      </form>
    </div>
  );
}
