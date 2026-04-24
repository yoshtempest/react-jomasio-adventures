export type CharacterId = 
  | "marcelo"
  | "eduarda"
  | "samuel"
  | "artur"
  | "emanuel"
  | "larissa"
  | "mayra"
  | "camilly"
  | "lucas"
  | "lucaua"
  | "riquelme"
  | "hiago";

export type CharacterOption = {
  name: string;
  image: CharacterId;
  selectable: boolean;
};