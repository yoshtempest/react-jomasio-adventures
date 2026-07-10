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

export function cenariosPath(path: string) {
  return (asset(`/assets/cenarios/${path}`));
}

export function jomasioPath(path: string) {
  return (cenariosPath(`/jomasio/${path}`));
}

export function playerPath(path: string) {
  return (asset(`/assets/player/${path}`));
}

export function npcPath(path: string) {
  return (asset(`/assets/npcs/${path}`));
}

export function soundEffectPath(path: string) {
  return (asset(`/assets/songs/soundEffects/${path}`));
}

export function backgroundAudioPath(path: string) {
  return (asset(`/assets/songs/background/${path}`));
}

export function sfx(path: string) {
  return new Audio(soundEffectPath(`/${path}`));
}