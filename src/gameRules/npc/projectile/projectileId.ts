/** Prefixo dos ids gerados para projéteis (usado pela Killer Queen como alvo). */
export const PROJECTILE_ID_PREFIX = "proj-";

let counter = 0;

/**
 * Id estável e único para um projétil. Projéteis precisam de identidade própria
 * (e não `createdAt`, que colide quando vários nascem no mesmo tick) para serem
 * alvos da Killer Queen e para removable por id.
 */
export function nextProjectileId(): string {
  counter += 1;
  return `${PROJECTILE_ID_PREFIX}${counter}`;
}

export function isProjectileId(id: string): boolean {
  return id.startsWith(PROJECTILE_ID_PREFIX);
}
