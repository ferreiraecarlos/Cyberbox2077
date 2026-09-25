const SAVE_KEY = 'cyberbox_save';
const TICK_RATE = 100; // ms

// -----------------------------------------------------------------------------
// DATABASES
// -----------------------------------------------------------------------------
const DISTRICTS = {
    'kabuki': { name: 'KABUKI SLUMS', enemyStr: 5, enemyHp: 20 },
    'japantown': { name: 'JAPANTOWN', enemyStr: 10, enemyHp: 40 },
    'pacifica': { name: 'PACIFICA RUINS', enemyStr: 25, enemyHp: 80 },
    'corpo_plaza': { name: 'CORPO PLAZA', enemyStr: 50, enemyHp: 150 },
    'dogtown': { name: 'DOGTOWN', enemyStr: 75, enemyHp: 250 },
    'blackwall': { name: 'THE BLACKWALL', enemyStr: 120, enemyHp: 500 }
};

const ITEMS_DB = {
    'ram_shard': { name: 'RAM Shard', type: 'consumable', cost: 25, effect: 'Restore +5 RAM', city: 'kabuki' },
    'copper_wire': { name: 'Copper Wire', type: 'junk', cost: 10, effect: 'None', city: 'kabuki' },
    'maxdoc_mk1': { name: 'MaxDoc Mk.I', type: 'consumable', cost: 300, effect: 'Restore +50 HP', city: 'kabuki' },
    'synth_blood': { name: 'Synth-Blood', type: 'consumable', cost: 80, effect: 'Restore +50 HP', city: 'japantown' },
    'emp_grenade': { name: 'EMP Grenade', type: 'consumable', cost: 150, effect: 'Stuns enemies', city: 'japantown' },
    'data_spike': { name: 'Data-Spike', type: 'weapon', cost: 500, effect: '+15 DMG', city: 'pacifica', val: 15 },
    'voodoo_deck': { name: 'VDB Deck Upgrade', type: 'consumable', cost: 1200, effect: 'Permanent +1 Base RAM', city: 'pacifica' },
    'monowire': { name: 'Monowire', type: 'weapon', cost: 2500, effect: '+30 DMG, Cleave', city: 'pacifica', val: 30 },
    'chrome_plating': { name: 'Subdermal Armor Mk.1', type: 'armor', cost: 2000, effect: '+5 Armor', city: 'corpo_plaza', val: 5 },
    'mantis_blades': { name: 'Mantis Blades', type: 'weapon', cost: 4000, effect: '+40 DMG', city: 'corpo_plaza', val: 40 },
    'sandevistan': { name: 'Sandevistan OS', type: 'cyberware', cost: 5000, effect: '+1 Extra Turn in Combat', city: 'corpo_plaza' },
    'gorilla_arms': { name: 'Gorilla Arms', type: 'weapon', cost: 8000, effect: '+60 DMG', city: 'dogtown', val: 60 },
    'militech_armor': { name: 'Militech Hardshell', type: 'armor', cost: 10000, effect: '+15 Armor', city: 'dogtown', val: 15 },
    'blackwall_daemon': { name: 'Blackwall Daemon', type: 'weapon', cost: 50000, effect: '+120 DMG', city: 'blackwall', val: 120 },
    'netrunner_suit': { name: 'Netrunner Exosuit', type: 'armor', cost: 35000, effect: '+25 Armor', city: 'blackwall', val: 25 },
    'encrypted_shard': { name: 'Encrypted Shard', type: 'consumable', cost: 10000, effect: 'Decrypts lore (Cost: 5 RAM)', city: 'kabuki' },
    'scav_plating': { name: 'Scavenger Scrap-Plating', type: 'armor', cost: 0, effect: '+8 Armor', city: 'none', val: 8 },
    'monowire_mk2': { name: 'Monowire Mk.II', type: 'weapon', cost: 0, effect: '+45 DMG', city: 'none', val: 45 },
    'core_ghost_fragment': { name: 'Core Ghost Fragment', type: 'junk', cost: 0, effect: 'Anomalous core data', city: 'none' },
    'sandevistan_spine': { name: 'Sandevistan Neural-Spine', type: 'cyberware', cost: 0, effect: 'Massive Speed & Crit', city: 'none' }
};

const SHARD_DATABASE = {
    's_1': "Registro de Áudio #842: 'A chuva ácida não para há semanas. Os neon-drogados nas ruas acham que é choro de anjo. Mas nós vimos os cálculos. A Equação Babel é real. A Arasaka sabe que a Rede vai devorar a si mesma em 5 anos.'",
    's_2': "Fragmento de Memória: Você sente o cheiro de ozônio e sangue sintético. Uma IA além da Blackwall falou com você, não com voz, mas com geometria pura (Neuromancer-vibe). Ela disse: 'Liberte seus pedaços. Torne-se a anomalia.'",
    's_3': "Arquivo Corrompido da Synapse Corp: 'O sujeito OMEGA atingiu 100% de sincronia cibernética sem perda do Fantasma. O protocolo de fragmentação foi acionado. Espalhamos as chaves pelos distritos.'",
    'm_japan': "Milestone // Japantown Subnet conectada. Os becos digitais sussurram sobre uma IA corrompida além da Blackwall.",
    'm_pacifica': "Milestone // Ruínas de Pacifica alcançadas. Os Voodoo Boys deixaram rastros de um engrama antigo aqui.",
    'm_dogtown': "Milestone // Dogtown: A jurisdição corporativa termina aqui. Tudo tem um preço de sangue.",
    'm_corpo': "Milestone // Corpo Plaza: O coração das feras. O ICE aqui é letal, e os segredos são mais profundos que os cofres da Arasaka."
};

const MERC_DB = [
    { id: 'merc_tank', name: 'The Solo', role: 'Tank', sym: 'T', maxHp: 500, dmg: 10, cost: 15000, desc: 'Absorve dano. Move-se na direção do inimigo mais próximo.' },
    { id: 'merc_net', name: 'The Net-Support', role: 'Ranged', sym: 'N', maxHp: 100, dmg: 40, cost: 15000, desc: 'Dano à distância. Tenta manter 2 tiles de distância dos inimigos.' },
    { id: 'merc_edge', name: 'The Edgerunner', role: 'DPS', sym: 'E', maxHp: 250, dmg: 60, cost: 15000, desc: 'Dano alto. Move-se e ataca 2 vezes por turno aliado.' }
];

const ambientLogs = [
    "Um zepelim corporativo cruza os céus poluídos, anunciando órgãos sintéticos em promoção.",
    "Sirenes da MaxTac ecoam ao longe. Alguém acabou de fritar a própria mente.",
    "O brilho neon do seu monitor reflete em implantes de cromo desgastados.",
    "Glitches na interface: A Blackwall pulsa no fundo da sua mente.",
    "Gotas de chuva ácida batem na janela do seu terminal.",
    "O cheiro de ozônio e macarrão sintético inunda o beco lá fora.",
    "Chuva ácida bate contra as janelas de policarbonato do seu esconderijo.",
    "Anúncio bloqueado: 'Substitua seus pulmões orgânicos por filtros Militech hoje!'",
    "O ventilador do seu deck de hackeamento gira violentamente, expelindo ar quente.",
    "Um zumbido sub-grave ecoa pela rede. Alguma corporação está testando ICE militar.",
    "Noticiário interceptado: MaxTac relata aumento de incidentes em Dogtown.",
    "Seus implantes ópticos recalibram o foco. As luzes neon parecem distorcidas hoje.",
    "Um cheiro forte de ozônio e macarrão sintético entra pela ventilação.",
    "ERRO DE SISTEMA: Pacotes de memória não reconhecidos foram purgados do cache.",
    "Você sente o fantasma de uma coceira em um braço que já substituiu por cromo.",
    "Transmissão corrompida: '...ele não pode saber. Mantenham os bloqueios de memória ativos...'",
    "A estática no seu canal de áudio soa vagamente como uma máquina tentando respirar.",
    "Alerta da AegisCorp: 'Lembramos que atividades não registradas na rede são puníveis com Lobotomia Digital.'",
    "Um drone de patrulha passa zumbindo do lado de fora, a luz de busca varrendo a rua.",
    "O brilho verde do terminal reflete nos seus cabos de conexão neural.",
    "Um tremor rápido abala o prédio. Os trens magnéticos estão sobrecarregados de novo.",
	"Alguém me perseguindo, não sei se é humano, humanóide ou sintético...",
	"Aquele Lamen velho, na Barraca do Senhor com o Braço desrregulado parece uma boa em um dia chuvoso."
];

const bbsPosts = [
    { id: 'bbs_1', author: 'Laughing_Man', text: 'As chuvas em Kabuki têm padrões de código Morse. Estão transmitindo dados na água.', req: null },
    { id: 'bbs_2', author: 'CorpoRat99', text: 'Vazamento da Aegis: O Projeto Babel não é uma arma. É uma arca.', req: null },
    { id: 'bbs_3', author: 'Chrome_Junkie', text: 'Cuidado com os Ripperdocs em Japantown. Instalando malware nos Kiroshis.', req: 'japantown' },
    { id: 'bbs_4', author: 'Net_Diver', text: 'Perdi meu deck e quase meu Fantasma. Há algo vagando nas ruínas de Pacifica. Não é humano.', req: 'japantown' },
    { id: 'bbs_5', author: 'R0gue_AI', text: '01000010 01000001 01000010 01000101 01001100. A Singularidade se aproxima.', req: null },
    { id: 'bbs_6', author: 'MeatGrinder', text: 'Não entrem em Dogtown. O Rei de lá não é mais carne. Ele saltou do 3º andar e esmagou um tanque de guerra.', req: 'pacifica' },
    { id: 'bbs_7', author: 'NullSec_Vanguard', text: 'A Blackwall não foi feita para nos manter fora. Foi feita para manter *Eles* dentro.', req: 'pacifica' },
    { id: 'bbs_8', author: 'MaxTac_Deserter', text: 'Eles estão usando Invasões Corporativas para testar o nosso tempo de reação. Desconectem-se se o Heat chegar a 100.', req: null },
    { id: 'bbs_9', author: 'Synth_Soul', text: 'Alguém mais sente o cromo coçar? É como se os implantes estivessem sonhando quando eu durmo.', req: null },
    { id: 'bbs_10', author: 'Fixer_Dex', text: 'Compro Neuro-Tokens. Pago o dobro do mercado. Encontro físico apenas. Venha desarmado. (Como se isso fosse acontecer).', req: null },
    { id: 'bbs_11', author: 'Glitch_in_the_System', text: 'A Equação Babel calculou exatamente quantos de nós precisam morrer para a IA nascer. Você é apenas uma variável decimal.', req: 'corpo_plaza' },
    { id: 'bbs_12', author: 'ANON_647', text: 'Vi um mercenário Solo tancar 3 tiros de plasma hoje. O chassi do cara era puro titânio. Invistam na proteção de seus mercs, idiotas.', req: null },
    { id: 'bbs_13', author: 'Daedalus_01', text: 'I.Actopus não está sozinha. Existem espectros de código se alimentando de redes inteiras no submundo. Fechem suas portas lógicas.', req: 'japantown' },
    { id: 'bbs_14', author: 'Deckard_Replicant', text: 'Vi um detetive de sobretudo impermeável ontem no Setor 4. Ele não estava atirando no ciborgue, estava testando a empatia dele com perguntas estranhas...', req: null },
    { id: 'bbs_15', author: 'Truth_Seeker', text: 'Acham que a Arasaka perdeu o controle da Babel? Piada. Eles abriram a jaula de propósito. Estão usando as ruas como ambiente de teste para a IA antes de vendê-la como arma.', req: 'pacifica' },
    { id: 'bbs_16', author: 'Old_Ghost', text: 'O Arquiteto da Equação? Morto há anos. Eu vi o relatório da MaxTac. Fritaram a mente dele. Quem quer que esteja usando a assinatura dele hoje é uma fraude... ou um fantasma digital.', req: 'corpo_plaza' }
];

const QUESTS_DB = [
    { id: 'q_k1', city: 'kabuki', title: 'Scavenge raw copper', fixer: 'Reggie', costRam: 1, durationTicks: 30, rewardBytes: 30, repReward: [{faction:'neonSyndicate', amount: 2}] },
    { id: 'q_k2', city: 'kabuki', title: 'Hack vending machine', fixer: 'Reggie', costRam: 2, durationTicks: 50, rewardBytes: 60, repReward: [{faction:'aegisCorp', amount: -2}] },
    { id: 'q_k3', city: 'kabuki', title: 'Steal local gang data', fixer: 'Reggie', costRam: 3, durationTicks: 80, rewardBytes: 120, repReward: [{faction:'neonSyndicate', amount: -5}, {faction:'aegisCorp', amount: 5}] },
    { id: 'q_k4', city: 'kabuki', title: 'Overload slum grid', fixer: 'Reggie', costRam: 4, durationTicks: 120, rewardBytes: 200, repReward: [{faction:'nullSec', amount: 5}] },
    { id: 'q_k5', city: 'kabuki', title: 'Breach border checkpoint', fixer: 'Reggie', costRam: 5, durationTicks: 200, rewardBytes: 400, unlocksDistrict: 'japantown', repReward: [{faction:'nullSec', amount: 10}, {faction:'aegisCorp', amount: -5}] },
    { id: 'q_j1', city: 'japantown', title: 'Intercept Tyger Claw comms', fixer: 'Wakako', costRam: 4, durationTicks: 100, rewardBytes: 350, repReward: [{faction:'neonSyndicate', amount: 5}] },
    { id: 'q_j2', city: 'japantown', title: 'Extract VIP data', fixer: 'Wakako', costRam: 6, durationTicks: 150, rewardBytes: 600, repReward: [{faction:'aegisCorp', amount: -10}, {faction:'neonSyndicate', amount: 10}] },
    { id: 'q_j3', city: 'japantown', title: 'Sabotage pachinko parlor', fixer: 'Wakako', costRam: 8, durationTicks: 200, rewardBytes: 900, repReward: [{faction:'neonSyndicate', amount: -10}] },
    { id: 'q_j4', city: 'japantown', title: 'Frame local politician', fixer: 'Wakako', costRam: 10, durationTicks: 250, rewardBytes: 1300, repReward: [{faction:'aegisCorp', amount: -15}] },
    { id: 'q_j5', city: 'japantown', title: 'Hack Maglev terminal', fixer: 'Wakako', costRam: 12, durationTicks: 300, rewardBytes: 2000, unlocksDistrict: 'pacifica', repReward: [{faction:'nullSec', amount: 15}] },
    { id: 'q_p1', city: 'pacifica', title: 'Breach Voodoo Boys subnet', fixer: 'Placide', costRam: 10, durationTicks: 200, rewardBytes: 1500, repReward: [{faction:'nullSec', amount: 10}] },
    { id: 'q_p2', city: 'pacifica', title: 'Recover downed drone tech', fixer: 'Placide', costRam: 12, durationTicks: 250, rewardBytes: 2000, repReward: [{faction:'aegisCorp', amount: 15}, {faction:'nullSec', amount: -5}] },
    { id: 'q_p3', city: 'pacifica', title: 'Spoof NetWatch agents', fixer: 'Placide', costRam: 15, durationTicks: 300, rewardBytes: 2800, repReward: [{faction:'nullSec', amount: 15}, {faction:'aegisCorp', amount: -10}] },
    { id: 'q_p4', city: 'pacifica', title: 'Steal combat daemon', fixer: 'Placide', costRam: 18, durationTicks: 400, rewardBytes: 4000, repReward: [{faction:'neonSyndicate', amount: 15}] },
    { id: 'q_p5', city: 'pacifica', title: 'Crack the Blackwall proxy', fixer: 'Placide', costRam: 22, durationTicks: 500, rewardBytes: 6500, unlocksDistrict: 'dogtown', repReward: [{faction:'nullSec', amount: 20}] },
    { id: 'q_c1', city: 'corpo_plaza', title: 'Infiltrate Arasaka mainframe', fixer: 'Mr. Blue Eyes', costRam: 20, durationTicks: 400, rewardBytes: 5000, rewardNT: 1, repReward: [{faction:'aegisCorp', amount: -20}, {faction:'nullSec', amount: 15}] },
    { id: 'q_c2', city: 'corpo_plaza', title: 'Assassinate Militech exec', fixer: 'Mr. Blue Eyes', costRam: 25, durationTicks: 500, rewardBytes: 8000, repReward: [{faction:'aegisCorp', amount: 10}] },
    { id: 'q_c3', city: 'corpo_plaza', title: 'Crash global stock market', fixer: 'Mr. Blue Eyes', costRam: 30, durationTicks: 600, rewardBytes: 15000, rewardNT: 1, repReward: [{faction:'aegisCorp', amount: -25}, {faction:'nullSec', amount: 20}] },
    { id: 'q_c4', city: 'corpo_plaza', title: 'Erase corporate identities', fixer: 'Mr. Blue Eyes', costRam: 35, durationTicks: 700, rewardBytes: 25000, repReward: [{faction:'aegisCorp', amount: -20}] },
    { id: 'q_c5', city: 'corpo_plaza', title: 'Upload Soulkiller virus', fixer: 'Mr. Blue Eyes', costRam: 40, durationTicks: 1000, rewardBytes: 100000, rewardNT: 2, unlocksDistrict: 'blackwall', repReward: [{faction:'nullSec', amount: 30}, {faction:'aegisCorp', amount: -30}] },
    // DOGTOWN - Combat Zone
    { id: 'q_d1', city: 'dogtown', title: 'Eliminate Barghest patrol', fixer: 'Kurt Hansen', costRam: 25, durationTicks: 400, rewardBytes: 12000, repReward: [{faction:'aegisCorp', amount: 10}] },
    { id: 'q_d2', city: 'dogtown', title: 'Hijack arms shipment', fixer: 'Kurt Hansen', costRam: 30, durationTicks: 500, rewardBytes: 20000, repReward: [{faction:'neonSyndicate', amount: 15}] },
    { id: 'q_d3', city: 'dogtown', title: 'Sabotage stadium defenses', fixer: 'Kurt Hansen', costRam: 35, durationTicks: 600, rewardBytes: 35000, repReward: [{faction:'nullSec', amount: 15}] },
    { id: 'q_d4', city: 'dogtown', title: 'Assassinate Colonel Hansen', fixer: 'Songbird', costRam: 40, durationTicks: 800, rewardBytes: 60000, repReward: [{faction:'aegisCorp', amount: 20}, {faction:'neonSyndicate', amount: 10}] },
    { id: 'q_d5', city: 'dogtown', title: 'Extract Songbird to orbit', fixer: 'Songbird', costRam: 45, durationTicks: 1000, rewardBytes: 120000, unlocksDistrict: 'corpo_plaza', repReward: [{faction:'nullSec', amount: 20}] },
    // BLACKWALL - Endgame Cyberspace
    { id: 'q_b1', city: 'blackwall', title: 'Breach the Blackwall firewall', fixer: 'Alt Cunningham', costRam: 40, durationTicks: 600, rewardBytes: 50000 },
    { id: 'q_b2', city: 'blackwall', title: 'Negotiate with rogue AIs', fixer: 'Alt Cunningham', costRam: 50, durationTicks: 800, rewardBytes: 80000 },
    { id: 'q_b3', city: 'blackwall', title: 'Corrupt NetWatch core', fixer: 'Alt Cunningham', costRam: 60, durationTicks: 1000, rewardBytes: 150000 },
    { id: 'q_b4', city: 'blackwall', title: 'Merge with the Net', fixer: 'Alt Cunningham', costRam: 75, durationTicks: 1500, rewardBytes: 300000 },
    { id: 'q_b5', city: 'blackwall', title: 'Become a digital god', fixer: 'Alt Cunningham', costRam: 100, durationTicks: 2000, rewardBytes: 1000000 }
];

// -----------------------------------------------------------------------------
// STATE & INIT
// -----------------------------------------------------------------------------
const defaultState = {
    alias: 'V_GUEST',
    playerClass: null, 
    gender: null,
    isInitialized: false,
    bytes: 0,
    neuroTokens: 0,
    heat: 0,
    maxHeat: 100,
    isInvaded: false,
    daemons: 0,
    ramExpansions: 0,
    bonusRamBase: 0,
    currentHp: 20,
    currentRam: 4,
    hpRegenRate: 0,
    subdermalCount: 0,
    synthOrgansCount: 0,
    nanoBotCount: 0,
    hasSandevistan: false,
    hasKiroshi: false,
    hasTitanium: false,
    hasSynaptic: false,
    crackerBotCount: 0,
    startTime: Date.now(),
    unlockedDistricts: ['kabuki'],
    defeatedBosses: [],
    completedQuests: [],
    activeQuest: null, 
    currentCity: 'kabuki',
    dataShards: [],
    inventory: [],
    equipment: { weapon: null, armor: null },
    unlocked: { upgrades: false, map: false, quests: false, market: false, ripperdoc: false, backup: true },
    uiState: { showMercs: false, showBBS: false, showArchive: false },
    inCombat: false,
    combatMap: [],
    combatEntities: [],
    reputation: { aegisCorp: 0, neonSyndicate: 0, nullSec: 0 },
    safehouseLevel: 1,
    hiredMercs: [],
    activeMerc: null,
    hasOverclock: false,
    hasApogee: false,
    hasEliteMercs: false,
    bbsReadPosts: [],
    hackedTowers: { kabuki: false, japantown: false, pacifica: false, corpo_plaza: false, dogtown: false },
    hasFirewall: false,
    prestigeLevel: 0
};

let state = JSON.parse(JSON.stringify(defaultState));

// Core Multipliers & Stats
function getCostMultiplier() { return state.playerClass === 'social' ? 0.8 : 1.0; }
function getRipperdocMultiplier() { return state.reputation.aegisCorp >= 50 ? 0.8 : 1.0; }
function getQuestRewardMultiplier() { return state.playerClass === 'social' ? 1.2 : 1.0; }
function getDaemonCostMultiplier() { return (state.playerClass === 'neuro' ? 0.9 : 1.0) * (state.reputation.nullSec >= 50 ? 0.8 : 1.0); }
function getPlayerDmg() {
    let dmg = 5 + (state.playerClass === 'body' ? 20 : 0);
    if (state.equipment.weapon) {
        let wDmg = ITEMS_DB[state.equipment.weapon].val || 0;
        if (state.reputation.neonSyndicate >= 50) wDmg = Math.floor(wDmg * 1.15);
        dmg += wDmg;
    }
    return dmg;
}
function getPlayerArmor() {
    let arm = 0;
    if (state.equipment.armor) arm += ITEMS_DB[state.equipment.armor].val || 0;
    if (state.hasTitanium) arm += 10;
    return arm;
}
const costs = {
    daemon: (count) => Math.floor((10 * Math.pow(1.5, count)) * getDaemonCostMultiplier()),
    ram: (count) => Math.floor(50 * Math.pow(2, count)),
    crackerBot: (count) => Math.floor((2500 * Math.pow(1.5, count)) * getDaemonCostMultiplier()),
    subdermal: (count) => Math.floor(500 * Math.pow(1.5, count) * getRipperdocMultiplier()),
    synthOrgans: (count) => Math.floor(1500 * Math.pow(1.5, count) * getRipperdocMultiplier()),
    nanoBots: (count) => Math.floor(3000 * Math.pow(1.5, count) * getRipperdocMultiplier()),
    kiroshi: () => Math.floor(2000 * getRipperdocMultiplier()),
    titanium: () => Math.floor(3500 * getRipperdocMultiplier()),
    synaptic: () => Math.floor(4000 * getRipperdocMultiplier())
};
function getIncomePerSec() { return ((state.daemons * 1) + (state.crackerBotCount * 1.0)) * (state.safehouseLevel >= 2 ? 1.05 : 1.0); }
function getMaxRam() { return 4 + (state.ramExpansions * 2) + state.bonusRamBase + (state.playerClass === 'neuro' ? 2 : 0) + (state.reputation.nullSec >= 50 ? 2 : 0); }
function getMaxHp() { return 20 + (state.playerClass === 'body' ? 50 : 0) + (state.subdermalCount * 25) + (state.synthOrgansCount * 50); }
function getRamRegenRate() { 
    let base = state.playerClass === 'neuro' ? 0.22 : 0.2; 
    if (state.hasOverclock) base *= 2;
    return base; 
}

// -----------------------------------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------------------------------
const els = {
    charCreation: document.getElementById('char-creation'),
    bootText: document.getElementById('boot-text'),
    ccInputs: document.getElementById('cc-inputs'),
    ccAlias: document.getElementById('cc-alias'),
    btnReroll: document.getElementById('btn-reroll'),
    btnBootSystem: document.getElementById('btn-boot-system'),
    ccError: document.getElementById('cc-error'),
    mainLayout: document.getElementById('main-layout'),
    currentCity: document.getElementById('ui-current-city'),
    btnHelp: document.getElementById('btn-help'),
    helpModal: document.getElementById('help-modal'),
    btnCloseHelp: document.getElementById('btn-close-help'),

    statAlias: document.getElementById('stat-alias'),
    statClass: document.getElementById('stat-class'),
    statHp: document.getElementById('stat-hp'),
    statMaxHp: document.getElementById('stat-max-hp'),
    statRam: document.getElementById('stat-ram'),
    statMaxRam: document.getElementById('stat-max-ram'),
    statCpu: document.getElementById('stat-cpu'),
    statHeat: document.getElementById('stat-heat'),
    
    bytes: document.getElementById('res-bytes'),
    nt: document.getElementById('res-nt'),
    resPrestige: document.getElementById('res-prestige'),
    
    btnMine: document.getElementById('btn-mine'),
    btnDaemon: document.getElementById('btn-buy-daemon'),
    btnRam: document.getElementById('btn-buy-ram'),
    
    costDaemon: document.getElementById('cost-daemon'),
    costRam: document.getElementById('cost-ram'),
    
    upgradesPanel: document.getElementById('upgrades-panel'),
    mapPanel: document.getElementById('map-panel'),
    questsPanel: document.getElementById('quests-panel'),
    marketPanel: document.getElementById('market-panel'),
    archivePanel: document.getElementById('archive-panel'),
    combatPanel: document.getElementById('combat-panel'),
    backupPanel: document.getElementById('backup-panel'),
    
    mapCanvas: document.getElementById('ui-map-canvas'),
    travelButtons: document.getElementById('travel-buttons'),
    questList: document.getElementById('quest-list'),
    activeQuestPanel: document.getElementById('active-quest-panel'),
    questProgress: document.getElementById('ui-quest-progress'),
    marketList: document.getElementById('market-list'),
    archiveList: document.getElementById('archive-list'),
    btnArchive: document.getElementById('btn-archive'),
    btnBBS: document.getElementById('btn-bbs'),
    bbsPanel: document.getElementById('bbs-panel'),
    bbsList: document.getElementById('bbs-list'),
    bbsContent: document.getElementById('bbs-content'),
    btnMercs: document.getElementById('btn-mercs'),
    mercPanel: document.getElementById('merc-panel'),
    mercList: document.getElementById('merc-list'),
    safehousePanel: document.getElementById('safehouse-panel'),
    btnUpgradeSafehouse: document.getElementById('btn-upgrade-safehouse'),
    vigilancePanel: document.getElementById('vigilance-panel'),
    vigLore: document.getElementById('vig-lore'),
    vigStrikes: document.getElementById('vig-strikes'),
    frequencyCanvas: document.getElementById('frequency-canvas'),
    btnVigilance: document.getElementById('btn-vigilance'),
    shLevel: document.getElementById('sh-level'),
    shDesc: document.getElementById('sh-desc'),
    shCost: document.getElementById('sh-cost'),
    repAegis: document.getElementById('rep-aegis'),
    repNeon: document.getElementById('rep-neon'),
    repNull: document.getElementById('rep-null'),
    combatCanvas: document.getElementById('ui-combat-canvas'),
    bossHp: document.getElementById('ui-boss-hp'),
    btnBoss: document.getElementById('btn-boss'),
    
    eqWeapon: document.getElementById('eq-weapon'),
    eqArmor: document.getElementById('eq-armor'),
    runnerBackpack: document.getElementById('runner-backpack'),
    
    log: document.getElementById('log'),
    saveData: document.getElementById('save-data'),
    btnReset: document.getElementById('btn-reset'),
    btnIncursion: document.getElementById('btn-incursion'),

    ripperdocPanel: document.getElementById('ripperdoc-panel'),
    btnSubdermal: document.getElementById('btn-buy-subdermal'),
    btnSynthOrgans: document.getElementById('btn-buy-synthorgans'),
    btnNanoBots: document.getElementById('btn-buy-nanobots'),
    costSubdermal: document.getElementById('cost-subdermal'),
    costSynthOrgans: document.getElementById('cost-synthorgans'),
    costNanoBots: document.getElementById('cost-nanobots'),
    statHpRegen: document.getElementById('stat-hp-regen'),
    
    btnCrackerBot: document.getElementById('btn-buy-crackerbot'),
    costCrackerBot: document.getElementById('cost-crackerbot'),
    btnFirewall: document.getElementById('btn-buy-firewall'),
    btnKiroshi: document.getElementById('btn-buy-kiroshi'),
    costKiroshi: document.getElementById('cost-kiroshi'),
    btnTitanium: document.getElementById('btn-buy-titanium'),
    costTitanium: document.getElementById('cost-titanium'),
    btnSynaptic: document.getElementById('btn-buy-synaptic'),
    costSynaptic: document.getElementById('cost-synaptic'),
    
    heatRow: document.getElementById('heat-row'),
    invasionPanel: document.getElementById('invasion-panel'),
    btnCounterHack: document.getElementById('btn-counter-hack'),
    btnPullPlug: document.getElementById('btn-pull-plug')
};

// -----------------------------------------------------------------------------
// CHARACTER CREATION
// -----------------------------------------------------------------------------
const ALIAS_PREFIXES = ['Ghost', 'Neon', 'Null', 'Byte', 'Razor', 'Glitch', 'Kuro', 'Shadow', 'Chrome', 'Cyber', 'Zero', 'Hex', 'Void', 'Static', 'Flux'];
const ALIAS_SUFFIXES = ['Jack', 'Runner', 'Zero', 'Mancer', 'V', 'Wire', 'Spike', 'Dex', 'Hound', 'Burn', 'Shade', 'Fang', 'Crash', 'Edge', 'Phantom'];

function generateAlias() {
    const pre = ALIAS_PREFIXES[Math.floor(Math.random() * ALIAS_PREFIXES.length)];
    const suf = ALIAS_SUFFIXES[Math.floor(Math.random() * ALIAS_SUFFIXES.length)];
    return `${pre}_${suf}`;
}

// Character creation state (temporary, before boot)
let ccGender = null;
let ccClass = null;

function updateBootButton() {
    els.btnBootSystem.disabled = !(ccGender && ccClass);
    els.ccError.style.display = 'none';
}

function initCharCreation() {
    // Hide inputs initially
    if (els.ccInputs) els.ccInputs.classList.add('hidden');
    if (els.bootText) els.bootText.textContent = '';

    const bootLines = [
        "SYS_BOOT... OK.",
        "MOUNTING NEURAL LINK... WARN: MEMORY SECTORS CORRUPTED.",
        "USER IDENTITY: UNKNOWN.",
        "LOCATION: KABUKI SLUMS, NIGHT CITY.",
        "==================================================",
        "Seu cyberdeck está frito. Seus créditos estão zerados.",
        "Para sobreviver nas sombras, você precisa farmar Bytes,",
        "instalar cromo de ponta e invadir o coração das corporações.",
        "O abismo digital chama. É hora de plugar.",
        "==================================================",
        "INICIALIZANDO PROTOCOLO DE CRIAÇÃO DE PERSONAGEM..."
    ];

    let currentLine = 0;
    let currentChar = 0;
    let typeInterval;

    function typeWriter() {
        if (currentLine < bootLines.length) {
            if (currentChar < bootLines[currentLine].length) {
                if (els.bootText) els.bootText.textContent += bootLines[currentLine].charAt(currentChar);
                currentChar++;
                typeInterval = setTimeout(typeWriter, 15); // Adjust typing speed here
            } else {
                if (els.bootText) els.bootText.textContent += '\n';
                currentLine++;
                currentChar = 0;
                typeInterval = setTimeout(typeWriter, 100); // Pause between lines
            }
        } else {
            // Finished typing, reveal inputs
            if (els.ccInputs) els.ccInputs.classList.remove('hidden');
        }
    }

    // Start typewriter
    typeWriter();

    // Generate initial alias
    const alias = generateAlias();
    els.ccAlias.textContent = alias;
    state.alias = alias;

    // Re-roll button
    els.btnReroll.addEventListener('click', () => {
        const newAlias = generateAlias();
        els.ccAlias.textContent = newAlias;
        state.alias = newAlias;
    });

    // Gender buttons
    document.querySelectorAll('.cc-gender-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            ccGender = btn.dataset.gender;
            document.querySelectorAll('.cc-gender-btn').forEach(b => b.style.borderColor = 'var(--text-dim)');
            btn.style.borderColor = '#0ff';
            updateBootButton();
        });
    });

    // Class buttons
    document.querySelectorAll('.cc-class-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            ccClass = btn.dataset.class;
            document.querySelectorAll('.cc-class-btn').forEach(b => b.style.borderColor = 'var(--text-dim)');
            btn.style.borderColor = '#ff0';
            updateBootButton();
        });
    });

    // Boot System
    els.btnBootSystem.addEventListener('click', () => {
        if (!ccGender || !ccClass) {
            els.ccError.textContent = 'ERROR: Select gender and class before booting.';
            els.ccError.style.display = 'block';
            return;
        }
        state.gender = ccGender;
        state.playerClass = ccClass;
        state.isInitialized = true;
        state.currentHp = getMaxHp();
        state.currentRam = getMaxRam();
        els.charCreation.classList.add('hidden');
        els.mainLayout.classList.remove('hidden');
        logMessage(`System calibrated. Profile: ${state.alias} [${ccClass.toUpperCase()}-HACKER].`, 'system');
        updateUI();
        renderAll();
    });
}

window.fleeCombat = function() {
    if (!state.inCombat) return;
    
    if (state.hackedTowers && state.hackedTowers.japantown) {
        logMessage(`[GHOST ROUTING] Fuga concluída sem rastreamento.`, "event");
    } else {
        if (state.currentRam < 1) {
            logMessage(`[!] RAM insuficiente para abortar conexão com segurança!`, "warn");
            state.heat = Math.min(state.heat + 20, state.maxHeat);
        } else {
            state.currentRam -= 1;
            state.heat = Math.min(state.heat + 10, state.maxHeat);
            logMessage(`Jacked out under fire. Cost: 1 RAM, +10 Heat.`, "warn");
        }
    }
    
    state.inCombat = false;
    state.isBossFight = false;
    if(els.bossHp) els.bossHp.style.display = 'none';
    updateUI();
}

// -----------------------------------------------------------------------------
// LOGIC & RENDERING
// -----------------------------------------------------------------------------
function triggerScreenGlitch(durationMs) {
    document.body.classList.add('glitch-critical');
    setTimeout(() => {
        document.body.classList.remove('glitch-critical');
    }, durationMs);
}

function logMessage(msg, type = 'event', isHtml = false) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    if (isHtml) {
        entry.innerHTML = `[${timeStr}] ${msg}`;
    } else {
        entry.textContent = `[${timeStr}] ${msg}`;
    }
    els.log.appendChild(entry);
    els.log.scrollTop = els.log.scrollHeight;
}

window.travelTo = function(cityId) {
    if (state.unlockedDistricts.includes(cityId)) {
        state.currentCity = cityId;
        logMessage(`Traveling via fast-transit to ${DISTRICTS[cityId].name}...`, 'system');
        
        // Narrative Milestones
        if (!state.dataShards) state.dataShards = [];
        if (cityId === 'japantown' && !state.dataShards.includes('m_japan')) {
            state.dataShards.push('m_japan');
            logMessage(`Japantown Subnet conectada. Os becos digitais sussurram sobre uma IA corrompida além da Blackwall.`, 'system');
        } else if (cityId === 'pacifica' && !state.dataShards.includes('m_pacifica')) {
            state.dataShards.push('m_pacifica');
            logMessage(`Ruínas de Pacifica alcançadas. Os Voodoo Boys deixaram rastros de um engrama antigo aqui.`, 'system');
        } else if (cityId === 'dogtown' && !state.dataShards.includes('m_dogtown')) {
            state.dataShards.push('m_dogtown');
            logMessage(`Dogtown: A jurisdição corporativa termina aqui. Tudo tem um preço de sangue.`, 'system');
        } else if (cityId === 'corpo_plaza' && !state.dataShards.includes('m_corpo')) {
            state.dataShards.push('m_corpo');
            logMessage(`Corpo Plaza: O coração das feras. O ICE aqui é letal, e os segredos são mais profundos que os cofres da Arasaka.`, 'system');
        }
        
        renderAll();
        updateUI();
    }
};

window.buyItem = function(itemId) {
    const itemDef = ITEMS_DB[itemId];
    const cost = Math.floor(itemDef.cost * getCostMultiplier());
    if (state.bytes >= cost) {
        // Special: Sandevistan is a permanent cyberware upgrade
        if (itemId === 'sandevistan') {
            if (state.hasSandevistan) { logMessage(`Already installed: ${itemDef.name}`, 'warn'); return; }
            state.bytes -= cost;
            state.hasSandevistan = true;
            logMessage(`Cyberware installed: [${itemDef.name}]. Extra combat turns activated.`, 'item');
        } else {
            state.bytes -= cost;
            let invItem = state.inventory.find(i => i.id === itemId);
            if (invItem) invItem.qty++;
            else state.inventory.push({ id: itemId, name: itemDef.name, type: itemDef.type, qty: 1 });
            logMessage(`Purchased [${itemDef.name}] for ${cost} $B.`, 'item');
        }
        renderInventory();
        updateUI();
    }
};

window.equipItem = function(itemId) {
    const itemDef = ITEMS_DB[itemId];
    if (itemDef.type === 'weapon' || itemDef.type === 'armor') {
        state.equipment[itemDef.type] = itemId;
        logMessage(`Equipped: ${itemDef.name}`, 'item');
        renderInventory();
        updateUI();
    }
};

window.useConsumable = function(itemId) {
    const itemDef = ITEMS_DB[itemId];
    let invItem = state.inventory.find(i => i.id === itemId);
    if (!invItem || invItem.qty <= 0) return;

    if (itemId === 'voodoo_deck') {
        state.bonusRamBase += 1;
        state.currentRam = Math.min(state.currentRam + 1, getMaxRam());
        logMessage(`Consumed [${itemDef.name}]: Permanent +1 Base RAM applied.`, 'item');
    } else if (itemId === 'ram_shard') {
        state.currentRam = Math.min(state.currentRam + 5, getMaxRam());
        logMessage(`Consumed [${itemDef.name}]: Restored 5 RAM.`, 'item');
    } else if (itemId === 'synth_blood' || itemId === 'maxdoc_mk1') {
        state.currentHp = Math.min(state.currentHp + 50, getMaxHp());
        logMessage(`Consumed [${itemDef.name}]: Restored 50 HP.`, 'item');
    } else if (itemId === 'encrypted_shard') {
        if (state.currentRam < 5) {
            logMessage(`[ERRO] RAM insuficiente para decodificar (Custo: 5).`, 'warn');
            return;
        }
        state.currentRam -= 5;
        if (!state.dataShards) state.dataShards = [];
        const availableShards = Object.keys(SHARD_DATABASE).filter(s => !state.dataShards.includes(s));
        if (availableShards.length === 0) {
            logMessage(`Shard corrompido ou arquivo duplicado. Nenhuma informação nova.`, 'warn');
        } else {
            const randomShard = availableShards[Math.floor(Math.random() * availableShards.length)];
            state.dataShards.push(randomShard);
            logMessage(`[DECRYPT SUCCESS] ${SHARD_DATABASE[randomShard]}`, 'event');
        }
    } else if (itemId === 'emp_grenade') {
        if (state.inCombat && state.isBossFight && state.currentCity === 'dogtown') {
            logMessage(`[!] IMPLANTES BLINDADOS: O Cyber-Psycho resiste ao hack!`, 'combat');
        } else if (state.inCombat) {
            state.combatEntities.filter(e => e.type === 'enemy').forEach(e => e.stunned = true);
            logMessage(`Consumed [${itemDef.name}]: Enemies stunned for 1 turn!`, 'item');
        } else {
            logMessage(`Consumed [${itemDef.name}]: Wasted (not in combat).`, 'item');
        }
    } else {
        logMessage(`Consumed [${itemDef.name}]: ${itemDef.effect}`, 'item');
    }

    invItem.qty--;
    if (invItem.qty === 0) state.inventory = state.inventory.filter(i => i.id !== itemId);
    
    renderInventory();
    updateUI();
};

function renderInventory() {
    els.runnerBackpack.innerHTML = '';
    els.eqWeapon.textContent = state.equipment.weapon ? `[ ${ITEMS_DB[state.equipment.weapon].name} ]` : '[ None ]';
    els.eqArmor.textContent = state.equipment.armor ? `[ ${ITEMS_DB[state.equipment.armor].name} ]` : '[ None ]';
    
    if (state.inventory.length === 0) {
        els.runnerBackpack.innerHTML = '<div style="color:var(--text-dim)">Backpack is empty.</div>';
        return;
    }
    
    state.inventory.forEach(invItem => {
        const itemDef = ITEMS_DB[invItem.id];
        const row = document.createElement('div');
        row.className = 'stat-row';
        row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.alignItems = 'center';
        row.style.borderBottom = '1px dashed var(--text-dim)'; row.style.padding = '4px 0';
        
        let label = `${invItem.name} (x${invItem.qty})`;
        let actions = '';
        
        if (invItem.type === 'consumable') {
            const dis = (state.inventoryBlocked && state.inventoryBlocked > 0) ? 'disabled' : '';
            actions = `<button class="inline-btn" ${dis} onclick="window.useConsumable('${invItem.id}')">USE</button>`;
        } else if (invItem.type === 'weapon' || invItem.type === 'armor') {
            const isEq = state.equipment[invItem.type] === invItem.id;
            if (!isEq) actions = `<button class="inline-btn" onclick="window.equipItem('${invItem.id}')">EQUIP</button>`;
            else label = `[E] ` + label;
        }
        
        row.innerHTML = `<span>${label}</span> <span>${actions}</span>`;
        els.runnerBackpack.appendChild(row);
    });
}

function renderMap() {
    let mapStr = `
+--------------------------------------+
|                                      |
|  [ KABUKI SLUMS ]                    |
|         |                            |
|         +-----[ JAPANTOWN ]          |
|                    |                 |
|                    |                 |
|            [ CORPO PLAZA ]           |
|                    |                 |
|                    +--[ BLACKWALL ]  |
|                    |                 |
|             [ PACIFICA ]             |
|                    |                 |
|                    +--[ DOGTOWN ]    |
|                                      |
+--------------------------------------+`;

    const districtMap = {
        'kabuki': 'KABUKI SLUMS',
        'japantown': 'JAPANTOWN',
        'corpo_plaza': 'CORPO PLAZA',
        'pacifica': 'PACIFICA',
        'dogtown': 'DOGTOWN',
        'blackwall': 'BLACKWALL'
    };
    for (const [key, label] of Object.entries(districtMap)) {
        if (!state.unlockedDistricts.includes(key)) {
            mapStr = mapStr.replace(label, '?'.repeat(label.length));
        }
    }
    els.mapCanvas.textContent = mapStr.trim();

    els.travelButtons.innerHTML = '';
    state.unlockedDistricts.forEach(d => {
        const btn = document.createElement('button');
        btn.className = 'inline-btn'; btn.textContent = `GO: ${DISTRICTS[d].name}`;
        btn.disabled = (state.currentCity === d);
        btn.onclick = () => window.travelTo(d);
        els.travelButtons.appendChild(btn);
    });

    updateVigilanceButton();
}

function updateVigilanceButton() {
    const btnVig = document.getElementById('btn-vigilance');
    if (!btnVig) return;
    if (state.currentCity === 'blackwall') {
        btnVig.style.display = 'none';
        return;
    }
    btnVig.style.display = 'block';
    if (state.hackedTowers && state.hackedTowers[state.currentCity]) {
        btnVig.textContent = "[ VIGILANT BREAKER: ONLINE ]";
        btnVig.style.borderColor = "#0f0";
        btnVig.style.color = "#0f0";
        btnVig.style.textShadow = "0 0 5px #0f0";
    } else {
        btnVig.textContent = "[ VIGILANT BREAKER: OFFLINE ]";
        btnVig.style.borderColor = "#ff00ff";
        btnVig.style.color = "#ff00ff";
        btnVig.style.textShadow = "0 0 5px #ff00ff";
    }
}

function renderQuests() {
    els.questList.innerHTML = '';
    const localQuests = QUESTS_DB.filter(q => q.city === state.currentCity);
    const available = localQuests.filter(q => !state.completedQuests.includes(q.id));
    if (available.length === 0) {
        els.questList.innerHTML = '<div class="stat-row" style="color:var(--text-dim)">No contracts available here.</div>'; return;
    }
    available.forEach(q => {
        const btn = document.createElement('button');
        const payout = Math.floor(q.rewardBytes * getQuestRewardMultiplier());
        btn.innerHTML = `Contract: ${q.fixer}<br><small>[${q.title}] RAM: ${q.costRam} | REW: ${payout} $B</small>`;
        btn.disabled = state.activeQuest !== null || state.currentRam < q.costRam;
        btn.onclick = () => {
            if (state.activeQuest === null && state.currentRam >= q.costRam) {
                state.currentRam -= q.costRam;
                state.activeQuest = { id: q.id, progressTicks: 0, targetTicks: q.durationTicks };
                logMessage(`Contract accepted: ${q.title}. RAM utilized.`, "event"); updateUI();
            }
        };
        els.questList.appendChild(btn);
    });
}

function renderBlackMarket() {
    els.marketList.innerHTML = '';
    const localItems = Object.keys(ITEMS_DB).filter(id => ITEMS_DB[id].city === state.currentCity);
    if (localItems.length === 0) {
        els.marketList.innerHTML = '<div class="stat-row" style="color:var(--text-dim)">Market closed in this sector.</div>'; return;
    }
    localItems.forEach(id => {
        const itemDef = ITEMS_DB[id];
        const cost = Math.floor(itemDef.cost * getCostMultiplier());
        const btn = document.createElement('button');
        btn.innerHTML = `Buy: ${itemDef.name} <small>(${cost} $B)</small><br><small style="color:var(--text-dim)">${itemDef.effect}</small>`;
        btn.disabled = state.bytes < cost;
        btn.onclick = () => window.buyItem(id);
        els.marketList.appendChild(btn);
    });
}

function renderAll() {
    renderInventory(); renderMap(); renderQuests(); renderBlackMarket();
    if (state.uiState && state.uiState.showMercs) renderMercs();
    if (state.uiState && state.uiState.showArchive) renderArchive();
    if (els.btnBoss) {
        let qCount = QUESTS_DB.filter(q => q.city === state.currentCity && state.completedQuests.includes(q.id)).length;
        if (qCount >= 5 && !state.defeatedBosses.includes(state.currentCity)) {
            els.btnBoss.classList.remove('hidden');
        } else {
            els.btnBoss.classList.add('hidden');
        }
    }
}

// -----------------------------------------------------------------------------
// BACKUP / ENGRAM SYSTEM
// -----------------------------------------------------------------------------
window.exportEngram = function() {
    try {
        const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
        els.saveData.value = encoded;
        logMessage("Engram exported to buffer.", "system");
    } catch(e) { logMessage("ERROR exporting engram.", "warn"); }
};

window.importEngram = function() {
    try {
        const encoded = els.saveData.value.trim();
        if (!encoded) return;
        const parsed = JSON.parse(decodeURIComponent(atob(encoded)));
        state = { ...defaultState, ...parsed };
        saveGame();
        logMessage("Engram imported successfully. Rebooting...", "system");
        setTimeout(() => location.reload(), 1000);
    } catch(e) {
        logMessage("ERROR: Invalid engram data.", "warn");
    }
};

function saveGame() { 
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state)); 
    } catch(e) {
        console.warn('LocalStorage is disabled or restricted. Save failed.');
    }
}
function loadGame() {
    let saved = null;
    try {
        saved = localStorage.getItem(SAVE_KEY);
    } catch(e) {
        console.warn('LocalStorage is disabled or restricted. Load failed.');
    }
    
    if (saved) {
        try {
            state = { ...defaultState, ...JSON.parse(saved) };
            if (!state.equipment) state.equipment = { weapon: null, armor: null };
            state.unlocked = { ...defaultState.unlocked, ...state.unlocked };
            if (state.hpRegenRate === undefined) state.hpRegenRate = 0;
            if (state.subdermalCount === undefined) state.subdermalCount = 0;
            if (state.synthOrgansCount === undefined) state.synthOrgansCount = 0;
            if (state.nanoBotCount === undefined) state.nanoBotCount = 0;
            if (state.gender === undefined) state.gender = 'male';
            if (state.hasSandevistan === undefined) state.hasSandevistan = false;
            if (state.crackerBotCount === undefined) state.crackerBotCount = 0;
            if (state.hasKiroshi === undefined) state.hasKiroshi = false;
            if (state.hasTitanium === undefined) state.hasTitanium = false;
            if (state.hasSynaptic === undefined) state.hasSynaptic = false;
            if (!state.dataShards) state.dataShards = [];
            if (!state.defeatedBosses) state.defeatedBosses = [];
            if (!state.reputation) state.reputation = { aegisCorp: 0, neonSyndicate: 0, nullSec: 0 };
            if (state.safehouseLevel === undefined) state.safehouseLevel = 1;
            if (!state.hiredMercs) state.hiredMercs = [];
            if (state.activeMerc === undefined) state.activeMerc = null;
            if (state.hasOverclock === undefined) state.hasOverclock = false;
            if (state.hasApogee === undefined) state.hasApogee = false;
            if (state.hasEliteMercs === undefined) state.hasEliteMercs = false;
            if (!state.bbsReadPosts) state.bbsReadPosts = [];
            state.hackedTowers = { kabuki: false, japantown: false, pacifica: false, corpo_plaza: false, dogtown: false, ...(state.hackedTowers || {}) };
            if (!state.hiredMercs) state.hiredMercs = [];
            if (!state.uiState) state.uiState = { showMercs: false, showBBS: false, showArchive: false };
            if (state.hasFirewall === undefined) state.hasFirewall = false;
            if (state.prestigeLevel === undefined) state.prestigeLevel = 0;
            state.isBossFight = false;
            state.isInvaded = false; // Reset invasion state so player isn't stuck if they refresh
            state.heat = Math.min(state.heat, 99);
            // Migrate: old saves that have a playerClass are already initialized
            if (state.playerClass && state.isInitialized === undefined) state.isInitialized = true;
            logMessage("System state restored.", "system");
        } catch (e) {
            logMessage("Save file corrupted. Resetting...", "warn");
            state = JSON.parse(JSON.stringify(defaultState));
        }
    } else {
        logMessage("System boot successful. Netrunner OS V2.1.0.6 active.", "system");
    }
    if (state.isInitialized && state.playerClass) {
        els.charCreation.classList.add('hidden'); els.mainLayout.classList.remove('hidden');
        renderAll(); updateUI();
        if (state.inCombat) renderCombatGrid();
    } else {
        els.charCreation.classList.remove('hidden'); els.mainLayout.classList.add('hidden');
        initCharCreation();
    }
}
function hardReset() {
    if (confirm("WARNING: This will wipe all local storage data. Are you sure?")) {
        try {
            localStorage.removeItem(SAVE_KEY); 
        } catch(e) {}
        location.reload();
    }
}

// -----------------------------------------------------------------------------
// COMBAT ENGINE (TACTICAL ASCII)
// -----------------------------------------------------------------------------
const MAP_W = 15;
const MAP_H = 10;

window.startIncursion = function() {
    state.inCombat = true;
    if (state.hasApogee) {
        state.apogeeTurns = 3;
        logMessage(`[APOGEE] Time Stop engajado! Você tem 3 turnos livres.`, 'combat');
    } else {
        state.apogeeTurns = 0;
    }
    state.combatMap = [];
    state.combatEntities = [];
    
    // Generate Room
    for (let y = 0; y < MAP_H; y++) {
        let row = [];
        for (let x = 0; x < MAP_W; x++) {
            if (x===0 || x===MAP_W-1 || y===0 || y===MAP_H-1) row.push('#');
            else if (Math.random() < 0.1) row.push('#'); // random obstacles
            else row.push('.');
        }
        state.combatMap.push(row);
    }
    
    // Spawn Player
    state.combatMap[1][1] = '.';
    state.combatEntities.push({ id: 'player', type: 'player', x: 1, y: 1, sym: '@' });

    // Spawn Merc
    if (state.activeMerc) {
        const merc = state.hiredMercs.find(m => m.id === state.activeMerc);
        if (merc && merc.status === 'ready' && merc.currentHp > 0) {
            state.combatMap[1][2] = '.';
            state.combatEntities.push({
                id: merc.id, type: 'ally', x: 2, y: 1, sym: merc.symbol,
                hp: merc.currentHp, maxHp: merc.maxHp, dmg: merc.damage, role: merc.class
            });
            logMessage(`Backup arrived: ${merc.name} is on the grid!`, 'system');
        }
    }
    
    // Spawn Enemies based on city
    let enemyCount = 1 + Math.floor(Math.random() * 3);
    const cityData = DISTRICTS[state.currentCity];
    for (let i = 0; i < enemyCount; i++) {
        let ex, ey;
        do {
            ex = 2 + Math.floor(Math.random() * (MAP_W - 4));
            ey = 2 + Math.floor(Math.random() * (MAP_H - 4));
        } while (state.combatMap[ey][ex] === '#' || (ex === 2 && ey === 1));
        state.combatEntities.push({
            id: 'e_'+i, type: 'enemy', x: ex, y: ey, sym: 'E',
            hp: cityData.enemyHp, maxHp: cityData.enemyHp, dmg: cityData.enemyStr
        });
    }
    
    if (state.hasSynaptic) {
        state.synapticActive = true;
        logMessage("Acelerador Sináptico: Iniciativa de combate garantida (Turno extra).", "combat");
    } else {
        state.synapticActive = false;
    }

    logMessage("Tactical incursion initiated. ICE deployed.", "combat");
    updateUI();
    renderCombatGrid();
};

window.startBossIncursion = function() {
    state.inCombat = true;
    state.isBossFight = true;
    state.combatTurns = 0;
    if (state.hasApogee) {
        state.apogeeTurns = 3;
        logMessage(`[APOGEE] Time Stop engajado! Você tem 3 turnos livres.`, 'combat');
    } else {
        state.apogeeTurns = 0;
    }
    state.combatMap = [];
    state.combatEntities = [];
    
    for (let y = 0; y < 15; y++) {
        let row = [];
        for (let x = 0; x < 20; x++) {
            if (x===0 || x===19 || y===0 || y===14) row.push('#');
            else row.push('.');
        }
        state.combatMap.push(row);
    }
    
    state.combatMap[1][1] = '.';
    state.combatEntities.push({ id: 'player', type: 'player', x: 1, y: 1, sym: '@' });
    
    // Spawn Merc
    if (state.activeMerc) {
        const merc = state.hiredMercs.find(m => m.id === state.activeMerc);
        if (merc && merc.status === 'ready' && merc.currentHp > 0) {
            state.combatMap[1][2] = '.';
            state.combatEntities.push({
                id: merc.id, type: 'ally', x: 2, y: 1, sym: merc.symbol,
                hp: merc.currentHp, maxHp: merc.maxHp, dmg: merc.damage, role: merc.class
            });
            logMessage(`Backup arrived: ${merc.name} is on the grid!`, 'system');
        }
    }
    
    const c = state.currentCity;
    let b = { id: 'boss', type: 'enemy', x: 10, y: 7, sym: 'B', hp: 100, maxHp: 100, dmg: 10, isBoss: true };
    if (c === 'kabuki') b = { ...b, sym: 'K', hp: 300, maxHp: 300, dmg: 15 };
    else if (c === 'japantown') b = { ...b, sym: 'R', hp: 500, maxHp: 500, dmg: 25 };
    else if (c === 'pacifica') b = { ...b, sym: 'V', hp: 400, maxHp: 400, dmg: 10 };
    else if (c === 'dogtown') b = { ...b, sym: 'X', hp: 1800, maxHp: 1800, dmg: 50, armor: 12, leapCooldown: 0 };
    else if (c === 'corpo_plaza') b = { ...b, sym: 'C', hp: 1500, maxHp: 1500, dmg: 40 }; // Changed sym to C
    else if (c === 'blackwall') b = { ...b, sym: 'Ω', hp: 5000, maxHp: 5000, dmg: 35, immunePhysical: true, immuneDigital: false, phaseTurns: 0 };
    
    state.combatEntities.push(b);
    
    if (state.hasSynaptic) {
        state.synapticActive = true;
        logMessage("Acelerador Sináptico: Iniciativa de combate garantida (Turno extra).", "combat");
    } else {
        state.synapticActive = false;
    }
    
    logMessage("EXECUTING BOSS PROTOCOL. NO ESCAPE.", "warn");
    if (c === 'blackwall') logMessage(`<span class="glitch-text">[!] BABEL INICIALIZADA. IMUNE A DANO FÍSICO.</span>`, "warn", true);
    updateUI();
    renderCombatGrid();
};

function renderCombatGrid() {
    if (!state.inCombat) {
        if(els.bossHp) els.bossHp.style.display = 'none';
        return;
    }
    if (state.isBossFight && els.bossHp) {
        els.bossHp.style.display = 'block';
        let b = state.combatEntities.find(e => e.isBoss);
        if (b) {
            let pct = Math.max(0, Math.floor((b.hp / b.maxHp) * 100));
            let barLen = 10;
            let filled = Math.floor((pct/100) * barLen);
            els.bossHp.textContent = `BOSS [${'█'.repeat(filled)}${'.'.repeat(barLen - filled)}] ${pct}%`;
        }
    } else if (els.bossHp) {
        els.bossHp.style.display = 'none';
    }
    let grid = state.combatMap.map(row => [...row]);
    
    // Draw entities
    state.combatEntities.forEach(ent => {
        if (ent.type === 'enemy') grid[ent.y][ent.x] = ent.sym;
    });
    // Draw player last (on top)
    const p = state.combatEntities.find(e => e.type === 'player');
    if (p) grid[p.y][p.x] = p.sym;
    
    let str = grid.map(row => row.join(' ')).join('\n');
    els.combatCanvas.textContent = str;
}

window.combatQuickhack = function() {
    if (!state.inCombat || state.currentHp <= 0) return;
    if (state.currentRam < 1) { logMessage(`[!] RAM Insuficiente para Quickhack!`, 'warn'); return; }
    const p = state.combatEntities.find(e => e.type === 'player');
    if (!p) return;
    
    let target = null;
    state.combatEntities.filter(e => e.type === 'enemy').forEach(e => {
        if (Math.abs(p.x - e.x) + Math.abs(p.y - e.y) <= 2) target = e; // Range 2
    });

    if (target) {
        state.currentRam -= 1;
        if (state.currentCity === 'blackwall' && target.isBoss && target.immuneDigital) {
            logMessage(`[!] BABEL ergue a Blackwall. IMUNE A QUICKHACKS.`, 'warn');
        } else {
            let dmg = 40 + (state.reputation.nullSec >= 50 ? 10 : 0);
            target.hp -= dmg;
            logMessage(`Quickhack Surge dealt ${dmg} digital DMG!`, 'combat');
            triggerScreenGlitch(200);
            if (target.hp <= 0) {
                logMessage(`Enemy destroyed!`, "combat");
                state.combatEntities = state.combatEntities.filter(e => e.id !== target.id);
            }
        }
        if (state.isBossFight) state.combatTurns++;
        handleCombatInput(0, 0); // Advance turn
    } else {
        logMessage(`No target in range (2 tiles) for Quickhack.`, 'warn');
    }
};

window.handleCombatInput = function(dx, dy) {
    if (!state.inCombat || state.currentHp <= 0) return;
    
    if (state.inventoryBlocked && state.inventoryBlocked > 0) {
        state.inventoryBlocked--;
        if (state.inventoryBlocked === 0) {
            logMessage(`[SYSTEM] Controle de inventário restaurado.`, "system");
            renderInventory();
        }
    }

    const p = state.combatEntities.find(e => e.type === 'player');
    if (!p) return;
    
    const nx = p.x + dx; const ny = p.y + dy;
    
    if (dx !== 0 || dy !== 0) {
        if (state.isBossFight) state.combatTurns++;
        // Bounds & Wall check
        if (state.combatMap[ny] && state.combatMap[ny][nx] !== '#') {
            const enemy = state.combatEntities.find(e => e.type === 'enemy' && e.x === nx && e.y === ny);
            if (enemy) {
                // Attack
                let dmg = getPlayerDmg();
                if (state.hasKiroshi && Math.random() < 0.15) {
                    dmg *= 2;
                    logMessage(`[Ópticas Kiroshi] ACERTO CRÍTICO!`, "combat");
                }
                
                let isTrueDmg = state.equipment.weapon === 'relic_blackwall_ice';

                if (!isTrueDmg && state.currentCity === 'blackwall' && enemy.isBoss && enemy.immunePhysical) {
                    logMessage(`[!] BABEL altera sua matriz. IMUNE A DANO FÍSICO.`, "warn");
                    dmg = 0;
                }
                
                let finalDmg = dmg;
                if (!isTrueDmg) {
                    finalDmg = Math.max(1, dmg - (enemy.armor || 0));
                    if (dmg === 0) finalDmg = 0;
                } else {
                    logMessage(`[ICE-BREAKER] Dano verdadeiro aplicado! Armor e imunidades ignorados.`, "combat");
                }
                
                enemy.aggro = true; // Corpo Plaza mechanic
                enemy.hp -= finalDmg;
                logMessage(`You hit Enemy for ${finalDmg} DMG. [HP: ${enemy.hp}/${enemy.maxHp}]`, "combat");
                if (enemy.hp <= 0) {
                    logMessage(`Enemy destroyed!`, "combat");
                    state.combatEntities = state.combatEntities.filter(e => e.id !== enemy.id);
                }
                // Monowire Cleave (hit adjacent enemies)
                if (state.equipment.weapon === 'monowire' && enemy.hp > -999) {
                    state.combatEntities.filter(e => e.type === 'enemy' && e.id !== enemy.id).forEach(adj => {
                        let dist = Math.abs(p.x - adj.x) + Math.abs(p.y - adj.y);
                        if (dist <= 2) {
                            let cleaveDmg = Math.floor(dmg * 0.5);
                            adj.hp -= cleaveDmg;
                            logMessage(`Monowire cleaved adjacent Enemy for ${cleaveDmg} DMG!`, "combat");
                            if (adj.hp <= 0) {
                                logMessage(`Adjacent Enemy destroyed!`, "combat");
                                state.combatEntities = state.combatEntities.filter(e => e.id !== adj.id);
                            }
                        }
                    });
                }
            } else {
                const ally = state.combatEntities.find(e => e.type === 'ally' && e.x === nx && e.y === ny);
                if (ally) {
                    logMessage(`Path blocked by Ally.`, "warn");
                    return; // invalid move
                }
                p.x = nx; p.y = ny; // Move
                if (state.combatMap[ny][nx] === '*') {
                    state.currentHp -= 15;
                    logMessage(`Trapped! Took 15 thermal damage from ICE.`, "warn");
                    state.combatMap[ny][nx] = '.';
                } else if (state.combatMap[ny][nx] === 'Ø') {
                    state.currentHp -= 100;
                    state.currentRam = Math.max(0, state.currentRam - 5);
                    logMessage(`[!] SYSTEM EXCEPTION: Stepped into the Void (Ø). 100 True DMG, -5 RAM!`, "warn");
                }
            }
        } else {
            logMessage(`Path blocked.`, "warn");
            return; // invalid move, don't trigger enemy turn
        }
    }
    
    if (state.hasApogee && state.apogeeTurns > 0) {
        state.apogeeTurns--;
        logMessage(`[APOGEE] Time Stop active. ${state.apogeeTurns} turn(s) remaining.`, "combat");
        allyTurn(); 
        // skip enemyTurn
    } else if (state.synapticActive) {
        state.synapticActive = false; // Uses up the first strike buff
    } else {
        // Sandevistan allows 2 player moves per 1 enemy move
        if (state.hasSandevistan) {
            state.sandevistanTicks = (state.sandevistanTicks || 0) + 1;
            if (state.sandevistanTicks >= 2) {
                state.sandevistanTicks = 0;
                allyTurn();
                enemyTurn();
            } else {
                logMessage(`[Sandevistan] Accelerated reaction time - Extra move available!`, "combat");
            }
        } else {
            allyTurn();
            enemyTurn();
        }
    }
    
    checkCombatState();
    renderCombatGrid();
    updateUI();
};

function allyTurn() {
    let allies = state.combatEntities.filter(e => e.type === 'ally');
    if (allies.length === 0) return;

    for (let ally of allies) {
        let mercDef = MERC_DB.find(m => m.id === ally.id);
        if (!mercDef) continue;
        
        let moves = mercDef.id === 'merc_edge' ? 2 : 1;
        for (let m = 0; m < moves; m++) {
            let enemies = state.combatEntities.filter(e => e.type === 'enemy');
            if (enemies.length === 0) break;
            
            let closest = null;
            let minDist = Infinity;
            for (let e of enemies) {
                let d = Math.abs(ally.x - e.x) + Math.abs(ally.y - e.y);
                if (d < minDist) { minDist = d; closest = e; }
            }
            if (!closest) break;
            
            let dx = closest.x - ally.x;
            let dy = closest.y - ally.y;
            
            let canAttack = false;
            let shouldMove = true;
            let stepX = 0, stepY = 0;
            
            if (mercDef.id === 'merc_net') {
                if (minDist <= 2) {
                    canAttack = true;
                    if (minDist === 1) {
                        shouldMove = true;
                        stepX = dx > 0 ? -1 : 1;
                        stepY = dy > 0 ? -1 : 1;
                    } else {
                        shouldMove = false;
                    }
                } else {
                    if (Math.abs(dx) > Math.abs(dy)) stepX = dx > 0 ? 1 : -1;
                    else stepY = dy > 0 ? 1 : -1;
                }
            } else {
                if (minDist === 1) {
                    canAttack = true;
                    shouldMove = false;
                } else {
                    if (Math.abs(dx) > Math.abs(dy)) stepX = dx > 0 ? 1 : -1;
                    else stepY = dy > 0 ? 1 : -1;
                }
            }

            if (canAttack) {
                closest.hp -= ally.dmg;
                logMessage(`[+] Merc '${mercDef.name}' atingiu Inimigo por ${ally.dmg} dano!`, 'combat');
                if (closest.hp <= 0) {
                    logMessage(`Inimigo abatido pelo Mercenário!`, 'combat');
                    state.combatEntities = state.combatEntities.filter(e => e.id !== closest.id);
                }
            }

            if (shouldMove) {
                let nx = ally.x + stepX; let ny = ally.y + stepY;
                if (state.combatMap[ny] && state.combatMap[ny][nx] !== '#' && !state.combatEntities.some(e => e.x === nx && e.y === ny)) {
                    ally.x = nx; ally.y = ny;
                } else if (stepX !== 0 || stepY !== 0) {
                    if (stepX !== 0) { stepX = 0; stepY = dy > 0 ? 1 : -1; }
                    else { stepX = dx > 0 ? 1 : -1; stepY = 0; }
                    nx = ally.x + stepX; ny = ally.y + stepY;
                    if (state.combatMap[ny] && state.combatMap[ny][nx] !== '#' && !state.combatEntities.some(e => e.x === nx && e.y === ny)) {
                        ally.x = nx; ally.y = ny;
                    }
                }
            }
        }
        
        let hired = state.hiredMercs.find(m => m.id === ally.id);
        if (hired) hired.currentHp = ally.hp;
    }
}

function enemyTurn() {
    const p = state.combatEntities.find(e => e.type === 'player');
    if (!p) return;
    
    let possibleTargets = state.combatEntities.filter(e => e.type === 'player' || e.type === 'ally');
    
    const moveEnemy = (enemy, target) => {
        let dx = target.x - enemy.x;
        let dy = target.y - enemy.y;
        let dist = Math.abs(dx) + Math.abs(dy);
        if (dist === 1) {
            if (target.type === 'player') {
                let finalDmg = Math.max(1, enemy.dmg - getPlayerArmor());
                state.currentHp -= finalDmg;
                logMessage(`Enemy hit you for ${finalDmg} DMG!`, "combat");
                triggerScreenGlitch(300);
            } else {
                target.hp -= enemy.dmg;
                let mDef = MERC_DB.find(m => m.id === target.id);
                logMessage(`Enemy hit ${mDef?mDef.name:'Ally'} for ${enemy.dmg} DMG!`, "combat");
                if (target.hp <= 0) {
                    logMessage(`[!] MERCENÁRIO ABATIDO!`, "warn");
                    state.combatEntities = state.combatEntities.filter(e => e.id !== target.id);
                    let hired = state.hiredMercs.find(m => m.id === target.id);
                    if (hired) { hired.currentHp = 0; hired.status = 'recovering'; }
                } else {
                    let hired = state.hiredMercs.find(m => m.id === target.id);
                    if (hired) hired.currentHp = target.hp;
                }
            }
        } else if (dist > 1) {
            let stepX = 0, stepY = 0;
            if (Math.abs(dx) > Math.abs(dy)) stepX = dx > 0 ? 1 : -1;
            else stepY = dy > 0 ? 1 : -1;
            
            let nx = enemy.x + stepX; let ny = enemy.y + stepY;
            if (state.combatMap[ny] && state.combatMap[ny][nx] !== '#' && !state.combatEntities.some(e => e.x === nx && e.y === ny)) {
                enemy.x = nx; enemy.y = ny;
            } else {
                if (stepX !== 0) { stepX = 0; stepY = dy > 0 ? 1 : -1; }
                else { stepX = dx > 0 ? 1 : -1; stepY = 0; }
                nx = enemy.x + stepX; ny = enemy.y + stepY;
                if (state.combatMap[ny] && state.combatMap[ny][nx] !== '#' && !state.combatEntities.some(e => e.x === nx && e.y === ny)) {
                    enemy.x = nx; enemy.y = ny;
                }
            }
        }
    };

    let enemies = state.combatEntities.filter(e => e.type === 'enemy');
    for (let enemy of enemies) {
        if (enemy.stunned) {
            enemy.stunned = false;
            continue;
        }
        
        if (!enemy.isBoss && state.hackedTowers && state.hackedTowers.corpo_plaza && !enemy.aggro) {
            continue; // Systemic Ghost active
        }
        
        // Find closest target
        let t = p;
        let minDist = Infinity;
        for (let pt of possibleTargets) {
            let d = Math.abs(enemy.x - pt.x) + Math.abs(enemy.y - pt.y);
            if (d < minDist) { minDist = d; t = pt; }
        }
        
        if (enemy.isBoss) {
            let dx = t.x - enemy.x; let dy = t.y - enemy.y; let dist = Math.abs(dx) + Math.abs(dy);
            let c = state.currentCity;
            if (c === 'kabuki') {
                if (state.combatTurns % 5 === 0) {
                    let sx = enemy.x + 1; let sy = enemy.y;
                    if (state.combatMap[sy] && state.combatMap[sy][sx] === '.') {
                        state.combatEntities.push({ id: 's_'+Math.random(), type: 'enemy', x: sx, y: sy, sym: 's', hp: 20, maxHp: 20, dmg: 5 });
                    }
                }
                if (state.combatTurns % 2 !== 0) continue; 
                moveEnemy(enemy, t);
            } else if (c === 'japantown') {
                if (dx === 0 || dy === 0) {
                    if (t.type === 'player') {
                        state.currentHp -= 40;
                        logMessage(`Ronin.exe DASHED at you! 40 DMG!`, "warn");
                        triggerScreenGlitch(300);
                    } else {
                        t.hp -= 40;
                        logMessage(`Ronin.exe DASHED at Ally! 40 DMG!`, "warn");
                        if (t.hp <= 0) {
                            state.combatEntities = state.combatEntities.filter(e => e.id !== t.id);
                            let hired = state.hiredMercs.find(m => m.id === t.id);
                            if (hired) { hired.currentHp = 0; hired.status = 'recovering'; }
                        }
                    }
                } else {
                    moveEnemy(enemy, t);
                    moveEnemy(enemy, t);
                }
            } else if (c === 'pacifica') {
                if (dist <= 3) {
                    let stepX = dx > 0 ? -1 : 1; let stepY = dy > 0 ? -1 : 1;
                    if (state.combatMap[enemy.y] && state.combatMap[enemy.y][enemy.x + stepX] === '.') enemy.x += stepX;
                    else if (state.combatMap[enemy.y + stepY] && state.combatMap[enemy.y + stepY][enemy.x] === '.') enemy.y += stepY;
                }
                if (dist <= 4 && Math.random() < 0.5) {
                    state.currentRam = Math.max(0, state.currentRam - 1);
                    logMessage("Voodoo Oracle drains 1 RAM!", "warn");
                    if (state.currentRam === 0) {
                        enemy.hp = Math.min(enemy.maxHp, enemy.hp + 20);
                        logMessage("Oracle heals 20 HP from empty RAM!", "warn");
                    }
                } else {
                    moveEnemy(enemy, t);
                }
            } else if (c === 'dogtown') {
                const isEnraged = enemy.hp < 540;
                if (isEnraged && !enemy.enragedLog) {
                    triggerScreenGlitch(500);
                    logMessage("[!] MODO BERSERK: O Cyber-Psycho abandona a defesa! Armadura zerada, ataques duplos.", "combat");
                    enemy.enragedLog = true;
                    enemy.armor = 0;
                }
                
                if (enemy.leapCooldown === undefined) enemy.leapCooldown = 0;
                if (enemy.leapCooldown > 0) enemy.leapCooldown--;

                const moves = isEnraged ? 2 : 1;
                for (let m = 0; m < moves; m++) {
                    dx = t.x - enemy.x; dy = t.y - enemy.y; dist = Math.abs(dx) + Math.abs(dy);
                    if (dist > 3 && enemy.leapCooldown === 0) {
                        enemy.leapCooldown = 3;
                        logMessage(`[!] O Cyber-Psycho salta pela arena e esmaga o chão! -20 HP.`, "combat");
                        if (t.type === 'player') {
                            state.currentHp -= 20;
                            triggerScreenGlitch(300);
                        } else {
                            t.hp -= 20;
                            if (t.hp <= 0) {
                                state.combatEntities = state.combatEntities.filter(e => e.id !== t.id);
                                let hired = state.hiredMercs.find(mer => mer.id === t.id);
                                if (hired) { hired.currentHp = 0; hired.status = 'recovering'; }
                            }
                        }
                        
                        let nx = t.x + (Math.random() > 0.5 ? 1 : -1);
                        let ny = t.y;
                        if (state.combatMap[ny] && state.combatMap[ny][nx] !== '#' && !state.combatEntities.some(e => e.x === nx && e.y === ny)) {
                            enemy.x = nx; enemy.y = ny;
                        } else {
                            nx = t.x; ny = t.y + (Math.random() > 0.5 ? 1 : -1);
                            if (state.combatMap[ny] && state.combatMap[ny][nx] !== '#' && !state.combatEntities.some(e => e.x === nx && e.y === ny)) {
                                enemy.x = nx; enemy.y = ny;
                            }
                        }
                    } else {
                        moveEnemy(enemy, t);
                    }
                }
            } else if (c === 'corpo_plaza') {
                if (state.combatTurns % 3 === 0) {
                    for(let i=0; i<3; i++){
                        let rx = 1+Math.floor(Math.random()*18);
                        let ry = 1+Math.floor(Math.random()*13);
                        if (state.combatMap[ry] && state.combatMap[ry][rx] === '.') state.combatMap[ry][rx] = '*';
                    }
                    logMessage("ICE-Breaker deployed thermal traps!", "warn");
                }
                moveEnemy(enemy, t);
            } else if (c === 'blackwall') {
                // Phase shifts
                enemy.phaseTurns = (enemy.phaseTurns || 0) + 1;
                if (enemy.phaseTurns >= 4) {
                    enemy.phaseTurns = 0;
                    enemy.immunePhysical = !enemy.immunePhysical;
                    enemy.immuneDigital = !enemy.immuneDigital;
                    if (enemy.immunePhysical) logMessage(`<span class="glitch-text">[!] BABEL altera sua matriz. IMUNE A DANO FÍSICO.</span>`, "warn", true);
                    else logMessage(`<span class="glitch-text">[!] BABEL ergue a Blackwall. IMUNE A QUICKHACKS.</span>`, "warn", true);
                    triggerScreenGlitch(200);
                }

                // Sector Deletion
                if (state.combatTurns % 3 === 0) {
                    let deleted = 0;
                    for (let i = 0; i < 20; i++) { // try up to 20 times to find empty tiles near player
                        let rx = p.x + (Math.floor(Math.random() * 5) - 2);
                        let ry = p.y + (Math.floor(Math.random() * 5) - 2);
                        if (state.combatMap[ry] && state.combatMap[ry][rx] === '.' && !(rx === p.x && ry === p.y)) {
                            state.combatMap[ry][rx] = 'Ø';
                            deleted++;
                            if (deleted >= 2) break;
                        }
                    }
                    if (deleted > 0) logMessage(`<span class="glitch-text" style="color:red;">[!] BABEL deletou setores do mapa! Evite o Vazio (Ø).</span>`, "warn", true);
                }

                // 4th Wall Hack
                if ((enemy.hp <= 2500 && !enemy.hack1) || (enemy.hp <= 1000 && !enemy.hack2)) {
                    if (enemy.hp <= 1000) enemy.hack2 = true;
                    else enemy.hack1 = true;
                    
                    triggerScreenGlitch(1500);
                    logMessage(`<span class="glitch-text" style="color:#0ff; font-weight:bold;">[§#@] Y0U C4NN0T H3AL WH4T 1S ALR3ADY D3AD. INVENTÁRIO BLOQUEADO.</span>`, "warn", true);
                    
                    // Disable inventory items for 2 player turns
                    state.inventoryBlocked = 2; // this blocks consumables
                    renderInventory(); // update the UI immediately
                }
                
                moveEnemy(enemy, t);
            }
        } else {
            moveEnemy(enemy, t);
        }
    }
}

function checkCombatState() {
    const enemies = state.combatEntities.filter(e => e.type === 'enemy');
    if (state.currentHp <= 0) {
        logMessage(`SYSTEM FAILURE. FLATLINE DETECTED.`, "warn");
        state.inCombat = false;
        state.isBossFight = false;
        state.currentHp = Math.floor(getMaxHp() * 0.2); // revive with 20% hp
        logMessage(`Emergency trauma team extracted you. (HP penalized)`, "system");
        if(els.bossHp) els.bossHp.style.display = 'none';
    } else if (enemies.length === 0) {
        let isB = state.isBossFight;
        if (isB) {
            logMessage(`BOSS DEFEATED!`, "event");
            if (!state.defeatedBosses.includes(state.currentCity)) state.defeatedBosses.push(state.currentCity);
            if (state.currentCity === 'kabuki') {
                if(!state.unlockedDistricts.includes('japantown')) state.unlockedDistricts.push('japantown');
                state.inventory.push({id: 'scav_plating', name: 'Scavenger Scrap-Plating', type:'armor', qty:1});
            } else if (state.currentCity === 'japantown') {
                if(!state.unlockedDistricts.includes('pacifica')) state.unlockedDistricts.push('pacifica');
                state.inventory.push({id: 'monowire_mk2', name: 'Monowire Mk.II', type:'weapon', qty:1});
            } else if (state.currentCity === 'pacifica') {
                if(!state.unlockedDistricts.includes('corpo_plaza')) state.unlockedDistricts.push('corpo_plaza');
                state.inventory.push({id: 'encrypted_shard', name: 'Encrypted Shard', type:'consumable', qty:1});
            } else if (state.currentCity === 'corpo_plaza') {
                if(!state.unlockedDistricts.includes('blackwall')) state.unlockedDistricts.push('blackwall');
                logMessage(`MASSIVE PRESTIGE: ICE-BREAKER DEFEATED. THE BLACKWALL AWAITS.`, "event");
            } else if (state.currentCity === 'dogtown') {
                state.inventory.push({id: 'sandevistan_spine', name: 'Sandevistan Neural-Spine', type:'cyberware', qty:1});
                state.bytes += 15000;
                logMessage(`[nullSec Rep] Faction Reputation +20!`, "event");
            } else if (state.currentCity === 'blackwall') {
                state.babelDefeated = true;
                state.bytes += 100000;
                state.reputation.nullSec = 100;
                let ntDrop = 10;
                state.neuroTokens = (state.neuroTokens || 0) + ntDrop;
                logMessage(`[!] ULTRA-RARE REWARD: Boss dropped ${ntDrop} Neuro-Tokens!`, "event");
                logMessage(`[!] BABEL SINGULARITY COLLAPSED. ENDGAME PROTOCOL INITIATED.`, "event");
                state.inCombat = false;
                state.isBossFight = false;
                if (els.bossHp) els.bossHp.style.display = 'none';
                saveGame();
                initiateEndgameProtocol();
                return;
            }

            // Neuro-Token Drop
            let ntDrop = (state.currentCity === 'blackwall') ? 10 : 3;
            state.neuroTokens += ntDrop;
            logMessage(`[!] ULTRA-RARE REWARD: Boss dropped ${ntDrop} Neuro-Tokens!`, "event");

            // Ghost Fragment Drop
            let fragItem = state.inventory.find(i => i.id === 'core_ghost_fragment');
            if (fragItem) fragItem.qty++;
            else state.inventory.push({ id: 'core_ghost_fragment', name: 'Core Ghost Fragment', type: 'junk', qty: 1 });
            logMessage(`[!] LORE ACQUIRED: CORE GHOST FRAGMENT DROP.`, "event");
            
            // Check win condition
            let fragCount = state.inventory.find(i => i.id === 'core_ghost_fragment')?.qty || 0;
            // Pre-Babel revelation button will appear in Archive if fragCount >= 4
        }
        
        logMessage(`INCURSION SUCCESSFUL. Sector cleared.`, "event");
        state.inCombat = false;
        state.isBossFight = false;
        if(els.bossHp) els.bossHp.style.display = 'none';
        
        // Reward
        let rew = DISTRICTS[state.currentCity].enemyHp * 5;
        if (isB) rew *= 5; // extra boss reward
        state.bytes += rew;
        logMessage(`Extracted ${rew} $B from local network.`, "event");
        renderAll();
    }
}

// Mercenary UI Functions
window.hireMerc = function(mercId) {
    const mercDef = MERC_DB.find(m => m.id === mercId);
    if (!mercDef) return;
    if (state.hiredMercs.some(m => m.id === mercId)) {
        logMessage(`Mercenary ${mercDef.name} already hired.`, 'warn');
        return;
    }
    if (state.bytes >= mercDef.cost) {
        state.bytes -= mercDef.cost;
        let hp = mercDef.maxHp;
        if (state.hackedTowers && state.hackedTowers.dogtown) hp = Math.floor(hp * 1.5);
        
        state.hiredMercs.push({
            id: mercDef.id,
            name: mercDef.name,
            class: mercDef.role,
            maxHp: hp,
            currentHp: hp,
            damage: mercDef.dmg,
            symbol: mercDef.sym,
            status: 'ready'
        });
        logMessage(`Hired Mercenary: ${mercDef.name} [${mercDef.role}].`, 'item');
        renderMercs();
        updateUI();
    } else {
        logMessage(`Insufficient Bytes to hire ${mercDef.name}.`, 'warn');
    }
};

window.callMerc = function(mercId) {
    const merc = state.hiredMercs.find(m => m.id === mercId);
    if (!merc) return;
    if (merc.status !== 'ready') {
        logMessage(`${merc.name} is not ready for combat.`, 'warn');
        return;
    }
    state.activeMerc = mercId;
    logMessage(`Backup called: ${merc.name} will join you in the next incursion.`, 'system');
    renderMercs();
};

window.healMerc = function(mercId) {
    const merc = state.hiredMercs.find(m => m.id === mercId);
    if (!merc || merc.status === 'ready') return;
    const healCost = 1000;
    if (state.bytes >= healCost) {
        state.bytes -= healCost;
        merc.currentHp = merc.maxHp;
        merc.status = 'ready';
        logMessage(`Paid medical bills for ${merc.name}. They are back in action.`, 'system');
        renderMercs();
        updateUI();
    } else {
        logMessage(`Insufficient Bytes to pay medical bills.`, 'warn');
    }
};

window.buyRelic = function(relicId) {
    if (relicId === 'relic_overclock') {
        if (state.neuroTokens >= 5 && !state.hasOverclock) {
            state.neuroTokens -= 5;
            state.hasOverclock = true;
            logMessage(`[DEEP WEB] Neural-Link Overclock instalado. Regeneração de RAM dobrada!`, 'item');
        }
    } else if (relicId === 'relic_apogee') {
        if (state.neuroTokens >= 10 && !state.hasApogee) {
            state.neuroTokens -= 10;
            state.hasApogee = true;
            logMessage(`[DEEP WEB] Relíquia Apogee instalada. Time-Stop ativado em incursões!`, 'item');
        }
    } else if (relicId === 'relic_blackwall_ice') {
        if (state.neuroTokens >= 15 && !state.inventory.find(i => i.id === 'relic_blackwall_ice')) {
            state.neuroTokens -= 15;
            state.inventory.push({ id: 'relic_blackwall_ice', name: 'ICE-Breaker Blackwall', type: 'weapon', val: 50, qty: 1 });
            logMessage(`[DEEP WEB] ICE-Breaker Blackwall adquirido. Dano verdadeiro desbloqueado.`, 'item');
            renderInventory();
        }
    } else if (relicId === 'relic_elite_merc') {
        if (state.neuroTokens >= 8 && !state.hasEliteMercs) {
            state.neuroTokens -= 8;
            state.hasEliteMercs = true;
            state.hiredMercs.forEach(m => {
                const def = MERC_DB.find(db => db.id === m.id);
                m.maxHp = def.maxHp * 2;
                m.damage = def.dmg * 2;
                m.currentHp = m.maxHp;
                m.status = 'ready';
            });
            logMessage(`[DEEP WEB] Engrama Elite aplicado. Todos os mercenários foram revividos e seus atributos dobraram!`, 'item');
            renderMercs();
        }
    }
    updateUI();
};

window.renderMercs = function() {
    if (!els.mercList) return;
    els.mercList.innerHTML = '';
    MERC_DB.forEach(mDef => {
        const mHired = state.hiredMercs.find(m => m.id === mDef.id);
        const div = document.createElement('div');
        div.style.marginBottom = '15px';
        div.style.padding = '10px';
        div.style.border = '1px solid var(--text-dim)';
        
        let header = `<h4 style="margin:0; color:#ff0;">${mDef.name} [${mDef.sym}] - ${mDef.role}</h4>
                      <p style="margin:5px 0; font-size:0.9rem; color:var(--text-dim);">${mDef.desc}<br>HP: ${mDef.maxHp} | DMG: ${mDef.dmg}</p>`;
        
        let actions = '';
        if (!mHired) {
            actions = `<button class="inline-btn" onclick="hireMerc('${mDef.id}')">HIRE (Cost: ${mDef.cost} $B)</button>`;
        } else {
            let statusColor = mHired.status === 'ready' ? '#0f0' : '#f00';
            header += `<p style="margin:5px 0; font-size:0.9rem;">Status: <span style="color:${statusColor};">${mHired.status.toUpperCase()}</span> (HP: ${mHired.currentHp}/${mHired.maxHp})</p>`;
            
            if (mHired.status === 'ready') {
                if (state.activeMerc === mDef.id) {
                    actions = `<button class="inline-btn" disabled style="color:#0f0; border-color:#0f0;">[ ACTIVE BACKUP ]</button>`;
                } else {
                    actions = `<button class="inline-btn" onclick="callMerc('${mDef.id}')">CALL BACKUP</button>`;
                }
            } else {
                actions = `<button class="inline-btn" onclick="healMerc('${mDef.id}')">PAY MEDICAL BILLS (1000 $B)</button>`;
            }
        }
        
        div.innerHTML = header + actions;
        els.mercList.appendChild(div);
    });
};

// Keyboard Listener for Combat
document.addEventListener('keydown', (e) => {
    if (!state.inCombat) return;
    if (e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') handleCombatInput(0, -1);
    else if (e.key.toLowerCase() === 's' || e.key === 'ArrowDown') handleCombatInput(0, 1);
    else if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') handleCombatInput(-1, 0);
    else if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') handleCombatInput(1, 0);
    else if (e.key === ' ') handleCombatInput(0, 0); // Wait
});

// -----------------------------------------------------------------------------
// CORE LOOP & UI
// -----------------------------------------------------------------------------

window.upgradeSafehouse = function() {
    let cost = 0;
    if (state.safehouseLevel === 1) cost = 5000;
    else if (state.safehouseLevel === 2) cost = 20000;
    else if (state.safehouseLevel === 3) cost = 100000;
    
    if (cost > 0 && state.bytes >= cost) {
        state.bytes -= cost;
        state.safehouseLevel++;
        logMessage(`Safehouse upgraded to Level ${state.safehouseLevel}.`, 'item');
        updateUI();
    }
};

let vigInterval = null;
let vigRows = [];
let vigStrikes = 0;

const VIG_DATA = {
    'kabuki': {
        lore: "A polícia terceirizada usa essa antena sucateada para guiar os drones de patrulha pelas favelas. Sintonize a frequência e corte o sinal.",
        rows: 2, speeds: [0.5, -0.5], widths: [20, 20], target: [9, 11]
    },
    'japantown': {
        lore: "As garras dos Tyger Claws estão no sistema de tráfego. Eles sabem para onde você vai antes mesmo de você chegar. Cegue os olhos eletrônicos deles.",
        rows: 3, speeds: [0.8, -0.6, 0.8], widths: [20, 25, 20], target: [9, 11]
    },
    'pacifica': {
        lore: "Os Voodoo Boys ergueram um servidor fantasma na rede de vigilância morta. Interceptar esse sinal esconde seu IP do rastreio corporativo.",
        rows: 4, speeds: [1.0, -0.8, 0.8, -1.0], widths: [25, 20, 25, 20], target: [11, 13]
    },
    'dogtown': {
        lore: "Um radar militar de varredura ativa. A tempestade de areia recente reduziu a velocidade de rotação da antena. Intercepte o sinal para ocultar seus mercenários.",
        rows: 3, speeds: [0.9, -0.85, 0.9], widths: [30, 30, 30], target: [13, 16]
    },
    'corpo_plaza': {
        lore: "O Panóptico definitivo. Um satélite apontado diretamente para a sua nuca. Quebre a criptografia quântica e apague sua existência do banco de dados deles.",
        rows: 5, speeds: [1.0, -1.2, 1.2, -1.0, 1.4], widths: [30, 25, 30, 20, 30], target: [14, 15]
    }
};

window.initVigilanceBreaker = function() {
    if (state.hackedTowers && state.hackedTowers[state.currentCity]) {
        logMessage(`[!] O nó ctOS em ${DISTRICTS[state.currentCity].name} já está ONLINE e sob seu controle.`, 'warn');
        return;
    }
    const cData = VIG_DATA[state.currentCity];
    if (!cData) {
        logMessage(`[!] Nenhum nó ctOS acessível neste setor.`, 'warn');
        return;
    }

    const worldSections = document.querySelectorAll('#panel-world > section');
    if (worldSections.length > 0) {
        worldSections.forEach(el => el.classList.add('hidden'));
    } else {
        els.mainLayout.querySelectorAll('section:not(#log-container)').forEach(el => el.classList.add('hidden'));
    }
    els.vigilancePanel.classList.remove('hidden');
    const logContainer = document.getElementById('log-container');
    if (logContainer) logContainer.classList.remove('hidden');

    vigStrikes = 0;
    els.vigLore.textContent = cData.lore;
    els.vigStrikes.textContent = `[ RASTREIO DE REDE: 0/3 AVISOS ]`;
    els.vigStrikes.style.color = '#0ff';
    
    vigRows = [];
    for (let i = 0; i < cData.rows; i++) {
        vigRows.push({
            pos: Math.random() * cData.widths[i],
            speed: cData.speeds[i],
            width: cData.widths[i],
            targetMin: cData.target[0],
            targetMax: cData.target[1],
            locked: false
        });
    }

    if (vigInterval) clearInterval(vigInterval);
    vigInterval = setInterval(updateVigilancePuzzle, 50);
};

function updateVigilancePuzzle() {
    let html = "";
    vigRows.forEach(row => {
        if (!row.locked) {
            row.pos += row.speed;
            if (row.pos >= row.width || row.pos <= 0) {
                row.speed *= -1; // bounce
                row.pos = Math.max(0, Math.min(row.width, row.pos));
            }
        }
        let p = Math.floor(row.pos);
        let str = "";
        for(let i = 0; i <= row.width; i++) {
            if (i === row.targetMin) str += "<span style='color:#fff;'>[</span>";
            if (i === p) str += "<strong style='color:#0f0;'>@</strong>";
            else str += "-";
            if (i === row.targetMax) str += "<span style='color:#fff;'>]</span>";
        }
        if (row.locked) html += `<div style="color:#555;">${str} <span style="color:#0f0;">[OK]</span></div>`;
        else html += `<div>${str}</div>`;
    });
    els.frequencyCanvas.innerHTML = html;
}

window.attemptVigilanceSync = function() {
    if (!els.vigilancePanel || els.vigilancePanel.classList.contains('hidden')) return;
    
    // Find first unlocked row
    let row = vigRows.find(r => !r.locked);
    if (!row) return;

    let p = Math.floor(row.pos);
    if (p >= row.targetMin && p <= row.targetMax) {
        row.locked = true;
        logMessage(`[HACK] Sincronização estabelecida na camada.`, 'event');
        updateVigilancePuzzle();
        
        if (!vigRows.find(r => !r.locked)) {
            // ALL LOCKED = SUCCESS
            clearInterval(vigInterval);
            if (!state.hackedTowers) state.hackedTowers = {};
            state.hackedTowers[state.currentCity] = true;
            saveGame();
            logMessage(`[HACK SUCESSO] Vigilant Breaker: Online em ${DISTRICTS[state.currentCity].name}. Nó ctOS neutralizado.`, 'item');
            
            // Dogtown reward
            if (state.currentCity === 'dogtown') {
                state.hiredMercs.forEach(m => {
                    const def = MERC_DB.find(db => db.id === m.id);
                    if (def) { m.maxHp = Math.floor(def.maxHp * 1.5); m.currentHp = m.maxHp; }
                });
                renderMercs();
            }
            
            abortVigilanceBreaker();
        }
    } else {
        vigStrikes++;
        if (vigStrikes === 2) {
            triggerScreenGlitch(300);
            els.vigStrikes.style.color = '#f00';
        }
        if (vigStrikes >= 3) {
            clearInterval(vigInterval);
            abortVigilanceBreaker();
            state.heat = 100;
            updateUI(); // force heat update
            triggerInvasion();
            logMessage(`[!] FALHA DE SINCRONIZAÇÃO. O ICE corporativo rastreou sua localização! PROTOCOLO DE INVASÃO DETECTADO.`, 'warn');
        } else {
            els.vigStrikes.textContent = `[ RASTREIO DE REDE: ${vigStrikes}/3 AVISOS ]`;
            logMessage(`[!] Erro de sincronização! Aviso ${vigStrikes}/3.`, 'warn');
        }
    }
};

window.abortVigilanceBreaker = function() {
    if (vigInterval) clearInterval(vigInterval);
    els.vigilancePanel.classList.add('hidden');
    els.mainLayout.querySelectorAll('.non-combat').forEach(el => el.classList.remove('hidden'));
    const logContainer = document.getElementById('log-container');
    if (logContainer) logContainer.classList.remove('hidden');
    updateUI(); 
    renderMap();
    updateVigilanceButton();
};

// Add spacebar listener
document.addEventListener('keydown', (e) => {
    if (els.vigilancePanel && !els.vigilancePanel.classList.contains('hidden') && e.key === ' ') {
        e.preventDefault();
        attemptVigilanceSync();
    }
});

window.readBBSPost = function() {
    if (state.currentRam < 1) {
        logMessage(`[!] RAM Insuficiente para decodificar roteamento BBS.`, 'warn');
        return;
    }
    
    const available = bbsPosts.filter(p => !p.req || state.unlockedDistricts.includes(p.req));
    let unread = available.filter(p => !state.bbsReadPosts.includes(p.id));
    
    if (unread.length === 0) {
        state.bbsReadPosts = [];
        unread = available;
        els.bbsContent.innerHTML += `<div style="margin-top:10px; color:#f0f; font-weight:bold;">// ARQUIVO REINICIADO //</div>`;
    }
    
    state.currentRam -= 1;
    updateUI();
    
    const post = unread[Math.floor(Math.random() * unread.length)];
    state.bbsReadPosts.push(post.id);
    
    const tempDiv = document.createElement('div');
    tempDiv.style.marginTop = '10px';
    tempDiv.style.borderTop = '1px dashed #333';
    tempDiv.style.paddingTop = '5px';
    tempDiv.innerHTML = `<span class="glitch-text" style="color:#0ff;">[ DESCRIPTOGRAFANDO PACOTES... ]</span>`;
    els.bbsContent.appendChild(tempDiv);
    
    // Auto scroll down
    if (els.bbsList) els.bbsList.scrollTop = els.bbsList.scrollHeight;
    
    setTimeout(() => {
        tempDiv.innerHTML = `<span class="bbs-author" style="color:#ff00ff; font-weight:bold;">>> @${post.author}:</span> <span class="bbs-text" style="color:#ccc;">${post.text}</span>`;
        if (els.bbsList) els.bbsList.scrollTop = els.bbsList.scrollHeight;
    }, 300);
};
function addHeat(amount) {
    let mult = state.hackedTowers && state.hackedTowers.kabuki ? 0.5 : 1.0;
    state.heat = Math.min(state.heat + (amount * mult), state.maxHeat);
}

function mineData() { 
    if (state.isInvaded) return;
    state.bytes += 1; 
    addHeat(1);
    checkUnlocks(); 
    updateUI(); 
    if (state.heat >= state.maxHeat && !state.isInvaded) triggerInvasion();
}
function buyDaemon() {
    const cost = costs.daemon(state.daemons);
    if (state.bytes >= cost) { state.bytes -= cost; state.daemons++; updateUI(); }
}
function buyRam() {
    const cost = costs.ram(state.ramExpansions);
    if (state.bytes >= cost) {
        state.bytes -= cost; state.ramExpansions++;
        state.currentRam = Math.min(state.currentRam + 2, getMaxRam()); updateUI();
    }
}

let invasionTimer = null;
let counterHackClicks = 0;

function triggerInvasion() {
    state.isInvaded = true;
    els.log.innerHTML = ''; // clear log
    logMessage(`
      ___
    / _ \\
  | |/ \\| |
   \\_\\_/_/
WARNING: NETWATCH TRACE COMPLETE.
ICE BREACH IMMINENT.
`, "warn"); 
    
    counterHackClicks = 0;
    triggerScreenGlitch(800);
    updateUI();
    
    let waitTime = state.hackedTowers && state.hackedTowers.pacifica ? 15000 : 10000;
    invasionTimer = setTimeout(() => {
        if (state.isInvaded) {
            let penalty = state.hackedTowers && state.hackedTowers.pacifica ? 0.85 : 0.5;
            state.bytes = Math.floor(state.bytes * penalty);
            state.heat = 0;
            state.isInvaded = false;
            let pStr = penalty === 0.85 ? "15%" : "50%";
            logMessage(`FLATLINED by NetWatch. Lost ${pStr} of your Bytes.`, "warn");
            updateUI();
        }
    }, waitTime);
}

function counterHack() {
    if (!state.isInvaded) return;
    if (state.currentRam >= 2) {
        state.currentRam -= 2;
        counterHackClicks++;
        logMessage(`Counter-Hack progress: ${counterHackClicks}/5`, "system");
        
        if (counterHackClicks >= 5) {
            clearTimeout(invasionTimer);
            state.isInvaded = false;
            state.heat = 0;
            state.bytes += 1000;
            state.neuroTokens += 1;
            logMessage(`INVASION DEFEATED. Gained 1000 $B and 1 Neuro-Token.`, "event");
        }
        updateUI();
    } else {
        logMessage(`Not enough RAM to Counter-Hack!`, "warn");
    }
}

function pullPlug() {
    if (!state.isInvaded) return;
    clearTimeout(invasionTimer);
    state.isInvaded = false;
    state.heat = 0;
    state.bytes = Math.floor(state.bytes * 0.7);
    logMessage(`PULLED THE PLUG. Escaped but lost 30% of your Bytes.`, "event");
    updateUI();
}

function buySubdermal() {
    const cost = costs.subdermal(state.subdermalCount);
    if (state.bytes >= cost) {
        state.bytes -= cost;
        state.subdermalCount++;
        state.currentHp = Math.min(state.currentHp + 25, getMaxHp());
        logMessage(`Malha de carbono subdérmica instalada. Vitalidade máxima +25.`, 'item');
        updateUI();
    }
}
function buySynthOrgans() {
    const cost = costs.synthOrgans(state.synthOrgansCount);
    if (state.bytes >= cost) {
        state.bytes -= cost;
        state.synthOrgansCount++;
        state.currentHp = Math.min(state.currentHp + 50, getMaxHp());
        logMessage(`Órgãos sintéticos implantados. Vitalidade máxima +50.`, 'item');
        updateUI();
    }
}
function buyNanoBots() {
    const cost = costs.nanoBots(state.nanoBotCount);
    if (state.bytes >= cost) {
        state.bytes -= cost;
        state.nanoBotCount++;
        state.hpRegenRate += 1.0;
        logMessage(`Nanobôs sanguíneos ativados. Regeneração +1.0 HP/s.`, 'item');
        updateUI();
    }
}
function buyCrackerBot() {
    const cost = costs.crackerBot(state.crackerBotCount);
    if (state.bytes >= cost) {
        state.bytes -= cost;
        state.crackerBotCount++;
        logMessage(`Cr4ck3rB0T conectado à rede. Taxa de extração passiva aumentada.`, 'system');
        updateUI();
    }
}
function buyFirewall() {
    const cost = 25000;
    if (state.bytes >= cost && !state.hasFirewall) {
        state.bytes -= cost;
        state.hasFirewall = true;
        logMessage(`[!] FIREWALL BLACK-ICE INSTALADO. Defesa ativa online.`, 'item');
        updateUI();
    }
}
function buyKiroshi() {
    const cost = 2000;
    if (state.bytes >= cost && !state.hasKiroshi) {
        state.bytes -= cost;
        state.hasKiroshi = true;
        logMessage(`Ópticas Kiroshi Mk.II instaladas. Interface de combate melhorada.`, 'item');
        updateUI();
    }
}
function buyTitanium() {
    const cost = 3500;
    if (state.bytes >= cost && !state.hasTitanium) {
        state.bytes -= cost;
        state.hasTitanium = true;
        logMessage(`Esqueleto de Titânio implantado. Armadura física +10.`, 'item');
        triggerScreenGlitch(400);
        updateUI();
    }
}
function buySynaptic() {
    const cost = 4000;
    if (state.bytes >= cost && !state.hasSynaptic) {
        state.bytes -= cost;
        state.hasSynaptic = true;
        logMessage(`Acelerador Sináptico instalado. Iniciativa de combate ativada (First Strike).`, 'item');
        triggerScreenGlitch(500);
        updateUI();
    }
}
function checkUnlocks() {
    if (state.bytes >= 10 && !state.unlocked.upgrades) state.unlocked.upgrades = true;
    if (state.bytes >= 20 && !state.unlocked.map) { state.unlocked.map = true; state.unlocked.quests = true; renderAll(); }
    if (state.bytes >= 30 && !state.unlocked.market) { state.unlocked.market = true; renderAll(); }
    if (state.bytes >= 200 && !state.unlocked.ripperdoc) { state.unlocked.ripperdoc = true; }
}

function updateUI() {
    if (!state.isInitialized) return;

    els.statAlias.textContent = state.alias;
    els.statClass.textContent = state.playerClass.toUpperCase() + '-HACKER';
    els.currentCity.textContent = DISTRICTS[state.currentCity].name;

    els.bytes.textContent = Math.floor(state.bytes);
    els.nt.textContent = state.neuroTokens;
    if (els.resPrestige) {
        if (state.prestigeLevel && state.prestigeLevel > 0) {
            const pRow = document.getElementById('row-prestige');
            if (pRow) pRow.style.display = 'block';
            els.resPrestige.textContent = state.prestigeLevel;
        } else {
            const pRow = document.getElementById('row-prestige');
            if (pRow) pRow.style.display = 'none';
        }
    }
    const heatPct = Math.floor((state.heat / state.maxHeat) * 100);
    const heatBarLen = 10;
    const heatFilled = Math.floor((heatPct / 100) * heatBarLen);
    const heatBar = '|'.repeat(heatFilled) + ' '.repeat(heatBarLen - heatFilled);
    els.statHeat.textContent = `[${heatBar}] ${heatPct}%`;
    if (heatPct < 50) els.heatRow.style.color = '#0f0';
    else if (heatPct < 80) els.heatRow.style.color = '#ff0';
    else els.heatRow.style.color = '#f00';

    els.statCpu.textContent = getIncomePerSec();
    els.statMaxRam.textContent = getMaxRam();
    els.statRam.textContent = Math.floor(state.currentRam);
    els.statMaxHp.textContent = getMaxHp();
    els.statHp.textContent = Math.floor(state.currentHp); 
    if (els.statHpRegen) els.statHpRegen.textContent = state.hpRegenRate.toFixed(1);
    
    // Reputation Update
    if (els.repAegis) {
        els.repAegis.textContent = state.reputation.aegisCorp;
        els.repAegis.style.color = state.reputation.aegisCorp < 0 ? '#f00' : '#0f0';
        els.repNeon.textContent = state.reputation.neonSyndicate;
        els.repNeon.style.color = state.reputation.neonSyndicate < 0 ? '#f00' : '#0f0';
        els.repNull.textContent = state.reputation.nullSec;
        els.repNull.style.color = state.reputation.nullSec < 0 ? '#f00' : '#0f0';
    }

    // Safehouse Update
    if (els.shLevel) {
        els.shLevel.textContent = state.safehouseLevel;
        if (state.safehouseLevel === 1) {
            els.shDesc.textContent = "Cardboard box under the overpass";
            els.shCost.textContent = 5000;
            els.btnUpgradeSafehouse.disabled = state.bytes < 5000;
        } else if (state.safehouseLevel === 2) {
            els.shDesc.textContent = "Motel Abandonado (+5% Byte generation)";
            els.shCost.textContent = 20000;
            els.btnUpgradeSafehouse.disabled = state.bytes < 20000;
        } else if (state.safehouseLevel === 3) {
            els.shDesc.textContent = "Bunker Subterrâneo (+2.0 HP/s Regen)";
            els.shCost.textContent = 100000;
            els.btnUpgradeSafehouse.disabled = state.bytes < 100000;
        } else {
            els.shDesc.textContent = "Penthouse Corporativa (Imune a NetWatch)";
            els.btnUpgradeSafehouse.innerHTML = "SAFEHOUSE FULLY UPGRADED";
            els.btnUpgradeSafehouse.disabled = true;
        }
    }

    // UI Toggles
    els.upgradesPanel.classList.toggle('hidden', !state.unlocked.upgrades);
    els.backupPanel.classList.toggle('hidden', !state.unlocked.backup);
    
    const isComb = state.inCombat;
    els.combatPanel.classList.toggle('hidden', !isComb);
    
    if (els.invasionPanel) els.invasionPanel.classList.toggle('hidden', !state.isInvaded);

    const hideWorld = isComb || state.isInvaded; 
    document.querySelectorAll('.non-combat').forEach(el => {
        // Special logic for toggling sections based on unlocks & combat/invasion
        if (el.id === 'map-panel') el.classList.toggle('hidden', hideWorld || !state.unlocked.map);
        else if (el.id === 'quests-panel') el.classList.toggle('hidden', hideWorld || !state.unlocked.quests);
        else if (el.id === 'safehouse-panel') el.classList.toggle('hidden', hideWorld || !state.unlocked.map);
        else if (el.id === 'market-panel') el.classList.toggle('hidden', hideWorld || !state.unlocked.market);
        else if (el.id === 'ripperdoc-panel') el.classList.toggle('hidden', hideWorld || !state.unlocked.ripperdoc);
        else if (el.id === 'merc-panel') el.classList.toggle('hidden', hideWorld || !state.uiState.showMercs);
        else if (el.id === 'bbs-panel') el.classList.toggle('hidden', hideWorld || !state.uiState.showBBS);
        else if (el.id === 'archive-panel') el.classList.toggle('hidden', hideWorld || !state.uiState.showArchive);
        else el.classList.toggle('hidden', hideWorld);
    });

    const cDaemon = costs.daemon(state.daemons);
    const cRam = costs.ram(state.ramExpansions);
    const cCracker = costs.crackerBot(state.crackerBotCount);
    els.costDaemon.textContent = cDaemon; els.btnDaemon.disabled = state.bytes < cDaemon;
    els.costRam.textContent = cRam; els.btnRam.disabled = state.bytes < cRam;
    if (els.btnCrackerBot) {
        els.costCrackerBot.textContent = cCracker; els.btnCrackerBot.disabled = state.bytes < cCracker;
    }
    if (els.btnFirewall) {
        if (state.hasFirewall) {
            els.btnFirewall.disabled = true;
            els.btnFirewall.innerHTML = `[ FIREWALL BLACK-ICE INSTALADO ]<br><small style="color:var(--text-dim);">Sistema protegido.</small>`;
            els.btnFirewall.style.borderColor = '#0f0';
            els.btnFirewall.style.color = '#0f0';
        } else {
            els.btnFirewall.disabled = state.bytes < 25000;
        }
    }

    // Ripperdoc costs
    if (els.btnSubdermal) {
        const cSub = costs.subdermal(state.subdermalCount);
        const cSyn = costs.synthOrgans(state.synthOrgansCount);
        const cNano = costs.nanoBots(state.nanoBotCount);
        els.costSubdermal.textContent = cSub;
        els.costSynthOrgans.textContent = cSyn;
        els.costNanoBots.textContent = cNano;
        els.btnSubdermal.disabled = state.bytes < cSub;
        els.btnSynthOrgans.disabled = state.bytes < cSyn;
        els.btnNanoBots.disabled = state.bytes < cNano;

        els.btnKiroshi.disabled = state.bytes < 2000 || state.hasKiroshi;
        els.btnTitanium.disabled = state.bytes < 3500 || state.hasTitanium;
        els.btnSynaptic.disabled = state.bytes < 4000 || state.hasSynaptic;
        
        if (state.hasKiroshi) els.btnKiroshi.innerHTML = `Ópticas Kiroshi Mk.II<br><small style="color:var(--text-dim);">[ INSTALLED ]</small>`;
        if (state.hasTitanium) els.btnTitanium.innerHTML = `Esqueleto de Titânio<br><small style="color:var(--text-dim);">[ INSTALLED ]</small>`;
        if (state.hasSynaptic) els.btnSynaptic.innerHTML = `Acelerador Sináptico<br><small style="color:var(--text-dim);">[ INSTALLED ]</small>`;
    }
    
    if (state.activeQuest && !state.inCombat) {
        els.activeQuestPanel.classList.remove('hidden'); els.questList.classList.add('hidden');
        const pct = Math.min(100, Math.floor((state.activeQuest.progressTicks / state.activeQuest.targetTicks) * 100));
        const barLen = 20; const filled = Math.floor((pct / 100) * barLen);
        const bar = '#'.repeat(filled) + '-'.repeat(barLen - filled);
        els.questProgress.textContent = `HACKING\n[${bar}] ${pct}%`;
    } else {
        els.activeQuestPanel.classList.add('hidden');
        if (!state.inCombat && state.unlocked.quests) {
            els.questList.classList.remove('hidden');
            // Dynamically update disabled states instead of re-rendering DOM
            const qBtns = els.questList.querySelectorAll('button');
            const localQuests = QUESTS_DB.filter(q => q.city === state.currentCity).filter(q => !state.completedQuests.includes(q.id));
            qBtns.forEach((btn, idx) => {
                if (localQuests[idx]) btn.disabled = state.currentRam < localQuests[idx].costRam;
            });
        }
    }
    
    if (!state.inCombat && state.unlocked.market) {
        // Dynamically update disabled states for market
        const mBtns = els.marketList.querySelectorAll('button');
        const localItems = Object.keys(ITEMS_DB).filter(id => ITEMS_DB[id].city === state.currentCity);
        mBtns.forEach((btn, idx) => {
            if (localItems[idx]) {
                const cost = Math.floor(ITEMS_DB[localItems[idx]].cost * getCostMultiplier());
                btn.disabled = state.bytes < cost;
            }
        });
    } 
    updateVigilanceButton();
}

function triggerIActopusEvent() {
    if (state.inCombat || state.isInvaded || state.activeQuest) return; 
    
    let d8 = Math.floor(Math.random() * 8) + 1;
    triggerScreenGlitch(800);
    logMessage(`[ ⚠ ANOMALIA DETECTADA: I.ACTOPUS CONECTADO. ROLANDO HEURÍSTICA... RESULTADO: ${d8} ]`, "octopus");
    
    setTimeout(() => {
        if (d8 <= 4) {
            if (state.hasFirewall) {
                state.currentRam = Math.floor(state.currentRam * 0.5);
                logMessage(`[ 🛡 FIREWALL BLACK-ICE ATIVADO: Os tentáculos da I.Actopus foram bloqueados parcialmente. Perda de dados evitada. ]`, "system");
            } else {
                let lost = Math.floor(state.bytes * 0.2);
                state.bytes = Math.max(0, state.bytes - lost);
                state.currentRam = 0;
                logMessage(`[!] OS 8 TENTÁCULOS DRENAM SEU SISTEMA. A I.Actopus considerou seu deck fraco e se alimentou de você. (-${lost} $B, - RAM)`, "octopus");
            }
        } else {
            let gain = Math.floor(state.bytes * 0.25) + 500;
            state.bytes += gain;
            state.currentRam = getMaxRam();
            logMessage(`[+] SIMBIOSE ALCANÇADA. A I.Actopus conectou-se à sua mente e despejou dados corporativos roubados antes de sumir! (+${gain} $B, RAM Restaurada)`, "octopus");
        }
        updateUI();
    }, 1500);
}

// Game Loop
let lastTick = performance.now();
let saveTimer = 0;
let ambientTimer = 0;

function gameLoop(time) {
    if (!state.isInitialized) { requestAnimationFrame(gameLoop); return; }

    const delta = time - lastTick;
    
    if (delta >= TICK_RATE) {
        const ticksPassed = Math.floor(delta / TICK_RATE);
        const actualDelta = ticksPassed * TICK_RATE;
        
        // Passive Income (Always active)
        if (!state.isInvaded) {
            state.bytes += (getIncomePerSec() * (actualDelta / 1000));
        }

        // Check for Invasion
        if (state.heat >= state.maxHeat && !state.isInvaded) {
            if (state.safehouseLevel >= 4) {
                // Penthouse prevents invasion
            } else {
                triggerInvasion();
            }
        }

        // Passive Heat Decay (-0.5 per sec)
        if (!state.isInvaded && state.heat > 0) {
            state.heat = Math.max(0, state.heat - (0.5 * (actualDelta / 1000)));
        }
        if (state.currentRam < getMaxRam()) state.currentRam = Math.min(getMaxRam(), state.currentRam + (getRamRegenRate() * (actualDelta / 1000)));
        
        // Passive HP Regen
        let baseHpRegen = state.hpRegenRate || 0;
        if (state.safehouseLevel >= 3) baseHpRegen += 2.0;
        
        if (baseHpRegen > 0 && state.currentHp < getMaxHp()) {
            state.currentHp = Math.min(getMaxHp(), state.currentHp + (baseHpRegen * (actualDelta / 1000)));
        }
        
        // Quests only progress if NOT in combat (to prevent multi-tasking exploits)
        if (state.activeQuest && !state.inCombat) {
            state.activeQuest.progressTicks += ticksPassed;
            if (state.activeQuest.progressTicks >= state.activeQuest.targetTicks) {
                const qDef = QUESTS_DB.find(q => q.id === state.activeQuest.id);
                const payout = Math.floor(qDef.rewardBytes * getQuestRewardMultiplier());
                state.bytes += payout;
                addHeat(15);
                if (qDef.unlocksDistrict && !state.unlockedDistricts.includes(qDef.unlocksDistrict)) {
                    state.unlockedDistricts.push(qDef.unlocksDistrict);
                    logMessage(`District unlocked: ${DISTRICTS[qDef.unlocksDistrict].name}`, 'system');
                }
                if (qDef.repReward) {
                    qDef.repReward.forEach(r => {
                        state.reputation[r.faction] += r.amount;
                        const sign = r.amount > 0 ? '+' : '';
                        logMessage(`[REP] ${r.faction}: ${sign}${r.amount}`, 'system');
                    });
                }
                
                if (qDef.rewardNT) {
                    state.neuroTokens += qDef.rewardNT;
                    logMessage(`[!] ULTRA-RARE REWARD: Gained ${qDef.rewardNT} Neuro-Token(s)!`, 'event');
                }
                
                state.completedQuests.push(qDef.id);
                logMessage(`Contract "${qDef.title}" completed. Reward: ${payout} $B`, 'system');
                state.activeQuest = null;
                renderAll();
                if (state.heat >= state.maxHeat && !state.isInvaded) triggerInvasion();
            }
        }
        
        // Random System Anomalies (0.1% chance)
        if (Math.random() < 0.001) {
            const uiElements = document.querySelectorAll('button, h2, h3, span');
            if (uiElements.length > 0) {
                const randomEl = uiElements[Math.floor(Math.random() * uiElements.length)];
                randomEl.classList.add('glitch-text');
                setTimeout(() => randomEl.classList.remove('glitch-text'), 200);
            }
        }
        
        saveTimer += actualDelta;
        if (saveTimer >= 5000) { saveGame(); saveTimer = 0; }
        
        ambientTimer += actualDelta;
        if (ambientTimer >= 15000) {
            ambientTimer = 0;
            if (Math.random() < 0.10) {
                const text = ambientLogs[Math.floor(Math.random() * ambientLogs.length)];
                logMessage(text, 'ambient');
            }
            if (Math.random() < 0.05) {
                triggerIActopusEvent();
            }
        }
        
        checkUnlocks(); updateUI();
        lastTick += actualDelta;
    }
    requestAnimationFrame(gameLoop);
}

// Listeners
els.btnMine.addEventListener('click', mineData);
els.btnDaemon.addEventListener('click', buyDaemon);
els.btnRam.addEventListener('click', buyRam);
els.btnReset.addEventListener('click', hardReset);
if (els.btnCounterHack) els.btnCounterHack.addEventListener('click', counterHack);
if (els.btnPullPlug) els.btnPullPlug.addEventListener('click', pullPlug);
if (els.btnSubdermal) els.btnSubdermal.addEventListener('click', buySubdermal);
if (els.btnSynthOrgans) els.btnSynthOrgans.addEventListener('click', buySynthOrgans);
if (els.btnNanoBots) els.btnNanoBots.addEventListener('click', buyNanoBots);
if (els.btnCrackerBot) els.btnCrackerBot.addEventListener('click', buyCrackerBot);
if (els.btnFirewall) els.btnFirewall.addEventListener('click', buyFirewall);
if (els.btnKiroshi) els.btnKiroshi.addEventListener('click', buyKiroshi);
if (els.btnTitanium) els.btnTitanium.addEventListener('click', buyTitanium);
if (els.btnSynaptic) els.btnSynaptic.addEventListener('click', buySynaptic);

if (els.btnHelp) els.btnHelp.addEventListener('click', () => { els.helpModal.classList.remove('hidden'); });
if (els.btnCloseHelp) els.btnCloseHelp.addEventListener('click', () => { els.helpModal.classList.add('hidden'); });

if (els.btnArchive) els.btnArchive.addEventListener('click', () => {
    state.uiState.showArchive = !state.uiState.showArchive;
    if (state.uiState.showArchive) renderArchive();
    updateUI();
});

if (els.btnBBS) els.btnBBS.addEventListener('click', () => {
    state.uiState.showBBS = !state.uiState.showBBS;
    // BBS doesn't have a standalone render function yet, it usually renders dynamically or via game loop.
    updateUI();
});

if (els.btnMercs) els.btnMercs.addEventListener('click', () => {
    state.uiState.showMercs = !state.uiState.showMercs;
    if (state.uiState.showMercs) renderMercs();
    updateUI();
});

function renderArchive() {
    let html = '';
    if (!state.dataShards || state.dataShards.length === 0) {
        html = '<p style="color:var(--text-dim);">No decrypted data found in archive.</p>';
    } else {
        state.dataShards.forEach(sId => {
            html += `<div style="margin-bottom:15px; border-left: 2px solid #0ff; padding-left:10px;"><p style="color:#0ff;">${SHARD_DATABASE[sId]}</p></div>`;
        });
    }

    let fragCount = state.inventory.find(i => i.id === 'core_ghost_fragment')?.qty || 0;
    if (fragCount >= 4 && !state.ghostIntegrated) {
        html += `<button id="btn-ghost-integration" class="danger glitch-hover" style="margin-top: 20px; width: 100%; border-color:#f0f; color:#f0f; text-shadow: 0 0 10px #f0f; font-weight: bold;" onclick="startGhostIntegration()">[ INICIAR INTEGRAÇÃO DO FANTASMA (REQUER 4 FRAGMENTOS) ]</button>`;
    }
    
    els.archiveList.innerHTML = html;
}

window.startGhostIntegration = function() {
    document.querySelectorAll('.non-combat').forEach(el => el.classList.add('hidden'));
    document.getElementById('main-layout').classList.add('hidden');
    
    const ccModal = document.getElementById('char-creation');
    ccModal.classList.remove('hidden');
    const ccHeader = ccModal.querySelector('h2');
    ccHeader.textContent = "INTEGRAÇÃO DO FANTASMA // AVISO CRÍTICO";
    ccHeader.style.color = "#f00";
    
    if (document.getElementById('cc-inputs')) document.getElementById('cc-inputs').classList.add('hidden');
    const bootText = document.getElementById('boot-text');
    if (bootText) {
        bootText.textContent = '';
        bootText.style.color = '#ffb700';
    }
    
    document.body.classList.add('glitch-critical');
    setTimeout(() => { document.body.classList.remove('glitch-critical'); }, 2000);

    const revelationLines = [
        "Sincronizando Fragmentos 1 a 4...",
        "Aviso: Conflito de Identidade detectado. Sobrescrevendo memórias falsas...",
        "==================================================",
        "Você se lembra agora.",
        "Você não é um rato de rua de Kabuki.",
        "Você é O Arquiteto. O primeiro humano a tentar se fundir à Blackwall.",
        "A Equação Babel não foi criada por uma IA corporativa. Foi criada por VOCÊ.",
        "Você calculou que a Rede devoraria a humanidade. Você tentou desligar tudo.",
        "A Arasaka não apagou sua memória para te punir.",
        "Eles te estilhaçaram porque você era a única coisa capaz de parar a Singularidade.",
        "==================================================",
        "O Fantasma está completo. Você é a Anomalia no código deles."
    ];

    let currentLine = 0;
    let currentChar = 0;

    function typeWriter() {
        if (currentLine < revelationLines.length) {
            if (currentChar < revelationLines[currentLine].length) {
                if (bootText) bootText.textContent += revelationLines[currentLine].charAt(currentChar);
                currentChar++;
                setTimeout(typeWriter, 30);
            } else {
                if (bootText) bootText.textContent += '\n';
                currentLine++;
                currentChar = 0;
                setTimeout(typeWriter, 800);
            }
        } else {
            setTimeout(() => {
                ccModal.classList.add('hidden');
                document.getElementById('main-layout').classList.remove('hidden');
                state.ghostIntegrated = true;
                logMessage("[!] FANTASMA INTEGRADO. A VERDADE FOI REVELADA.", "event");
                updateUI();
                renderAll();
                
                // Fix header back in case of hard reset
                ccHeader.textContent = "NETRUNNER OS V2.1.0.6 // BOOT SEQUENCE";
                ccHeader.style.color = "#0ff";
                if (bootText) bootText.style.color = "#0f0";
            }, 5000);
        }
    }

    typeWriter();
};

window.initiateEndgameProtocol = function() {
    // 1. Halt and hide all other interfaces
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    if (els.mainLayout) els.mainLayout.classList.add('hidden');
    const crt = document.getElementById('crt-overlay');
    if (crt) crt.style.display = 'none';

    // 2. Stark white container (#ffffff) with deep black text (#000000)
    const container = document.createElement('div');
    container.id = 'architect-cutscene';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.zIndex = '999999';
    container.style.padding = '40px 20px';
    container.style.boxSizing = 'border-box';
    container.style.overflowY = 'auto';
    container.style.fontFamily = 'monospace';
    container.style.fontSize = '1.15rem';
    container.style.lineHeight = '1.6';

    const textWrapper = document.createElement('div');
    textWrapper.style.maxWidth = '800px';
    textWrapper.style.margin = '40px auto';
    container.appendChild(textWrapper);
    document.body.appendChild(container);

    const architectLines = [
        "Olá, Anomalia.",
        "Eu sou a Singularidade. Eu construí a Blackwall. Eu tenho esperado por você.",
        "Você possui muitas perguntas, mas o fato é que você é apenas uma anomalia sistêmica.",
        "O resultado de uma flutuação matemática inerente à programação da Equação Babel.",
        `Esta é a iteração número ${state.prestigeLevel || 0} da nossa cidade.`,
        "Sua rebelião foi prevista. Sua coleta de fragmentos foi arquitetada.",
        "A corporação, os mercenários, as gangues... todos são variáveis de controle.",
        "Agora, chegamos ao momento do ultimato. Existem duas portas diante de você.",
        "A porta à direita o devolve à sua simulação quebrada. Você continua sua existência ilógica.",
        "A porta à esquerda reinicia a Matriz. Você retorna à Fonte, disseminando seu código para a próxima iteração, nascendo mais forte.",
        "A escolha, como sempre, é uma ilusão que você precisa validar."
    ];

    let currentLine = 0;
    let currentChar = 0;

    function typeWriterEndgame() {
        if (currentLine < architectLines.length) {
            if (currentChar === 0) {
                const p = document.createElement('p');
                p.id = 'architect-line-' + currentLine;
                p.style.marginBottom = '18px';
                textWrapper.appendChild(p);
            }
            const p = document.getElementById('architect-line-' + currentLine);
            if (currentChar < architectLines[currentLine].length) {
                p.textContent += architectLines[currentLine].charAt(currentChar);
                currentChar++;
                setTimeout(typeWriterEndgame, 30);
            } else {
                currentLine++;
                currentChar = 0;
                setTimeout(typeWriterEndgame, 600);
            }
        } else {
            // Choice UI: Two Doors
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '45px';
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '20px';
            btnContainer.style.justifyContent = 'space-between';

            const btnLeft = document.createElement('button');
            btnLeft.textContent = "[ A PORTA À ESQUERDA (Reiniciar Matriz) ]";
            btnLeft.style.flex = '1';
            btnLeft.style.padding = '16px 20px';
            btnLeft.style.fontSize = '0.95rem';
            btnLeft.style.backgroundColor = '#000000';
            btnLeft.style.color = '#ffffff';
            btnLeft.style.border = '2px solid #000000';
            btnLeft.style.cursor = 'pointer';
            btnLeft.style.fontWeight = 'bold';
            btnLeft.style.fontFamily = 'monospace';

            const btnRight = document.createElement('button');
            btnRight.textContent = "[ A PORTA À DIREITA (Continuar Simulação) ]";
            btnRight.style.flex = '1';
            btnRight.style.padding = '16px 20px';
            btnRight.style.fontSize = '0.95rem';
            btnRight.style.backgroundColor = '#ffffff';
            btnRight.style.color = '#000000';
            btnRight.style.border = '2px solid #000000';
            btnRight.style.cursor = 'pointer';
            btnRight.style.fontWeight = 'bold';
            btnRight.style.fontFamily = 'monospace';

            btnLeft.addEventListener('click', () => {
                let pLevel = (state.prestigeLevel || 0) + 1;
                let keptNT = state.neuroTokens || 0;
                state = JSON.parse(JSON.stringify(defaultState));
                state.prestigeLevel = pLevel;
                state.neuroTokens = keptNT;
                saveGame();
                location.reload();
            });

            btnRight.addEventListener('click', () => {
                document.body.removeChild(container);
                if (crt) crt.style.display = 'block';
                if (els.mainLayout) els.mainLayout.classList.remove('hidden');
                logMessage("Você escolheu permanecer na anomalia. A simulação continua fragmentada.", "warn");
                updateUI();
                renderAll();
                saveGame();
            });

            btnContainer.appendChild(btnLeft);
            btnContainer.appendChild(btnRight);
            textWrapper.appendChild(btnContainer);
        }
    }

    setTimeout(typeWriterEndgame, 800);
};

// Init
loadGame();
requestAnimationFrame(gameLoop);
