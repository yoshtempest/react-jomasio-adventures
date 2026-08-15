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