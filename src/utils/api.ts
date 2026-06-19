const API_BASE = "/api";

function getToken(): string | null {
  try {
    return localStorage.getItem("jomasio_token");
  } catch {
    return null;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor");
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Erro ${res.status}: servidor indisponível`);
  }

  if (!res.ok) {
    throw new Error((json as Record<string, string>)?.error || "Erro na requisição");
  }

  return json as T;
}

export type AuthResponse = {
  token: string;
  user: { id: number; username: string; email: string };
};

export type SaveResponse = {
  data: unknown;
  updatedAt: string | null;
};

export const api = {
  register: (username: string, email: string, password: string) =>
    request<AuthResponse>("POST", "/auth/register", { username, email, password }),

  login: (email: string, password: string) =>
    request<AuthResponse>("POST", "/auth/login", { email, password }),

  me: () => request<{ user: { id: number; username: string; email: string } }>("GET", "/auth/me"),

  getSave: () => request<SaveResponse>("GET", "/save"),

  putSave: (data: unknown) =>
    request<{ success: boolean }>("PUT", "/save", { data }),
};
