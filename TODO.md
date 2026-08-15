adicionar baú na hellroom
colocar bau no hallJailson

fazer as imagens de maugrelo

continuar a história na brodiclass

criar imagens das salas que estão faltando: ProfessorRoom, second-A class, thirdBClass

Quando o jogador equipa um pet, assim como no jogo pokemon gold, o pet equipado deve aparecer no modo explore e ficar seguindo o jogador.

sempre que precisar resolver um problema de carregamento, use contro shift R

adicionar animação de burn em deise antes de redirecionar para cafeteria/three, quando termina o diálogo em que denis diz "expansão de domínio, fuuga" o npc deise deve ser queimado e desaparecer, somente então acontece a transição de cena.

adicionar informação de xp do pet no menu de pets

Desafio para eu mesmo (fácil): Cada pet tem um nv e uma barra de xp para subir de nível, exiba visualmente a informação de xpBar e xpFill do pet no menu de pets da navbar

existirão batalhas aquáticas (como no tanque dos cravos) em que o jogador vai ser forçado a
utilizar pets aquáticos na batalha, também podem haver pets de fogo em que o jogador irá utilizar
para poder lutar em locais quentes e pets voadores para lutar no ar.

lupita e riquelsonDog também podem ser montarias de terreno.

o jogador poderá voar no zecaUrubu sobrevoando a cidade após fazer alguma missão relacionada ao ato de voar.

Após o diálogo da brodiClassOne adicionar cutscene na livraria de neimito falando algo "abra kadabra" e as estantes abrindo, neimito e ematron entrando na passagem secreta.

criar imagem de todas as ferramentas

criar animação de craft de ferramentas

adicionar imagem dos profissionais de cada profissão (O jogador têrá que dialogar com eles para evoluir suas ferramentas de ranque)

fazer imagem dos brothers na cantina

exibir icone da tipagem sobrepondo a imagem de rosto do personagem, estando no canto inferior direito para o player e inferior esquerdo para o npc (visto que o npc é flipado)

Cada npc e personagem tem pelo menos um e no máximo 2 tipagens
por exemplo:
O personagem Marshadow é normalis e ventus
O npc leviathan é aquos e draco

adicionar conquistar por drop de pet, kill em alfas, kill de todas as tipagens

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