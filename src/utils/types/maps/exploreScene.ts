export type NpcSizeResolver = (src: string) => number | undefined;

export type SceneNPCData = {
  src: string | NpcSrcResolver;
  gridX: number;
  gridY: number;
  size?: number | NpcSizeResolver;
  interaction?: (startDialogue: (d: Dialogue[]) => void) => void;
  /**
   * Classe extra do sprite. Efeitos de cena que precisam de CSS próprio (o
   * teleport do Sistema, por exemplo) entram por aqui em vez de remountar o
   * `<img>` — o `src` pode mudar de fase sem perder a animação.
   */
  className?: string;
  /**
   * Some do mapa sem desmontar: preserva posição e z-index, então um efeito
   * pode terminar de rodar com o sprite já invisível.
   */
  hidden?: boolean;
};

export type ItemPickupTile = {
  x: number;
  y: number;
  visible: boolean;
  height?: number;
  image?: string;
  size?: number;
};
