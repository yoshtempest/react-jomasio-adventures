as tipagens são:

Aquos(água)
Pyrus(fogo)
Subterra(terra)
Ventus(vento)
Darkus(trevas)
Electricus(elétrico)
Haos(luz)
Metallum(metal)
Natura(natureza)
Psychicus(psíquico)
Nympha(fada)
Draco(dragão)
Umbra(fantasma)
Normalis(normal)

provavelmente irei fazer uma organização em

type ElementType =
| "Aquos"
| "Pyrus"
| "Subterra"
| "Ventus"
| "Darkus"
| "Electricus"
| "Haos"
| "Metallum"
| "Natura"
| "Psychicus"
| "Nympha"
| "Draco"
| "Umbra"
| "Normalis"

type WeaponType =
| "None"
| "Sword"
| "Whip"
| "Pistol"
| "Bow"
| "Spear"
| "Staff"
| "Claws";

type CombatStyle =
| "Pugnator"
| "Shooter"
| "Swordsman"
| "Mage";

Laricell pode mudar a tipagem dela com base na arma em que está equipada ou no cartucho de balas (tenho que pensar ainda)

🔥 Pyrus

Forte contra: Metallum, Natura
Fraco contra: Aquos, Subterra

O fogo derrete metal e destrói vegetação. Ventus pode alimentar o fogo, mas também pode espalhá-lo; aqui optei por uma relação de vantagem para Ventus.

🌎 Aquos

Forte contra: Pyrus, Subterra
Fraco contra: Electricus, Natura

🌎 Subterra

Forte contra: Pyrus, Electricus, Metallum
Fraco contra: Ventus, Natura, Aquos

Terra absorve água, bloqueia eletricidade e pode quebrar metal. Natura também se beneficia da terra.

🌪️ Ventus

Forte contra: Subterra, Natura
Fraco contra: Electricus, Metallum

O vento espalha fogo e pode desgastar terra/natureza, enquanto eletricidade e metal dão boas respostas ao vento.

🌑 Darkus

Forte contra: Haos, Nympha, Umbra, Psychicus
Fraco contra: Haos, Nympha, Umbra

Esse seria o elemento mais associado a corrupção, medo e manipulação.

⚡ Electricus

Forte contra: Aquos, Ventus, Natura
Fraco contra: Subterra, Metallum

Terra naturalmente serve como counter da eletricidade.

☀️ Haos

Forte contra: Darkus, Umbra
Fraco contra: Darkus, Umbra

Haos seria o elemento de luz, energia e pureza, sendo naturalmente oposto a Darkus/Umbra.

⚙️ Metallum

Forte contra: Ventus, Haos, Electricus
Fraco contra: Pyrus, Subterra

Metal é resistente fisicamente, mas vulnerável a corrosão, fogo, natureza, magia etc.

🌿 Natura

Forte contra: Aquos, Subterra
Fraco contra: Pyrus, Ventus, Metallum

Natura funciona como um elemento de crescimento e absorção, mas é vulnerável a fogo e ataques que destroem vegetação.

🧠 Psychicus

Forte contra: Umbra, Normalis
Fraco contra: Darkus, Haos

Psychicus poderia representar mente, telecinese, ilusão e manipulação.

🧚 Nympha

Forte contra: Darkus, Haos, Draco
Fraco contra: Ventus, Metallum, Umbra

Nympha seria seu tipo "mágico/fada", excelente contra Dragões e Trevas.

🐉 Draco

Forte contra: Draco, normalis
Fraco contra: Haos, Natura, Nympha, Draco

Eu manteria Draco como um tipo poderoso, mas com poucos counters, para dar sensação de tipo raro.

👻 Umbra

Forte contra: Darkus, Haos, Psychicus, Nympha
Fraco contra: Ventus, Umbra

Umbra seria mais associado a fantasmas, espíritos e existência sobrenatural, diferente de Darkus, que seria trevas/corrupção.

⚪ Normalis

Dano normal: Em todo o resto
Fraco contra: Psychicus

Crie uma tabela de que tipagens causam/sofrem dano super efetivo em que outras tipagens. Essa tabela deve estar no menu de configurações na Tab de batalha e o jogador deve estar em batalha.

Cada npc e personagem tem pelo menos um e no máximo 2 tipagens
por exemplo:
O personagem Marshadow é normalis e ventus
O npc leviathan é aquos e draco

---

## Como o código resolve a tabela

As duas listas acima ("Forte contra" / "Fraco contra") não se encaixavam:
em sete elementos, a lista de "fraco" não era o inverso da lista de
"forte", e em seis pares o mesmo elemento aparecia nos dois lados sem que
nada dissesse qual valia.

Para não ter mais como divergir, `src/data/types/elementChart.ts` mantém
**só a tabela de vantagem escrita à mão**. A desvantagem é gerada como o
inverso exato dela: se `A` é forte contra `D`, então `D` é fraco contra
`A`.

Isso muda a leitura de "Fraco contra" de sete elementos em relação ao texto
acima. A tabela que vale é esta:

| Elemento | Forte contra | Fraco contra (derivado) |
| --- | --- | --- |
| Pyrus | Metallum, Natura | Aquos, Subterra |
| Aquos | Pyrus, Subterra | Electricus, Natura |
| Subterra | Pyrus, Electricus, Metallum | Aquos, Ventus, Natura |
| Ventus | Subterra, Natura | Electricus, Metallum |
| Darkus | Haos, Nympha, Umbra, Psychicus | Haos, Nympha, Umbra |
| Electricus | Aquos, Ventus, Natura | Subterra, Metallum |
| Haos | Darkus, Umbra | Darkus, Metallum, Nympha, Umbra |
| Metallum | Ventus, Haos, Electricus | Pyrus, Subterra |
| Natura | Aquos, Subterra | Pyrus, Ventus, Electricus |
| Psychicus | Umbra, Normalis | Darkus, Umbra |
| Nympha | Darkus, Haos, Draco | Darkus, Umbra |
| Draco | Draco, Normalis | Nympha, Draco |
| Umbra | Darkus, Haos, Psychicus, Nympha | Darkus, Haos, Psychicus |
| Normalis | — | Psychicus, Draco |

Para mudar qualquer relação, edite **só** `ELEMENT_STRONG_AGAINST`. A coluna
da direita se ajusta sozinha.

Derivar não faz sumir todo par que cai nos dois lados: **vantagem mútua
continua existindo**. Darkus é forte contra Haos e Haos é forte contra
Darkus, então cada um aparece na lista de "fraco" do outro. Hoje há 11
pares assim, e `getElementMultiplier` testa vantagem antes de
desvantagem — todos resolvem **1.5x nas duas direções**.

A diferença é que isso virou consequência declarada da tabela de
vantagem, em vez de acidente de duas listas desencontradas. Se a intenção
for que opostos se anulem (1x), a mudança é em `CombatService`, não
aqui.
