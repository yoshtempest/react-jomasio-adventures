export const SCENE_NAMES: Record<string, string> = {
  "hall/one": "Hall de Entrada",
  "hall/hell": "Corredor Escuro",
  "hall/pandemony": "Pandemônio",
  "hall/center-one": "Hall Centro",
  "hall/center-two": "Hall Centro - Bloco 2",
  "hall/center-front": "Hall - Entrada do Centro",
  "hall/jailson-one": "Sala do Jailson",
  "hall/jailson-two": "Sala do Jailson - Fundos",
  "hall/left-one": "Hall Esquerdo",
  "hall/afterpcroom-one": "Hall - Saída do PC Room",
  "hall/thirdclass": "Terceira Sala",

  "pcroom/one": "Sala de PC - 1",
  "pcroom/two": "Sala de PC - 2",
  "pcroom/three": "Sala de PC - 3",
  "pcroom/four": "Sala de PC - 4",
  "pcroom/five": "Sala de PC - 5",
  "pcroom/six": "Sala de PC - 6",
  "pcroom/seven": "Sala de PC - 7",

  "cantina/one": "Cantina",
  "cantina/two": "Cantina - Fundos",

  "cafeteria/one": "Refeitório",
  "cafeteria/two": "Refeitório - Bloco 2",
  "cafeteria/three": "Refeitório - Bloco 3",
  "cafeteria/four": "Refeitório - Bloco 4",

  "library/one": "Biblioteca",
  "library/two": "Biblioteca - Acervo",
  "library/secret-passage": "Passagem Secreta",

  "director/one": "Diretoria",
  "director/two": "Diretoria - Sala do Diretor",

  "footballcourt/one": "Quadra de Futebol",
  "footballcourt/two": "Quadra - Vestuários",

  "hellroom/one": "Sala do Inferno",
  "hellroom/two": "Sala do Inferno - Câmara",
  "hellroom/three": "Sala do Inferno - Masmorra",
};

export function getSceneName(pathname: string): string {
  const key = pathname.replace(/^\//, "");
  return SCENE_NAMES[key] ?? key;
}
