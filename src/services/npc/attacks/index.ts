import type { NpcType } from "@/data/npc/npc";
import { DefaultNpcAttack, NpcAttack } from "../npcAttack";
import { DummyAttack } from "./dummy";
import { DeiseAttack } from "./deise";
import { GoatAttack } from "./goat";
import { HungryDeathAttack } from "./hungryDeath";
import { HungryKingAttack } from "./hungryKing";
import { JhowsimarAttack } from "./jhowsimar";
import { MauraoAttack } from "./maurao";
import { MaugreloAttack } from "./maugrelo";
import { PiupiuAttack } from "./piupiu";
import { SlimitaAttack } from "./slimita";
import { VandinhaFragmentAttack } from "./vandinhaFragment";

/**
 * Registry de ataques por NPC. `satisfies Record<NpcType, NpcAttack>` faz
 * qualquer NPC de `NPC_CLASSES` sem ataque registrado quebrar a compilação.
 *
 * Todo NPC novo precisa do próprio arquivo em `attacks/<npcType>.ts`
 * estendendo `NpcAttack` (ou `DefaultNpcAttack`) e de uma entrada aqui.
 */
export const npcAttacks = {
  /* Jomasio */
  hungryDeath: new HungryDeathAttack(),
  piupiu: new PiupiuAttack(),
  rice: new DefaultNpcAttack("rice"),
  jhowsimar: new JhowsimarAttack(),
  goat: new GoatAttack(),
  vandinhaFragment: new VandinhaFragmentAttack(),
  trueVandinha: new DefaultNpcAttack("trueVandinha"),
  deise: new DeiseAttack(),
  necromancer: new DefaultNpcAttack("necromancer"),
  slimita: new SlimitaAttack(),
  hungryKing: new HungryKingAttack(),
  denis: new DefaultNpcAttack("denis"),
  srGuaxinim: new DefaultNpcAttack("srGuaxinim"),
  neimito: new DefaultNpcAttack("neimito"),
  planetarySisters: new DefaultNpcAttack("planetarySisters"),
  manim: new DefaultNpcAttack("manim"),
  maurao: new MauraoAttack(),
  maugrelo: new MaugreloAttack(),

  /* Bocaina */
  hungryDog: new DefaultNpcAttack("hungryDog"),
  lupita: new DefaultNpcAttack("lupita"),
  duque: new DefaultNpcAttack("duque"),
  baiano: new DefaultNpcAttack("baiano"),
  spiritMotocycler: new DefaultNpcAttack("spiritMotocycler"),
  tim: new DefaultNpcAttack("tim"),
  muyMacho: new DefaultNpcAttack("muyMacho"),

  /* Lagoa grande */
  hungryFish: new DefaultNpcAttack("hungryFish"),
  hungryCow: new DefaultNpcAttack("hungryCow"),
  fischer: new DefaultNpcAttack("fischer"),
  leviathan: new DefaultNpcAttack("leviathan"),

  /* Cachoeiras */
  figurantOfBaalCult: new DefaultNpcAttack("figurantOfBaalCult"),
  baal: new DefaultNpcAttack("baal"),
  madame: new DefaultNpcAttack("madame"),

  /* Barragem */
  figurantOfMobyDickCult: new DefaultNpcAttack("figurantOfMobyDickCult"),
  crocodile: new DefaultNpcAttack("crocodile"),
  elitCrocodile: new DefaultNpcAttack("elitCrocodile"),
  mobyDick: new DefaultNpcAttack("mobyDick"),
  yangKai: new DefaultNpcAttack("yangKai"),

  /* Tanque dos crávos */
  figurantOfDragonKingCult: new DefaultNpcAttack("figurantOfDragonKingCult"),
  ains: new DefaultNpcAttack("ains"),
  dragonKing: new DefaultNpcAttack("dragonKing"),

  /* Lagoa do Canto */
  hungryPig: new DefaultNpcAttack("hungryPig"),
  technoblade: new DefaultNpcAttack("technoblade"),

  /* Training */
  dummy: new DummyAttack(),

  /* Indefinido */
  theDevourerOfWorlds: new DefaultNpcAttack("theDevourerOfWorlds"),
  theStrongestManUnderTheHeavens: new DefaultNpcAttack(
    "theStrongestManUnderTheHeavens",
  ),
  theBlackKnight: new DefaultNpcAttack("theBlackKnight"),
  untrackedMonster: new DefaultNpcAttack("untrackedMonster"),
  theMasterPiece: new DefaultNpcAttack("theMasterPiece"),
  theChaosCreator: new DefaultNpcAttack("theChaosCreator"),
  theFirstNightmare: new DefaultNpcAttack("theFirstNightmare"),
} satisfies Record<NpcType, NpcAttack>;

/**
 * Resolve o ataque de um NPC. Se o NPC não tiver ataque definido, lança
 * erro — batalha sem regra de ataque é bug de dados/registro.
 */
export function getNpcAttack(npcType: string): NpcAttack {
  const attack = npcAttacks[npcType as NpcType];

  if (!attack) {
    throw new Error(
      `[batalha] NPC "${npcType}" não tem ataque definido. Crie services/npc/attacks/${npcType}.ts e registre-o em attacks/index.ts.`,
    );
  }

  return attack;
}
