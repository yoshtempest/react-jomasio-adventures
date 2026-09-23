import { playerPath } from "@/utils/paths";
import { AbilityOverlay } from "@/components/Game/Battle/Effects/AbilityOverlay";

type Props = {
  active: boolean;
  character: string | null;
  /** Habilidade com background próprio (ex: "atomic" → habilities/atomic/background.svg). */
  ability?: string | null;
};

export function SpecialIntro({ active, character, ability = null }: Props) {
  if (!active || !character) return null;

  const backgroundSrc = ability
    ? playerPath(
        `/${character}/inFight/default/habilities/${ability}/background.svg`,
      )
    : playerPath(`/${character}/specialBackground.svg`);

  return <AbilityOverlay active={active} src={backgroundSrc} />;
}