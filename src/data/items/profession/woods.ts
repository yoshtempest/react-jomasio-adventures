import { createMaterials } from "@/utils/items/createMaterial";

const toFileName = (id: string) =>
  id.replace(/_wood$/, "").replace(/^moon_of_changing_eras$/, "moon");

export const WOODS = createMaterials(
  "woods",
  {
    ash_wood: {
      name: "Ash Wood",
      description:
        "A madeira mais básica de todas. Todo lenhador começa por aqui.",
    },
    jonik_ash_wood: {
      name: "Jonik Ash Wood",
      description:
        "Uma Ash Wood rara com marca de Jonik. Item dropável do Lenhador.",
    },
    hazel_wood: {
      name: "Hazel Wood",
      description: "Madeira de aveleira, versátil e resistente.",
    },
    babezel_wood: {
      name: "Babezel Wood",
      description: "Versão rara da Hazel Wood. Item dropável do Lenhador.",
    },
    chestnut_wood: {
      name: "Chestnut Wood",
      description: "Madeira de castanheiro, firme e durável.",
    },
    rare_chestnut_wood: {
      name: "Chestnut Wood rara",
      description: "Chestnut Wood rara e reluzente. Item dropável do Lenhador.",
    },
    apiwood: {
      name: "Apiwood",
      description: "Madeira misteriosa com leve aroma de mel.",
    },
    premier_api_wood: {
      name: "Francis Premier Api Wood",
      description: "Apiwood nobre e premiada. Item dropável do Lenhador.",
    },
    birch_wood: {
      name: "Madeira de Bétula",
      description: "Quem é essa mesmo?",
    },
    rare_birch_wood: {
      name: "Birch Wood rara",
      description: "Bétula rara de brilho suave. Item dropável do Lenhador.",
    },
    baobab_wood: {
      name: "Boabob Wood",
      description: "Madeira gigante vinda do baobá.",
    },
    rare_baobab_wood: {
      name: "Boabob Wood rara",
      description: "Baobá raro e colossal. Item dropável do Lenhador.",
    },
    weeping_willow_wood: {
      name: "Weeping Willow Wood",
      description: "Madeira de salgueiro-chorão, flexível e triste.",
    },
    rare_weeping_willow_wood: {
      name: "Weeping Willow Wood rara",
      description:
        "Salgueiro-chorão raro e melancólico. Item dropável do Lenhador.",
    },
    citronana_wood: {
      name: "Citronana Wood",
      description: "Madeira cítrica e refrescante.",
    },
    rare_citronana_wood: {
      name: "Citronana Wood rara",
      description:
        "Citronana rara com aroma intenso. Item dropável do Lenhador.",
    },
    baby_redwood_wood: {
      name: "Baby Redwood Wood",
      description: "Madeira de uma sequoia ainda jovem.",
    },
    rare_baby_redwood_wood: {
      name: "Baby Redwood Wood rara",
      description: "Sequoia jovem e rara. Item dropável do Lenhador.",
    },
    pooplar_wood: {
      name: "Pooplar Wood",
      description: "Madeira leve e cheirosa de choupo.",
    },
    rare_pooplar_wood: {
      name: "Pooplar Wood rara",
      description: "Choupo raro e perfumado. Item dropável do Lenhador.",
    },
    hornbeam_wood: {
      name: "Hornbeam Wood",
      description: "Carpa-madeira, dura e precisa.",
    },
    rare_hornbeam_wood: {
      name: "Hornbeam Wood rara",
      description: "Carpa-madeira rara e densa. Item dropável do Lenhador.",
    },
    tadbole_wood: {
      name: "Tadbole Wood",
      description: "Madeira salpicada, cheia de nós.",
    },
    rare_tadbole_wood: {
      name: "Tadbole Wood rara",
      description: "Tadbole rara e nodosa. Item dropável do Lenhador.",
    },
    climbing_tree: {
      name: "Climbing Tree",
      description: "Madeira de árvore trepadeira, retorcida.",
    },
    rare_climbing_tree: {
      name: "Climbing Tree rara",
      description: "Trepadeira rara e entrelaçada. Item dropável do Lenhador.",
    },
    frozen_wood: {
      name: "Frozen Wood",
      description: "Madeira congelada, gelada ao toque.",
    },
    rare_frozen_wood: {
      name: "Frozen Wood rara",
      description:
        "Madeira congelada rara e cristalina. Item dropável do Lenhador.",
    },
    yew_wood: {
      name: "Yew Wood",
      description: "Madeira de teixo, conhecida por arcos lendários.",
    },
    rare_yew_wood: {
      name: "Yew Wood rara",
      description: "Teixo raro e ancestral. Item dropável do Lenhador.",
    },
    prickly_wood: {
      name: "Prickly Wood",
      description: "Madeira espinhenta que machuca ao corte.",
    },
    rare_prickly_wood: {
      name: "Prickly Wood rara",
      description:
        "Madeira espinhosa rara e perigosa. Item dropável do Lenhador.",
    },
    mosscandel_wood: {
      name: "Mosscandel Wood",
      description: "Madeira coberta de musgo e candelabros.",
    },
    rare_mosscandel_wood: {
      name: "Mosscandel Wood rara",
      description: "Mosscandel rara e luminosa. Item dropável do Lenhador.",
    },
    marmalot_wood: {
      name: "Marmalot Wood",
      description: "Madeira doce, cheira a marmelada.",
    },
    rare_marmalot_wood: {
      name: "Marmalot Wood rara",
      description: "Marmalot rara e adocicada. Item dropável do Lenhador.",
    },
    elderberry_wood: {
      name: "Elderberry Wood",
      description: "Madeira de sabugueiro, cheia de bagas.",
    },
    rare_elderberry_wood: {
      name: "Elderberry Wood rara",
      description: "Sabugueiro raro e frutado. Item dropável do Lenhador.",
    },
    sylvan_wood: {
      name: "Sylvan Wood",
      description: "Madeira da floresta, viva e sábia.",
    },
    rare_sylvan_wood: {
      name: "Sylvan Wood rara",
      description: "Sylvan rara e antiga. Item dropável do Lenhador.",
    },
    dry_wood: {
      name: "Dry Wood",
      description: "Madeira seca, perfeita para fogueiras.",
    },
    rare_dry_wood: {
      name: "Dry Wood rara",
      description: "Dry Wood rara e ressecada. Item dropável do Lenhador.",
    },
    cherry_tree_wood: {
      name: "Cherry Tree Wood",
      description: "Madeira de cerejeira em flor, rosada e perfumada.",
    },
    rare_cherry_tree_wood: {
      name: "Cherry Tree Wood rara",
      description: "Cerejeira rara em plena flor. Item dropável do Lenhador.",
    },
    divi_divi_wood: {
      name: "Divi Divi Wood",
      description: "Madeira retorcida pelo vento costeiro.",
    },
    divi_up_wood: {
      name: "Divi Up Wood",
      description:
        "Divi Divi rara que cresceu para cima. Item dropável do Lenhador.",
    },
    kokonut_wood: {
      name: "Kokonut Wood",
      description: "Madeira de coqueiro, leve e resistente.",
    },
    rare_kokonut_wood: {
      name: "Kokonut Wood rara",
      description: "Coqueiro raro e tropical. Item dropável do Lenhador.",
    },
    mahogany_wood: {
      name: "Mahogany Wood",
      description: "Mogno nobre, escuro e valioso.",
    },
    rare_mahogany_wood: {
      name: "Mahogany Wood rara",
      description: "Mogno raro e reluzente. Item dropável do Lenhador.",
    },
    bramble_wood: {
      name: "Bramble Wood",
      description: "Madeira de sarça cheia de espinhos.",
    },
    rare_bramble_wood: {
      name: "Bramble Wood rara",
      description: "Sarça rara e impenetrável. Item dropável do Lenhador.",
    },
    carya_wood: {
      name: "Carya Wood",
      description: "Madeira de nogueira, dura e densa.",
    },
    rare_carya_wood: {
      name: "Carya Wood rara",
      description: "Nogueira rara e envelhecida. Item dropável do Lenhador.",
    },
    twisted_seaweed_wood: {
      name: "Twisted Seaweed Wood",
      description: "Madeira marinha retorcida pelas ondas.",
    },
    rare_twisted_seaweed_wood: {
      name: "Twisted Seaweed Wood rara",
      description: "Alga-marinha rara e encantada. Item dropável do Lenhador.",
    },
    despair_tree_wood: {
      name: "Despair Tree Wood",
      description: "Madeira de uma árvore repleta de desespero.",
    },
    desolation_wood: {
      name: "Desolation Wood",
      description: "Versão rara da Despair Tree. Item dropável do Lenhador.",
    },
    nonbeeching_wood: {
      name: "Nonbeeching Wood",
      description: "Madeira estranha e inquietante.",
    },
    madness_wood: {
      name: "Madness Wood",
      description:
        "Nonbeeching rara que inspira loucura. Item dropável do Lenhador.",
    },
    astracacia: {
      name: "Astracacia",
      description: "Madeira celestial, rara e brilhante.",
    },
    moon_of_changing_eras: {
      name: "Moon of Changing Eras",
      description: "Astracacia rara como a lua. Item dropável do Lenhador.",
    },
    luzyl: {
      name: "Luzyl",
      description: "A madeira suprema, repleta de luz.",
    },
    lazu_luzyl: {
      name: "Lazu-Luzyl",
      description: "A forma rara suprema da Luzyl. Item dropável do Lenhador.",
    },
  } as const,
  toFileName,
);
