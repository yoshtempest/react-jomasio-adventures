import styles from "./styles.module.css";
import { useState, useCallback } from "react";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { NPC_CARDS } from "@/data/npc/cards";
import { REDEEMED_CARDS_KEY } from "@/data/storageKeys";
import { useInventory } from "@/contexts/InventoryContext";
import { usePlayer } from "@/contexts/PlayerContext";

type Props = {
  isSelected: boolean;
};

export function CardRedeem({ isSelected }: Props) {
  const { addCoins, addHyperCoins } = useCharacterProgress();

  const { addItem } = useInventory();
  const { player } = usePlayer();
  const [cardCode, setCardCode] = useState("");
  const [redeemMessage, setRedeemMessage] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const handleRedeemCard = useCallback(() => {
    const code = cardCode.trim();
    if (!code) {
      setRedeemMessage("Digite um código válido.");
      setRedeemSuccess(false);
      return;
    }

    const card = Object.values(NPC_CARDS).find((c) => c.code === code);
    if (!card) {
      setRedeemMessage("Código inválido.");
      setRedeemSuccess(false);
      return;
    }

    const redeemedStr = localStorage.getItem(REDEEMED_CARDS_KEY);
    const redeemed: string[] = redeemedStr ? JSON.parse(redeemedStr) : [];
    if (redeemed.includes(code)) {
      setRedeemMessage("Código já utilizado.");
      setRedeemSuccess(false);
      return;
    }

    redeemed.push(code);
    localStorage.setItem(REDEEMED_CARDS_KEY, JSON.stringify(redeemed));

    if (card.reward.coins) {
      addCoins(player.character, card.reward.coins);
    }
    if (card.reward.hyperCoins) {
      addHyperCoins(player.character, card.reward.hyperCoins);
    }
    if (card.reward.items) {
      for (const item of card.reward.items) {
        addItem({ id: item.id as ItemId, qty: item.qty ?? 1 });
      }
    }

    setRedeemMessage(`Carta "${card.name}" resgatada com sucesso!`);
    setRedeemSuccess(true);
    setCardCode("");
  }, [cardCode, player.character, addCoins, addHyperCoins, addItem]);

  return (
    <>
      <div
        className={`${styles.cardRedeemSection} ${isSelected ? styles.selected : ""}`}
      >
        {isSelected && <span className={styles.cursor}>▼</span>}
        <h3>Resgatar Carta</h3>
        <div className={styles.cardRedeemRow}>
          <input
            type="number"
            className={styles.cardInput}
            placeholder="Digite o código"
            value={cardCode}
            onChange={(e) => {
              setCardCode(e.target.value);
              setRedeemMessage(null);
            }}
            maxLength={10}
          />
          <button
            className={styles.redeemButton}
            onClick={handleRedeemCard}
            type="button"
          >
            Resgatar
          </button>
        </div>
        {redeemMessage && (
          <p
            className={`${styles.redeemMessage} ${redeemSuccess ? styles.success : ""}`}
          >
            {redeemMessage}
          </p>
        )}
      </div>
    </>
  );
}
