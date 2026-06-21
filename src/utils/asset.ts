export function asset(path: string) {
  if (path.startsWith("/")) {
    path = path.slice(1);
  }

  return `${import.meta.env.BASE_URL}${path}`;
}

export function resolveAsset(path?: string) {
  if (!path) return "";

  if (path.startsWith("http") || path.startsWith(import.meta.env.BASE_URL)) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${path.slice(1)}`;
  }

  return path;
}
