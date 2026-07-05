import { asset } from "@/utils/asset";

function sfx(path: string) {
    return new Audio(asset(`/assets/songs/soundEffects/${path}`));
}

export function createSounds() {
    return {
        win: sfx("player/win.mp3"),
        defeat: sfx("player/defeat.mp3"),
        run: sfx("player/run.mp3"),
        tryAgain: sfx("player/tryAgain.mp3"),
        receivedItem: sfx("player/receivedAnItem.mp3"),
        usedItem: sfx("player/usedAnItem.mp3"),
        deliciometroIsFull: sfx("player/deliciometroIsFull.mp3"),
        questUpdated: sfx("player/questUpdated.mp3"),
        levelUp: sfx("player/levelUp.mp3"),
        loading: new Audio(asset("/assets/songs/transitions/blink.mp3")),
        moveMenu: sfx("menu/move.mp3"),
        selectMenu: sfx("menu/select.mp3"),
        closeMenu: sfx("menu/close.mp3"),
        chargingAttack: sfx("player/chargingAttack.mp3"),
        chargeAttack: sfx("player/chargeAttack.mp3"),
        swordDeflected: sfx("player/marcelo/sword-deflected.mp3"),
        jhowsimarVemCa: sfx("npc/jhowsimar/goHere.mp3"),
        marshadowSpecial: sfx("player/marcelo/special.mp3"),
        drikaSpecial: sfx("player/eduarda/special.mp3"),
        slimitaJump: sfx("npc/slimita/jump.mp3"),
        equip: new Audio(asset("/assets/songs/transitions/equip.mp3")),
        unequip: new Audio(asset("/assets/songs/transitions/unequip.mp3")),
        unlockedTitle: sfx("player/unlockedTitle.mp3"),
        eating: sfx("player/eating.mp3"),
        drinkingPotion: sfx("player/drinkingPotion.mp3"),
        jhowsimarJooj: sfx("npc/jhowsimar/throw.mp3"),
        boom: sfx("npc/slimita/boom.mp3"),
        gainXp: sfx("player/gainXp.mp3"),
        hungryDeath: sfx("npc/hungryDeath/giveMeAPlate.mp3"),
        bite: sfx("npc/hungryDeath/bite.mp3"),
        vandinhaPunch: sfx("npc/vandinhaFragment/punch.mp3"),
        breakDish: sfx("npc/vandinhaFragment/breakDish.mp3"),
        hulk: sfx("npc/hungryKing/hulk.mp3"),
        smash: sfx("npc/hungryKing/smash.mp3"),
        summon: sfx("npc/hungryKing/summon.mp3"),
    };
}