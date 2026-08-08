const STORAGE_KEY = "rybalka.save.v1";
const DAY_LENGTH = 7 * 60 * 1000;
const DEPTHS = ["Мілко", "Глибоко", "Дно"];
const RARITY_ORDER = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
const RARITY_LABEL = {
  common: "звичайна",
  uncommon: "незвичайна",
  rare: "рідкісна",
  epic: "епічна",
  legendary: "легендарна"
};

const WEATHER = {
  sunny: { name: "☀ Сонячно", bite: 1, desc: "рівний кльов" },
  rain: { name: "☔ Дощ", bite: 0.68, desc: "швидший кльов" },
  heat: { name: "♨ Спека", bite: 1.38, desc: "повільніший кльов" }
};

const RODS = [
  { id: "bamboo", name: "Бамбукова вудка", cost: 0, level: 1, bite: 1.08, rare: 1, maxDepth: 0, strength: 0.88, desc: "Легка стартова вудка для мілководдя." },
  { id: "classic", name: "Звичайна вудка", cost: 240, level: 2, bite: 0.96, rare: 1.08, maxDepth: 1, strength: 1, desc: "Дає змогу ловити на глибині." },
  { id: "carbon", name: "Карбонова вудка", cost: 780, level: 5, bite: 0.84, rare: 1.22, maxDepth: 2, strength: 1.22, desc: "Міцна лінія для важкої риби біля дна." },
  { id: "magic", name: "Магічна вудка", cost: 1900, level: 9, bite: 0.72, rare: 1.48, maxDepth: 2, strength: 1.48, desc: "Світиться, коли поруч легенди озера." }
];

const BAITS = [
  { id: "worm", icon: "🪱", name: "Черв'як", cost: 12, amount: 8, desc: "Універсальна наживка.", tags: { common: 1.18, bottom: 1.06 } },
  { id: "maggot", icon: "•", name: "Опариш", cost: 18, amount: 7, desc: "Люблять малі й обережні риби.", tags: { small: 1.35, common: 1.12 } },
  { id: "corn", icon: "🌽", name: "Кукурудза", cost: 26, amount: 6, desc: "Сильніше приваблює коропових.", tags: { carp: 1.75 } },
  { id: "bread", icon: "▣", name: "Хліб", cost: 16, amount: 7, desc: "Добре працює біля берега.", tags: { shallow: 1.35, peaceful: 1.12 } },
  { id: "minnow", icon: "🐟", name: "Малявка", cost: 42, amount: 4, desc: "Приваблює хижаків.", tags: { predator: 1.85, rare: 1.08 } },
  { id: "magic", icon: "✦", name: "Магічна", cost: 95, amount: 2, desc: "Підсилює шанс на дивовижну рибу.", tags: { rare: 1.35, epic: 1.55, legendary: 2.15 } }
];

const ENCHANTS = [
  { id: "luck", name: "Чари удачі", cost: 520, level: 4, desc: "+25% до рідкісної, епічної та легендарної риби." },
  { id: "speed", name: "Чари швидкості", cost: 430, level: 3, desc: "Риба клює приблизно на 15% швидше." },
  { id: "steady", name: "Чари міцної лінії", cost: 680, level: 6, desc: "Легше втримати натяг під час вивуджування." }
];

const LOCATIONS = [
  { id: "lake", name: "Лісове озеро", level: 1, cost: 0, water: "#38a7bd", land: "#79b24a", desc: "Збалансована стартова водойма.", tags: { common: 1.08, shallow: 1.08 } },
  { id: "marsh", name: "Тихе болото", level: 3, cost: 320, water: "#3e937e", land: "#6a9c3d", desc: "Тут активні сом, вугор і лин.", tags: { bottom: 1.35, heat: 1.12 } },
  { id: "river", name: "Гірська річка", level: 5, cost: 680, water: "#58b7d8", land: "#5f9b58", desc: "Прохолодна вода для форелі та судака.", tags: { predator: 1.2, rare: 1.12 } },
  { id: "moonbay", name: "Місячна бухта", level: 8, cost: 1400, water: "#5362a8", land: "#6d748f", desc: "Нічна локація для примарних трофеїв.", tags: { legendary: 1.38, epic: 1.18, night: 1.2 } }
];

const QUESTS = [
  { id: "first_bucket", name: "Перший кошик", desc: "Спіймай 5 будь-яких риб.", target: 5, type: "catch", reward: { coins: 80, xp: 70, bait: { worm: 8 } } },
  { id: "carp_dinner", name: "Вечеря для кухаря", desc: "Спіймай 3 коропові риби.", target: 3, type: "tag", tag: "carp", reward: { coins: 140, xp: 90, resources: { scale: 3 } } },
  { id: "rain_hunter", name: "Дощовий мисливець", desc: "Спіймай 4 риби під час дощу.", target: 4, type: "weather", weather: "rain", reward: { coins: 160, xp: 110, bait: { minnow: 3 } } },
  { id: "night_watch", name: "Нічна варта", desc: "Спіймай 2 нічні риби.", target: 2, type: "time", time: "night", reward: { coins: 190, xp: 140, bait: { magic: 1 } } },
  { id: "legend_whisper", name: "Шепіт легенди", desc: "Спіймай 1 епічну або легендарну рибу.", target: 1, type: "rarity", rarity: 4, reward: { coins: 360, xp: 260, resources: { pearl: 2 } } }
];

const CRAFTS = [
  { id: "magic_bait_bundle", name: "Магічна наживка x3", desc: "Для полювання на легенди.", cost: { scale: 4, algae: 2, pearl: 1 }, gain: { bait: { magic: 3 } } },
  { id: "minnow_bundle", name: "Жива малявка x6", desc: "Хижаки клюють сміливіше.", cost: { algae: 3, shell: 1 }, gain: { bait: { minnow: 6 } } },
  { id: "lucky_token", name: "Талісман удачі", desc: "Постійно дає +8% до рідкісного кльову.", cost: { scale: 8, pearl: 2, driftwood: 3 }, gain: { item: "lucky_token" } },
  { id: "deep_anchor", name: "Донний якір", desc: "Покращує шанси придонної риби.", cost: { shell: 4, driftwood: 4 }, gain: { item: "deep_anchor" } }
];

const EVENTS = [
  { id: "none", name: "Спокійний день", desc: "Озеро живе звичайним ритмом.", duration: 90000, tags: {} },
  { id: "starfall", name: "Ніч падаючих зірок", desc: "Епічна й легендарна риба активніша.", duration: 70000, tags: { epic: 1.45, legendary: 1.75, night: 1.25 } },
  { id: "big_rain", name: "Великий дощ", desc: "Кльов швидший, донна риба сміливіша.", duration: 65000, tags: { bottom: 1.35, rare: 1.18 } },
  { id: "fog_morning", name: "Туманний ранок", desc: "Ранкові риби підходять ближче.", duration: 60000, tags: { dawn: 1.4, shallow: 1.18 } },
  { id: "fisher_fair", name: "Свято рибалки", desc: "Продаж риби дорожчий.", duration: 80000, tags: { market: 1.25 } }
];

const ACHIEVEMENTS = [
  { id: "first_fish", name: "Перша риба", desc: "Спіймай першу рибу.", test: () => game.stats.totalCaught >= 1, reward: { coins: 35, xp: 25 } },
  { id: "collector_10", name: "Колекціонер", desc: "Відкрий 10 видів у Fish Dex.", test: () => caughtSpeciesCount() >= 10, reward: { coins: 160, xp: 120 } },
  { id: "night_hunter", name: "Нічний мисливець", desc: "Спіймай 5 риб уночі.", test: () => game.stats.nightCaught >= 5, reward: { coins: 180, bait: { magic: 1 } } },
  { id: "legend_catcher", name: "Легенда озера", desc: "Спіймай легендарну рибу.", test: () => game.stats.legendaryCaught >= 1, reward: { coins: 520, xp: 350 } },
  { id: "hundred_kg", name: "100 кг улову", desc: "Загальна вага вилову 100 кг.", test: () => game.stats.totalWeight >= 100, reward: { coins: 260, resources: { pearl: 1 } } },
  { id: "quester", name: "Помічник берега", desc: "Заверши 3 квести.", test: () => game.stats.questsDone >= 3, reward: { coins: 300, xp: 220 } },
  { id: "crafter", name: "Майстер снастей", desc: "Скрафти 3 предмети.", test: () => game.stats.crafted >= 3, reward: { coins: 220, resources: { scale: 4 } } },
  { id: "aquarist", name: "Акваріуміст", desc: "Посели 5 риб в акваріум.", test: () => game.aquarium.length >= 5, reward: { coins: 240, xp: 180 } }
];

const RESOURCE_LABELS = {
  scale: "Луска",
  algae: "Водорості",
  pearl: "Перлина",
  shell: "Мушля",
  driftwood: "Корч"
};

const FISH = [
  { id: "perch", name: "Окунь", icon: "🐠", rarity: "common", base: 15, min: 0.2, max: 1.6, depths: [0, 1], times: ["day", "dawn"], weather: ["sunny", "rain"], tags: ["small", "predator", "shallow"], color: "#79c35a", accent: "#253d27", desc: "Смугастий забіяка, часто ганяє дрібну рибу біля очерету." },
  { id: "crucian", name: "Карась", icon: "🐡", rarity: "common", base: 14, min: 0.25, max: 2.1, depths: [0], times: ["day", "dusk"], weather: ["sunny", "heat"], tags: ["small", "carp", "peaceful", "shallow"], color: "#d9b35f", accent: "#9d6f2d", desc: "Неспішний мешканець мілководдя, любить хліб і тишу." },
  { id: "roach", name: "Плітка", icon: "◇", rarity: "common", base: 12, min: 0.1, max: 0.9, depths: [0], times: ["day", "dawn"], weather: ["rain", "sunny"], tags: ["small", "peaceful", "shallow"], color: "#c9d5d7", accent: "#e96767", desc: "Жвава срібляста рибка, що збирається зграями під берегом." },
  { id: "bream", name: "Лящ", icon: "◒", rarity: "uncommon", base: 8.5, min: 0.8, max: 4.2, depths: [1, 2], times: ["dawn", "dusk", "night"], weather: ["rain"], tags: ["peaceful", "bottom"], color: "#b6a476", accent: "#615331", desc: "Широкий і сильний, найчастіше годується на сутінковій глибині." },
  { id: "pike", name: "Щука", icon: "▶", rarity: "uncommon", base: 7.5, min: 1.2, max: 8.5, depths: [0, 1], times: ["dawn", "day"], weather: ["rain"], tags: ["predator", "rare"], color: "#638c52", accent: "#dce779", desc: "Засадний хижак із блискавичним ривком." },
  { id: "carp", name: "Короп", icon: "●", rarity: "uncommon", base: 7, min: 1.1, max: 9.2, depths: [1], times: ["day", "dusk"], weather: ["heat", "sunny"], tags: ["carp", "peaceful"], color: "#c89045", accent: "#ffe2a1", desc: "Важкий трофей, особливо прихильний до кукурудзи." },
  { id: "trout", name: "Форель", icon: "◆", rarity: "rare", base: 4.1, min: 0.5, max: 3.6, depths: [1], times: ["dawn", "day"], weather: ["rain"], tags: ["predator", "rare"], color: "#84bfc7", accent: "#ff7b74", desc: "Стрімка риба чистої прохолодної води." },
  { id: "catfish", name: "Сом", icon: "≈", rarity: "rare", base: 3.8, min: 4, max: 32, depths: [2], times: ["night"], weather: ["heat", "rain"], tags: ["predator", "bottom", "rare"], color: "#5c6570", accent: "#e8d1a4", desc: "Нічний велетень дна, тягне так, ніби озеро саме вперлося в лінію." },
  { id: "eel", name: "Вугор", icon: "∿", rarity: "rare", base: 3.4, min: 0.6, max: 5.5, depths: [2], times: ["night"], weather: ["rain"], tags: ["predator", "bottom", "rare"], color: "#2f4a3f", accent: "#9fcb81", desc: "Ковзкий нічний мандрівник, клює обережно й нервово." },
  { id: "tench", name: "Лин", icon: "⬟", rarity: "uncommon", base: 6.5, min: 0.7, max: 4.8, depths: [0, 1], times: ["dawn", "dusk"], weather: ["heat"], tags: ["peaceful", "shallow"], color: "#75964f", accent: "#d5cf79", desc: "Тихий болотяний красень, полюбляє теплу воду." },
  { id: "zander", name: "Судак", icon: "▸", rarity: "rare", base: 3.2, min: 1, max: 7.8, depths: [1, 2], times: ["dusk", "night"], weather: ["rain"], tags: ["predator", "rare"], color: "#9eb1a1", accent: "#313f36", desc: "Полює в сутінках, тримаючись бровок і глибших ям." },
  { id: "silver", name: "Срібний амур", icon: "◈", rarity: "rare", base: 2.7, min: 2, max: 16, depths: [1], times: ["day"], weather: ["sunny", "heat"], tags: ["carp", "peaceful", "rare"], color: "#d2e4e8", accent: "#8aa8b0", desc: "Сяє на сонці й бореться довго, але чесно." },
  { id: "sturgeon", name: "Осетер", icon: "⬢", rarity: "epic", base: 1.4, min: 3, max: 24, depths: [2], times: ["night", "dawn"], weather: ["rain"], tags: ["bottom", "rare", "epic"], color: "#7f8792", accent: "#d9d0b6", desc: "Давній мешканець придонних холодних вод." },
  { id: "goldfish", name: "Золота рибка", icon: "✹", rarity: "epic", base: 1.15, min: 0.05, max: 0.45, depths: [0], times: ["dawn", "dusk"], weather: ["sunny"], tags: ["small", "peaceful", "rare", "epic", "shallow"], color: "#ffbf32", accent: "#fff0a5", desc: "Крихітний промінь удачі, який не любить поспіху." },
  { id: "crystal", name: "Кристальна форель", icon: "✧", rarity: "epic", base: 0.95, min: 0.4, max: 2.2, depths: [1], times: ["night"], weather: ["rain"], tags: ["predator", "rare", "epic"], color: "#b8f2ff", accent: "#9d7cff", desc: "Напівпрозора риба, що відбиває зоряне світло." },
  { id: "ember", name: "Жар-карась", icon: "✺", rarity: "epic", base: 0.9, min: 0.3, max: 1.8, depths: [0, 1], times: ["day", "dusk"], weather: ["heat"], tags: ["carp", "peaceful", "rare", "epic"], color: "#ff7448", accent: "#ffd16a", desc: "З'являється, коли вода парує від спеки." },
  { id: "ghostpike", name: "Примарна щука", icon: "☾", rarity: "legendary", base: 0.32, min: 2, max: 12, depths: [1, 2], times: ["night"], weather: ["rain"], tags: ["predator", "rare", "legendary"], color: "#d8f5ff", accent: "#93a1ff", desc: "Ледь видима тінь у місячній воді, що атакує без сплеску." },
  { id: "moon_eel", name: "Місячний вугор", icon: "☽", rarity: "legendary", base: 0.25, min: 1, max: 7, depths: [2], times: ["night"], weather: ["sunny", "rain"], tags: ["predator", "bottom", "rare", "legendary"], color: "#5362a8", accent: "#fff3b0", desc: "Клює тоді, коли місяць високо над озером." },
  { id: "king", name: "Король озера", icon: "♛", rarity: "legendary", base: 0.18, min: 18, max: 58, depths: [2], times: ["dawn", "night"], weather: ["rain"], tags: ["bottom", "predator", "rare", "legendary"], color: "#2d5067", accent: "#ffd86f", desc: "Головний трофей озера. Кажуть, він пам'ятає всіх рибалок." },
  { id: "sunscale", name: "Сонцелуска", icon: "☀", rarity: "legendary", base: 0.22, min: 0.7, max: 3.3, depths: [0], times: ["day"], weather: ["heat", "sunny"], tags: ["peaceful", "rare", "legendary", "shallow"], color: "#ffe052", accent: "#ff7b2e", desc: "Легендарна риба мілководдя, що сяє у найяскравіший день." }
];

const els = {};
let canvas;
let ctx;
let dpr = 1;
let view = { w: 1280, h: 720 };
let lastFrame = performance.now();
let lastSave = performance.now();
let pointer = { x: 0.5, y: 0.5 };
let game;
let runtime;

const defaultGame = () => ({
  level: 1,
  xp: 0,
  coins: 75,
  rod: 0,
  ownedRods: ["bamboo"],
  inventory: [],
  capacity: 24,
  bait: BAITS.reduce((acc, bait) => {
    acc[bait.id] = bait.id === "worm" ? 18 : bait.id === "magic" ? 1 : 5;
    return acc;
  }, {}),
  selectedBait: "worm",
  enchants: {},
  dex: {},
  dayProgress: 0.28,
  weather: "sunny",
  nextWeatherIn: 90000,
  selectedDepth: 0,
  shopTab: "rods",
  location: "lake",
  unlockedLocations: ["lake"],
  resources: { scale: 0, algae: 0, pearl: 0, shell: 0, driftwood: 0 },
  craftedItems: {},
  aquarium: [],
  aquariumLastCollect: Date.now(),
  quests: QUESTS.reduce((acc, quest) => {
    acc[quest.id] = { progress: 0, done: false, claimed: false };
    return acc;
  }, {}),
  achievements: {},
  marketDay: 0,
  market: { fishId: "perch", multiplier: 1.25 },
  activeEvent: "none",
  nextEventIn: 50000,
  eventTimeLeft: 90000,
  stats: {
    totalCaught: 0,
    totalSold: 0,
    totalWeight: 0,
    nightCaught: 0,
    legendaryCaught: 0,
    questsDone: 0,
    crafted: 0
  },
  sound: true
});

function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  [
    "levelValue", "xpFill", "xpText", "coinValue", "weatherValue", "timeValue", "depthValue",
    "baitChoices", "messageLog", "hint", "bitePrompt", "reelPanel", "tensionNeedle",
    "holdReelButton", "inventoryButton", "dexButton", "saveButton", "castButton", "depthButton",
    "shopButton", "enchantButton", "sleepButton", "inventoryModal", "dexModal", "shopModal",
    "enchantModal", "sleepModal", "inventorySort", "inventoryList", "inventoryCapacity",
    "sellAllButton", "dexProgress", "dexList", "dexRarityFilter", "dexStatusFilter", "shopList",
    "enchantList", "questsButton", "mapButton", "trophyButton", "aquariumButton", "craftButton",
    "achievementsButton", "questsModal", "trophyModal", "mapModal", "aquariumModal", "craftModal",
    "achievementsModal", "questsList", "trophyList", "locationList", "aquariumList", "craftList",
    "achievementsList", "toastLayer", "resourceBar", "aquariumBonus", "collectAquariumButton"
  ].forEach(id => els[id] = document.getElementById(id));

  game = loadGame();
  runtime = {
    phase: "idle",
    cast: null,
    biteAt: 0,
    hookDeadline: 0,
    biteFish: null,
    tension: 50,
    reelProgress: 0,
    holding: false,
    weatherClock: game.nextWeatherIn || 90000,
    eventClock: game.nextEventIn || 50000,
    eventTimeLeft: game.eventTimeLeft || 90000,
    particles: [],
    ripples: [],
    fishShadows: Array.from({ length: 18 }, () => ({
      x: Math.random(),
      y: 0.55 + Math.random() * 0.34,
      speed: 0.014 + Math.random() * 0.025,
      size: 0.5 + Math.random() * 1.2,
      sway: Math.random() * 10
    }))
  };

  bindEvents();
  resizeCanvas();
  renderBaits();
  updateUI();
  updateHint();
  requestAnimationFrame(loop);
}

function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultGame();
    const parsed = JSON.parse(raw);
    const fresh = defaultGame();
    const merged = { ...fresh, ...parsed };
    merged.bait = { ...fresh.bait, ...(parsed.bait || {}) };
    merged.enchants = { ...(parsed.enchants || {}) };
    merged.dex = { ...(parsed.dex || {}) };
    merged.resources = { ...fresh.resources, ...(parsed.resources || {}) };
    merged.craftedItems = { ...(parsed.craftedItems || {}) };
    merged.quests = { ...fresh.quests, ...(parsed.quests || {}) };
    merged.achievements = { ...(parsed.achievements || {}) };
    merged.market = { ...fresh.market, ...(parsed.market || {}) };
    merged.stats = { ...fresh.stats, ...(parsed.stats || {}) };
    merged.aquarium = Array.isArray(parsed.aquarium) ? parsed.aquarium : [];
    merged.unlockedLocations = Array.isArray(parsed.unlockedLocations) ? parsed.unlockedLocations : fresh.unlockedLocations;
    merged.ownedRods = Array.isArray(parsed.ownedRods) ? parsed.ownedRods : fresh.ownedRods;
    merged.inventory = Array.isArray(parsed.inventory) ? parsed.inventory : [];
    merged.selectedDepth = Math.min(merged.selectedDepth || 0, (RODS[merged.rod] || RODS[0]).maxDepth);
    return merged;
  } catch {
    return defaultGame();
  }
}

function saveGame() {
  if (runtime) game.nextWeatherIn = runtime.weatherClock;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  flash("Прогрес збережено.");
}

function bindEvents() {
  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("pointermove", event => {
    const pos = canvasPoint(event);
    pointer.x = pos.x / view.w;
    pointer.y = pos.y / view.h;
  });
  canvas.addEventListener("pointerdown", event => {
    const pos = canvasPoint(event);
    handlePrimaryAction(pos);
  });
  els.castButton.addEventListener("click", () => handlePrimaryAction({ x: view.w * 0.55, y: view.h * 0.64 }));
  els.depthButton.addEventListener("click", cycleDepth);
  els.inventoryButton.addEventListener("click", openInventory);
  els.dexButton.addEventListener("click", openFishDex);
  els.saveButton.addEventListener("click", saveGame);
  els.questsButton.addEventListener("click", openQuests);
  els.mapButton.addEventListener("click", openMap);
  els.trophyButton.addEventListener("click", openTrophies);
  els.aquariumButton.addEventListener("click", openAquarium);
  els.craftButton.addEventListener("click", openCraft);
  els.achievementsButton.addEventListener("click", openAchievements);
  els.collectAquariumButton.addEventListener("click", collectAquariumIncome);
  els.shopButton.addEventListener("click", openShop);
  els.enchantButton.addEventListener("click", openEnchantHouse);
  els.sleepButton.addEventListener("click", openSleepHouse);
  els.inventorySort.addEventListener("change", renderInventory);
  els.sellAllButton.addEventListener("click", sellAllFish);
  els.dexRarityFilter.addEventListener("change", renderFishDex);
  els.dexStatusFilter.addEventListener("change", renderFishDex);
  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
  });
  document.querySelectorAll("[data-sleep]").forEach(button => {
    button.addEventListener("click", () => sleep(button.dataset.sleep));
  });
  document.querySelectorAll(".shop-tabs button").forEach(button => {
    button.addEventListener("click", () => {
      game.shopTab = button.dataset.tab;
      document.querySelectorAll(".shop-tabs button").forEach(tab => tab.classList.toggle("active", tab === button));
      renderShop();
    });
  });

  window.addEventListener("keydown", event => {
    if (event.repeat && event.code !== "Space") return;
    if (event.code === "Space") {
      event.preventDefault();
      if (runtime.phase === "bite") hookFish();
      runtime.holding = true;
    }
    if (event.key.toLowerCase() === "s" || event.key === "ArrowDown") {
      event.preventDefault();
      cycleDepth();
    }
    if (event.key.toLowerCase() === "e") openInventory();
    if (event.key.toLowerCase() === "i") openFishDex();
    if (event.key.toLowerCase() === "q") openQuests();
    if (event.key.toLowerCase() === "m") openMap();
    if (event.key.toLowerCase() === "t") openTrophies();
    if (event.key.toLowerCase() === "a") openAquarium();
    if (event.key.toLowerCase() === "c") openCraft();
  });
  window.addEventListener("keyup", event => {
    if (event.code === "Space") runtime.holding = false;
  });
  ["pointerdown", "touchstart", "mousedown"].forEach(type => {
    els.holdReelButton.addEventListener(type, event => {
      event.preventDefault();
      if (runtime.phase === "bite") hookFish();
      runtime.holding = true;
    });
  });
  ["pointerup", "pointerleave", "touchend", "mouseup"].forEach(type => {
    els.holdReelButton.addEventListener(type, () => runtime.holding = false);
  });
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  view.w = Math.max(320, rect.width);
  view.h = Math.max(380, rect.height);
  canvas.width = Math.floor(view.w * dpr);
  canvas.height = Math.floor(view.h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (view.w / rect.width),
    y: (event.clientY - rect.top) * (view.h / rect.height)
  };
}

function handlePrimaryAction(pos) {
  if (runtime.phase === "bite") {
    hookFish();
    return;
  }
  if (runtime.phase === "idle") {
    castLine(pos);
  }
}

function castLine(pos) {
  const waterTop = view.h * 0.42;
  if (pos.y < waterTop) {
    flash("Закидай у воду, не в небо.");
    return;
  }
  const bait = BAITS.find(item => item.id === game.selectedBait);
  if (!bait || (game.bait[bait.id] || 0) <= 0) {
    flash("Наживка закінчилась. Зайди в магазин або вибери іншу.");
    return;
  }
  game.bait[bait.id] -= 1;
  runtime.phase = "waiting";
  runtime.cast = {
    x: clamp(pos.x, view.w * 0.2, view.w * 0.87),
    y: clamp(pos.y, waterTop + 28, view.h * 0.82),
    born: performance.now(),
    depth: game.selectedDepth
  };
  runtime.biteFish = null;
  runtime.biteAt = performance.now() + nextBiteDelay();
  runtime.ripples.push({ x: runtime.cast.x, y: runtime.cast.y, r: 4, life: 1 });
  renderBaits();
  updateHint();
  updateUI();
  subtleSave();
}

function nextBiteDelay() {
  const rod = getRod();
  const weatherFactor = WEATHER[game.weather].bite;
  const speed = game.enchants.speed ? 0.85 : 1;
  const eventSpeed = game.activeEvent === "big_rain" ? 0.86 : 1;
  return rand(2000, 6000) * rod.bite * weatherFactor * speed * eventSpeed;
}

function cycleDepth() {
  const maxDepth = getRod().maxDepth;
  if (game.selectedDepth >= maxDepth) {
    game.selectedDepth = 0;
  } else {
    game.selectedDepth += 1;
  }
  if (runtime.cast) runtime.cast.depth = game.selectedDepth;
  flash(`Глибина: ${DEPTHS[game.selectedDepth]}.`);
  updateUI();
  subtleSave();
}

function spawnFish() {
  const depth = runtime.cast ? runtime.cast.depth : game.selectedDepth;
  const period = getTimePeriod();
  const bait = BAITS.find(item => item.id === game.selectedBait) || BAITS[0];
  const rod = getRod();
  const weighted = FISH.map(fish => {
    let weight = fish.base;
    weight *= fish.depths.includes(depth) ? 1.8 : 0.18;
    weight *= fish.times.includes(period) || fish.times.includes("any") ? 1.55 : 0.34;
    weight *= fish.weather.includes(game.weather) ? 1.35 : game.weather === "heat" ? 0.82 : 0.96;
    weight *= baitModifier(fish, bait);
    weight *= locationModifier(fish);
    weight *= eventModifier(fish);
    weight *= aquariumModifier(fish);
    if (RARITY_ORDER[fish.rarity] >= 3) weight *= rod.rare;
    if (game.enchants.luck && RARITY_ORDER[fish.rarity] >= 3) weight *= 1.25;
    if (game.enchants.steady && fish.tags.includes("bottom")) weight *= 1.05;
    if (game.craftedItems.lucky_token && RARITY_ORDER[fish.rarity] >= 3) weight *= 1.08;
    if (game.craftedItems.deep_anchor && fish.tags.includes("bottom")) weight *= 1.2;
    if (fish.rarity === "legendary" && game.level < 7) weight *= 0.32;
    if (fish.rarity === "epic" && game.level < 4) weight *= 0.58;
    return { fish, weight };
  });
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let pick = Math.random() * total;
  for (const item of weighted) {
    pick -= item.weight;
    if (pick <= 0) {
      const weight = rand(item.fish.min, item.fish.max);
      return { ...item.fish, weight: Number(weight.toFixed(weight < 1 ? 2 : 1)) };
    }
  }
  const fallback = FISH[0];
  return { ...fallback, weight: Number(rand(fallback.min, fallback.max).toFixed(1)) };
}

function baitModifier(fish, bait) {
  let multiplier = 1;
  for (const [tag, value] of Object.entries(bait.tags)) {
    if (fish.tags.includes(tag) || fish.rarity === tag) multiplier *= value;
  }
  return multiplier;
}

function hookFish() {
  if (runtime.phase !== "bite") return;
  runtime.phase = "reeling";
  runtime.tension = 50;
  runtime.reelProgress = 0;
  runtime.holding = true;
  els.bitePrompt.classList.add("hidden");
  els.reelPanel.classList.remove("hidden");
  flash(`Клює: ${runtime.biteFish.name}! Вивуджуй обережно.`);
  updateHint();
}

function reelIn(dt) {
  if (runtime.phase !== "reeling" || !runtime.biteFish) return;
  const fish = runtime.biteFish;
  const rod = getRod();
  const rarityPower = 0.75 + RARITY_ORDER[fish.rarity] * 0.22;
  const weightPower = clamp((fish.weight - fish.min) / (fish.max - fish.min || 1), 0, 1) * 0.55;
  const fishPull = (rarityPower + weightPower) / rod.strength / (game.enchants.steady ? 1.16 : 1);
  const pulse = Math.sin(performance.now() / 230) * 8 + Math.sin(performance.now() / 720) * 10;

  runtime.tension += (fishPull * 12 + pulse * 0.42) * dt;
  if (runtime.holding) {
    runtime.tension += (28 / rod.strength) * dt;
    runtime.reelProgress += (13 + 8 / fishPull) * dt;
  } else {
    runtime.tension -= (30 + fishPull * 8) * dt;
    runtime.reelProgress -= 5 * dt;
  }

  if (runtime.tension > 82) runtime.reelProgress -= 8 * dt;
  if (runtime.tension < 18) runtime.reelProgress -= 10 * dt;
  runtime.tension = clamp(runtime.tension, -8, 108);
  runtime.reelProgress = clamp(runtime.reelProgress, 0, 100);
  els.tensionNeedle.style.left = `${clamp(runtime.tension, 0, 100)}%`;

  if (runtime.tension >= 100) {
    failCatch("Лінія порвалась. Риба була надто різкою.");
  } else if (runtime.tension <= 0) {
    failCatch("Лінія ослабла. Риба втекла.");
  } else if (runtime.reelProgress >= 100) {
    registerFishCatch(fish);
  }
}

function failCatch(message) {
  runtime.phase = "idle";
  runtime.cast = null;
  runtime.biteFish = null;
  runtime.holding = false;
  els.reelPanel.classList.add("hidden");
  flash(message);
  updateHint();
  subtleSave();
}

function registerFishCatch(fish) {
  runtime.phase = "idle";
  runtime.cast = null;
  runtime.biteFish = null;
  runtime.holding = false;
  els.reelPanel.classList.add("hidden");

  const existing = game.dex[fish.id] || { caught: false, count: 0, best: 0 };
  const firstCatch = !existing.caught;
  existing.caught = true;
  existing.count += 1;
  existing.best = Math.max(existing.best || 0, fish.weight);
  game.dex[fish.id] = existing;
  game.stats.totalCaught += 1;
  game.stats.totalWeight = Number((game.stats.totalWeight + fish.weight).toFixed(2));
  if (getTimePeriod() === "night") game.stats.nightCaught += 1;
  if (fish.rarity === "legendary") game.stats.legendaryCaught += 1;

  const rarity = RARITY_ORDER[fish.rarity];
  const xpGain = Math.round(12 + rarity * 8 + fish.weight * (2 + rarity));
  const firstBonusCoins = firstCatch ? 35 + rarity * 22 : 0;
  const firstBonusXp = firstCatch ? 30 + rarity * 18 : 0;
  addXp(xpGain + firstBonusXp);
  game.coins += firstBonusCoins;
  gainResources(fish);
  updateQuestProgress(fish);

  if (game.inventory.length < game.capacity) {
    game.inventory.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      fishId: fish.id,
      weight: fish.weight,
      caughtAt: Date.now()
    });
    flash(`${fish.icon} Спіймано: ${fish.name}, ${fish.weight} кг. +${xpGain + firstBonusXp} XP${firstCatch ? `, бонус ${firstBonusCoins} монет` : ""}.`);
    floatText(`+${xpGain + firstBonusXp} XP`, runtime.cast?.x || view.w * 0.5, view.h * 0.52);
    playSound("catch");
  } else {
    flash(`${fish.icon} ${fish.name} спіймана, але інвентар повний. Запис у Dex оновлено.`);
    playSound("fail");
  }

  if (firstCatch && RARITY_ORDER[fish.rarity] >= 3) {
    game.bait.magic = (game.bait.magic || 0) + 1;
    flash(`${fish.name} відкрила бонус: +1 магічна наживка.`);
  }

  checkAchievements();
  updateUI();
  renderBaits();
  subtleSave();
}

function addXp(amount) {
  game.xp += amount;
  let needed = xpNeeded();
  while (game.xp >= needed) {
    game.xp -= needed;
    game.level += 1;
    game.coins += 45 + game.level * 12;
    needed = xpNeeded();
    flash(`Новий рівень ${game.level}! Магазин має більше можливостей.`);
  }
}

function xpNeeded(level = game.level) {
  return Math.round(90 + Math.pow(level, 1.35) * 55);
}

function updateDayNightCycle(dtMs) {
  game.dayProgress = (game.dayProgress + dtMs / DAY_LENGTH) % 1;
}

function getTimePeriod() {
  const p = game.dayProgress;
  if (p < 0.18) return "dawn";
  if (p < 0.62) return "day";
  if (p < 0.76) return "dusk";
  return "night";
}

function getTimeLabel() {
  const period = getTimePeriod();
  return {
    dawn: "🌅 Ранок",
    day: "☀ День",
    dusk: "🌇 Вечір",
    night: "☾ Ніч"
  }[period];
}

function updateWeather(dtMs) {
  runtime.weatherClock -= dtMs;
  if (runtime.weatherClock > 0) return;
  const roll = Math.random();
  const next = roll < 0.48 ? "sunny" : roll < 0.78 ? "rain" : "heat";
  game.weather = next;
  runtime.weatherClock = rand(85000, 150000);
  flash(`Погода змінилась: ${WEATHER[next].name}, ${WEATHER[next].desc}.`);
}

function openInventory() {
  renderInventory();
  showDialog(els.inventoryModal);
}

function renderInventory() {
  const sort = els.inventorySort.value;
  const items = [...game.inventory];
  items.sort((a, b) => {
    const fa = getFish(a.fishId);
    const fb = getFish(b.fishId);
    if (sort === "weight") return b.weight - a.weight;
    if (sort === "rarity") return RARITY_ORDER[fb.rarity] - RARITY_ORDER[fa.rarity];
    if (sort === "type") return fa.name.localeCompare(fb.name, "uk");
    return b.caughtAt - a.caughtAt;
  });
  els.inventoryCapacity.textContent = `${game.inventory.length} / ${game.capacity}`;
  if (!items.length) {
    els.inventoryList.innerHTML = `<div class="fish-card"><h3>Порожньо</h3><p>Спіймай рибу, а потім продавай або колекціонуй трофеї.</p></div>`;
    return;
  }
  els.inventoryList.innerHTML = items.map(item => {
    const fish = getFish(item.fishId);
    return `<article class="fish-card">
      <div class="sprite ${rarityClass(fish)}">${fishIconMarkup(fish)}</div>
      <h3>${fish.name}</h3>
      <p class="${rarityClass(fish)}">${RARITY_LABEL[fish.rarity]}</p>
      <p>Вага: <strong>${item.weight} кг</strong></p>
      <p>Ціна: ${sellValue(fish, item.weight)} монет</p>
      <button data-sell="${item.id}">Продати</button>
    </article>`;
  }).join("");
  els.inventoryList.querySelectorAll("[data-sell]").forEach(button => {
    button.addEventListener("click", () => sellFish(button.dataset.sell));
  });
}

function openFishDex() {
  renderFishDex();
  showDialog(els.dexModal);
}

function renderFishDex() {
  const rarityFilter = els.dexRarityFilter.value;
  const statusFilter = els.dexStatusFilter.value;
  const caughtCount = FISH.filter(fish => game.dex[fish.id]?.caught).length;
  els.dexProgress.textContent = `Спіймано: ${caughtCount}/${FISH.length}`;
  const list = FISH
    .filter(fish => rarityFilter === "all" || fish.rarity === rarityFilter)
    .filter(fish => {
      const caught = Boolean(game.dex[fish.id]?.caught);
      return statusFilter === "all" || (statusFilter === "caught" ? caught : !caught);
    })
    .sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity] || a.name.localeCompare(b.name, "uk"));

  els.dexList.innerHTML = list.map(fish => {
    const record = game.dex[fish.id];
    const caught = Boolean(record?.caught);
    if (!caught) {
      return `<article class="fish-card">
        <div class="sprite">${fishIconMarkup(fish, true)}</div>
        <h3>???</h3>
        <p class="${rarityClass(fish)}">${RARITY_LABEL[fish.rarity]}</p>
        <p>Силует невідомої риби. Спробуй інший час, глибину або наживку.</p>
      </article>`;
    }
    return `<article class="fish-card">
      <div class="sprite ${rarityClass(fish)}">${fishIconMarkup(fish)}</div>
      <h3>${fish.name}</h3>
      <p class="${rarityClass(fish)}">${RARITY_LABEL[fish.rarity]}</p>
      <p>${fish.desc}</p>
      <p>Вага: ${fish.min}-${fish.max} кг</p>
      <p>Частіше: ${fish.times.map(timeName).join(", ")}; ${fish.depths.map(d => DEPTHS[d]).join(", ")}</p>
      <p>Рекорд: <strong>${record.best} кг</strong>, виловів: ${record.count}</p>
    </article>`;
  }).join("");
}

function openShop() {
  document.querySelectorAll(".shop-tabs button").forEach(tab => tab.classList.toggle("active", tab.dataset.tab === game.shopTab));
  renderShop();
  showDialog(els.shopModal);
}

function renderShop() {
  if (game.shopTab === "bait") {
    els.shopList.innerHTML = BAITS.map(bait => `<article class="shop-card">
      <div>
        <h3>${baitIconMarkup(bait)} ${bait.name}</h3>
        <p>${bait.desc}</p>
        <p>В запасі: ${game.bait[bait.id] || 0}; набір: ${bait.amount} шт.</p>
      </div>
      <button data-buy-bait="${bait.id}">${bait.cost} монет</button>
    </article>`).join("");
    els.shopList.querySelectorAll("[data-buy-bait]").forEach(button => button.addEventListener("click", () => buyBait(button.dataset.buyBait)));
    return;
  }
  if (game.shopTab === "storage") {
    const cost = storageCost();
    els.shopList.innerHTML = `<article class="shop-card">
      <div>
        <h3>Розширення інвентаря</h3>
        <p>Поточна місткість: ${game.capacity}. Додає 8 місць.</p>
      </div>
      <button data-storage>${cost} монет</button>
    </article>`;
    els.shopList.querySelector("[data-storage]").addEventListener("click", buyStorage);
    return;
  }
  els.shopList.innerHTML = RODS.map((rod, index) => {
    const owned = game.ownedRods.includes(rod.id);
    const equipped = game.rod === index;
    const locked = game.level < rod.level;
    const buttonText = equipped ? "Встановлено" : owned ? "Взяти" : `${rod.cost} монет`;
    return `<article class="shop-card ${locked ? "locked" : ""}">
      <div>
        <h3>${rod.name}</h3>
        <p>${rod.desc}</p>
        <p>Рівень ${rod.level}; макс. глибина: ${DEPTHS[rod.maxDepth]}; міцність x${rod.strength}</p>
      </div>
      <button data-rod="${index}" ${equipped || locked ? "disabled" : ""}>${locked ? `Рівень ${rod.level}` : buttonText}</button>
    </article>`;
  }).join("");
  els.shopList.querySelectorAll("[data-rod]").forEach(button => button.addEventListener("click", () => buyOrEquipRod(Number(button.dataset.rod))));
}

function openEnchantHouse() {
  renderEnchantments();
  showDialog(els.enchantModal);
}

function renderEnchantments() {
  els.enchantList.innerHTML = ENCHANTS.map(enchant => {
    const owned = game.enchants[enchant.id];
    const locked = game.level < enchant.level;
    return `<article class="enchant-card ${locked ? "locked" : ""}">
      <div>
        <h3>${enchant.name}</h3>
        <p>${enchant.desc}</p>
        <p>Потрібен рівень ${enchant.level}</p>
      </div>
      <button data-enchant="${enchant.id}" ${owned || locked ? "disabled" : ""}>${owned ? "Накладено" : `${enchant.cost} монет`}</button>
    </article>`;
  }).join("");
  els.enchantList.querySelectorAll("[data-enchant]").forEach(button => button.addEventListener("click", () => enchantRod(button.dataset.enchant)));
}

function openSleepHouse() {
  showDialog(els.sleepModal);
}

function sleep(target) {
  const targets = { morning: 0.08, noon: 0.35, evening: 0.68, night: 0.84 };
  const cost = 18;
  if (game.coins < cost) {
    flash("Сон коштує 18 монет.");
    return;
  }
  game.coins -= cost;
  game.dayProgress = targets[target] ?? 0.08;
  els.sleepModal.close();
  flash(`Час перемотано: ${getTimeLabel()}.`);
  updateUI();
  subtleSave();
}

function buyBait(id) {
  const bait = BAITS.find(item => item.id === id);
  if (!bait || game.coins < bait.cost) {
    flash("Не вистачає монет.");
    return;
  }
  game.coins -= bait.cost;
  game.bait[id] = (game.bait[id] || 0) + bait.amount;
  renderBaits();
  renderShop();
  updateUI();
  subtleSave();
}

function buyOrEquipRod(index) {
  const rod = RODS[index];
  if (!rod || game.level < rod.level) return;
  if (!game.ownedRods.includes(rod.id)) {
    if (game.coins < rod.cost) {
      flash("Не вистачає монет на вудку.");
      return;
    }
    game.coins -= rod.cost;
    game.ownedRods.push(rod.id);
  }
  game.rod = index;
  game.selectedDepth = Math.min(game.selectedDepth, rod.maxDepth);
  renderShop();
  updateUI();
  subtleSave();
}

function buyStorage() {
  const cost = storageCost();
  if (game.coins < cost) {
    flash("Не вистачає монет на розширення.");
    return;
  }
  game.coins -= cost;
  game.capacity += 8;
  renderShop();
  updateUI();
  subtleSave();
}

function enchantRod(id) {
  const enchant = ENCHANTS.find(item => item.id === id);
  if (!enchant || game.enchants[id] || game.level < enchant.level) return;
  if (game.coins < enchant.cost) {
    flash("Не вистачає монет для чарів.");
    return;
  }
  game.coins -= enchant.cost;
  game.enchants[id] = true;
  renderEnchantments();
  updateUI();
  subtleSave();
}

function sellFish(id) {
  const index = game.inventory.findIndex(item => item.id === id);
  if (index < 0) return;
  const item = game.inventory[index];
  const fish = getFish(item.fishId);
  const value = sellValue(fish, item.weight);
  game.coins += value;
  game.inventory.splice(index, 1);
  flash(`Продано ${fish.name}: +${value} монет.`);
  renderInventory();
  updateUI();
  subtleSave();
}

function sellAllFish() {
  if (!game.inventory.length) return;
  const value = game.inventory.reduce((sum, item) => sum + sellValue(getFish(item.fishId), item.weight), 0);
  game.coins += value;
  game.inventory = [];
  flash(`Увесь улов продано: +${value} монет.`);
  renderInventory();
  updateUI();
  subtleSave();
}

function sellValue(fish, weight) {
  const rarityValue = { common: 8, uncommon: 14, rare: 28, epic: 58, legendary: 135 }[fish.rarity];
  return Math.max(3, Math.round(weight * rarityValue + RARITY_ORDER[fish.rarity] * 6));
}

function storageCost() {
  return Math.round(160 + (game.capacity - 24) * 22);
}

function updateUI() {
  els.levelValue.textContent = game.level;
  els.coinValue.textContent = game.coins;
  els.weatherValue.textContent = WEATHER[game.weather].name;
  els.timeValue.textContent = getTimeLabel();
  els.depthValue.textContent = DEPTHS[game.selectedDepth];
  const need = xpNeeded();
  els.xpText.textContent = `${game.xp} / ${need} XP`;
  els.xpFill.style.width = `${clamp((game.xp / need) * 100, 0, 100)}%`;
}

function renderBaits() {
  els.baitChoices.innerHTML = BAITS.map(bait => {
    const count = game.bait[bait.id] || 0;
    return `<button class="bait-choice ${game.selectedBait === bait.id ? "active" : ""}" data-bait="${bait.id}" title="${bait.name}: ${bait.desc}" ${count <= 0 ? "disabled" : ""}>
      ${baitIconMarkup(bait)}
      <small>${count}</small>
    </button>`;
  }).join("");
  els.baitChoices.querySelectorAll("[data-bait]").forEach(button => {
    button.addEventListener("click", () => {
      game.selectedBait = button.dataset.bait;
      renderBaits();
      subtleSave();
    });
  });
}

function updateHint() {
  const map = {
    idle: "Клікни або тапни по озеру, щоб закинути вудку",
    waiting: "Чекай на кльов. S або ↓ змінює глибину",
    bite: "Підсікай! Натисни пробіл, кнопку або тапни по озеру",
    reeling: "Вивуджуй: утримуй і відпускай, щоб тримати натяг у зеленій зоні"
  };
  els.hint.textContent = map[runtime.phase] || "";
}

function loop(now) {
  const dtMs = Math.min(80, now - lastFrame);
  const dt = dtMs / 1000;
  lastFrame = now;

  updateDayNightCycle(dtMs);
  updateWeather(dtMs);
  updateFishingState(now, dt);
  drawScene(now, dt);
  updateUI();

  if (now - lastSave > 20000) {
    lastSave = now;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...game, nextWeatherIn: runtime.weatherClock }));
  }
  requestAnimationFrame(loop);
}

function updateFishingState(now, dt) {
  if (runtime.phase === "waiting" && now >= runtime.biteAt) {
    runtime.biteFish = spawnFish();
    runtime.phase = "bite";
    runtime.hookDeadline = now + rand(500, 1000);
    runtime.ripples.push({ x: runtime.cast.x, y: runtime.cast.y, r: 10, life: 1 });
    positionBitePrompt();
    els.bitePrompt.classList.remove("hidden");
    updateHint();
  }
  if (runtime.phase === "bite") {
    positionBitePrompt();
    if (now >= runtime.hookDeadline) {
      els.bitePrompt.classList.add("hidden");
      failCatch("Запізно. Риба зірвалась з гачка.");
    }
  }
  reelIn(dt);
  runtime.ripples.forEach(ripple => {
    ripple.r += 46 * dt;
    ripple.life -= 0.9 * dt;
  });
  runtime.ripples = runtime.ripples.filter(ripple => ripple.life > 0);
}

function positionBitePrompt() {
  if (!runtime.cast) return;
  els.bitePrompt.style.left = `${runtime.cast.x}px`;
  els.bitePrompt.style.top = `${runtime.cast.y}px`;
}

function drawScene(now, dt) {
  const w = view.w;
  const h = view.h;
  const waterTop = h * 0.42;
  ctx.imageSmoothingEnabled = false;
  drawSky(w, h, now);
  drawFarTrees(w, h, now);
  drawBuildings(w, h);
  drawWater(w, h, waterTop, now, dt);
  drawShore(w, h, now);
  drawAngler(w, h, now);
  drawFishingLine(w, h, now);
  drawWeatherEffects(w, h, now, dt);
}

function px(value) {
  return Math.round(value);
}

function pixelRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(px(x), px(y), px(width), px(height));
}

function outlinedRect(x, y, width, height, fill, outline = "#1d1517", stroke = 4) {
  pixelRect(x - stroke, y - stroke, width + stroke * 2, height + stroke * 2, outline);
  pixelRect(x, y, width, height, fill);
}

function drawSky(w, h, now) {
  const period = getTimePeriod();
  const night = period === "night" ? 1 : period === "dusk" || period === "dawn" ? 0.45 : 0;
  const heat = game.weather === "heat" ? 0.18 : 0;
  const skyBands = ["#5a8bd4", "#62a9d2", "#72bdd8", "#9fd8df", "#d0efc9"];
  const nightBands = ["#17284d", "#1d315b", "#263f66", "#314967", "#3d5470"];
  for (let i = 0; i < skyBands.length; i++) {
    const color = mixColor(skyBands[i], nightBands[i], night);
    pixelRect(0, (h * 0.42 / skyBands.length) * i, w, h * 0.42 / skyBands.length + 2, color);
  }
  if (heat) {
    pixelRect(0, h * 0.3, w, h * 0.12, "rgba(255,198,115,0.18)");
  }
  pixelRect(0, 18, w, 4, mixColor("#447ec8", "#101d39", night));
  pixelRect(0, 28, w, 3, mixColor("#3e78c0", "#0d1a33", night));

  if (period === "night") {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,230,0.85)";
    for (let i = 0; i < 55; i++) {
      const x = px((i * 97 + 40) % w);
      const y = px(18 + ((i * 53) % Math.max(80, h * 0.28)));
      const twinkle = 0.45 + Math.sin(now / 540 + i) * 0.35;
      ctx.globalAlpha = twinkle;
      ctx.fillRect(x, y, 4, 4);
    }
    ctx.globalAlpha = 1;
    drawPixelMoon(w * 0.78, h * 0.12);
    ctx.restore();
  } else {
    drawPixelSun(w * 0.76, h * 0.13, game.weather === "heat" ? "#fff08a" : "#ffe07a");
  }

  drawCloud(w * 0.23 + Math.sin(now / 2400) * 18, h * 0.13, 1.1);
  drawCloud(w * 0.58 + Math.sin(now / 2800) * 24, h * 0.2, 0.85);
  if (game.weather === "rain") drawCloud(w * 0.45, h * 0.1, 1.45, "#677885");
}

function drawPixelSun(x, y, color) {
  const s = 8;
  pixelRect(x - s * 3, y - s * 2, s * 6, s * 4, color);
  pixelRect(x - s * 2, y - s * 3, s * 4, s * 6, color);
  pixelRect(x - s * 1, y - s * 4, s * 2, s, color);
  pixelRect(x - s * 1, y + s * 3, s * 2, s, "#ffd65a");
  pixelRect(x - s * 4, y - s, s, s * 2, "#ffd65a");
  pixelRect(x + s * 3, y - s, s, s * 2, "#fff0a4");
}

function drawPixelMoon(x, y) {
  const s = 6;
  pixelRect(x - s * 3, y - s * 3, s * 6, s * 6, "#f2e8b7");
  pixelRect(x - s * 2, y - s * 4, s * 4, s, "#f2e8b7");
  pixelRect(x - s * 2, y + s * 3, s * 4, s, "#d7ca8c");
  pixelRect(x + s, y - s * 3, s * 3, s * 5, "#17284d");
}

function drawCloud(x, y, scale, color = "#ffffff") {
  const s = 10 * scale;
  const shade = color === "#ffffff" ? "#c7fbff" : "#566975";
  const chunks = [
    [-7, 1, 3, 2], [-5, -1, 4, 4], [-2, -2, 5, 5], [2, -3, 4, 5],
    [5, -1, 4, 4], [8, 1, 3, 2], [-8, 3, 18, 2]
  ];
  chunks.forEach(([cx, cy, cw, ch]) => pixelRect(x + cx * s, y + cy * s, cw * s, ch * s, color));
  pixelRect(x - 8 * s, y + 4.4 * s, 15 * s, 0.7 * s, shade);
  pixelRect(x - 4.5 * s, y + 0.2 * s, 8 * s, 0.8 * s, shade);
  if (color !== "#ffffff") {
    pixelRect(x - 8 * s, y + 4.4 * s, 18 * s, 1.1 * s, "rgba(43,52,59,0.55)");
  }
}

function drawFarTrees(w, h, now) {
  const base = h * 0.42;
  const offset = (pointer.x - 0.5) * 20;
  pixelRect(0, base - 22, w, 30, "#2f682f");
  pixelRect(0, base + 2, w, 22, "#255427");
  for (let i = 0; i < 24; i++) {
    const x = ((i * 72 + offset) % (w + 96)) - 48;
    const treeH = 72 + (i % 5) * 18;
    const dark = i % 3 === 0;
    pixelRect(x - 6, base - 30, 12, 48, "#5a3a24");
    pixelRect(x - 24, base - treeH + 44, 48, 22, dark ? "#1f4b28" : "#2d6530");
    pixelRect(x - 32, base - treeH + 62, 64, 24, dark ? "#173d24" : "#24552b");
    pixelRect(x - 20, base - treeH + 20, 40, 24, dark ? "#286133" : "#39743a");
    pixelRect(x - 12, base - treeH, 24, 22, dark ? "#326f37" : "#468145");
  }
}

function drawBuildings(w, h) {
  const y = h * 0.39;
  drawPier(w * 0.36, y + 36, w * 0.42);
  drawCabin(w * 0.18, y, 112, "#b66a45", "#7f3548");
  drawCrate(w * 0.055, y + 70);
  drawBarrel(w * 0.085, y + 64);
  drawCabin(w * 0.79, y + 22, 62, "#65447a", "#9fd6ff");
  drawCabin(w * 0.91, y + 32, 54, "#8f563d", "#f0d17e");
  drawBoat(w * 0.72, h * 0.55, 1);
}

function drawCabin(x, y, size, wall, roof) {
  const left = x - size * 0.5;
  const top = y - size * 0.35;
  outlinedRect(left, top, size, size * 0.56, wall);
  pixelRect(left + size * 0.08, top + size * 0.08, size * 0.26, size * 0.42, "#d88b52");
  outlinedRect(left + size * 0.5, top + size * 0.18, size * 0.28, size * 0.24, "#2c2630", "#2a171a", 3);
  pixelRect(left + size * 0.53, top + size * 0.21, size * 0.22, size * 0.05, "#b8e4f4");
  pixelRect(left + size * 0.1, top + size * 0.13, size * 0.2, 3, "#f3b877");
  pixelRect(left + size * 0.15, top + size * 0.3, 5, 5, "#f3d05d");
  drawPixelRoof(x, top, size, roof);
  for (let i = 0; i < 5; i++) {
    pixelRect(left + 8 + i * size * 0.18, top + 9, size * 0.12, 4, "rgba(65,31,36,0.42)");
  }
}

function drawWater(w, h, top, now, dt) {
  const period = getTimePeriod();
  const night = period === "night" ? 1 : period === "dusk" ? 0.35 : 0;
  const bands = ["#38a7bd", "#2f9eb9", "#298eac", "#207f9f", "#1b6f91", "#185f84"];
  const nightBands = ["#173d56", "#14364f", "#112f48", "#0e2840", "#0c2339", "#091d30"];
  const bandH = Math.max(18, (h - top) / bands.length);
  for (let i = 0; i < bands.length; i++) {
    pixelRect(0, top + i * bandH, w, bandH + 1, mixColor(bands[i], nightBands[i], night));
  }

  ctx.save();
  for (let row = 0; row < 18; row++) {
    const y = top + 14 + row * ((h - top) / 17);
    const step = 36;
    const shift = px(((now / (70 + row * 5)) + row * 19) % step);
    const color = row % 2 ? "rgba(176,239,245,0.24)" : "rgba(31,96,132,0.28)";
    for (let x = -step; x < w + step; x += step * 2) {
      pixelRect(x + shift, y, step, 4, color);
      pixelRect(x + shift + step * 0.55, y + 6, step * 0.45, 3, color);
    }
  }

  runtime.fishShadows.forEach(shadow => {
    shadow.x += shadow.speed * dt * (shadow.sway % 2 ? 1 : -1);
    if (shadow.x > 1.08) shadow.x = -0.08;
    if (shadow.x < -0.08) shadow.x = 1.08;
    const x = shadow.x * w;
    const y = top + (h - top) * (shadow.y - 0.42) / 0.58 + Math.sin(now / 900 + shadow.sway) * 6;
    pixelRect(x - 18 * shadow.size, y - 4 * shadow.size, 36 * shadow.size, 8 * shadow.size, "rgba(5,25,37,0.13)");
    pixelRect(x + 14 * shadow.size, y - 8 * shadow.size, 10 * shadow.size, 4 * shadow.size, "rgba(5,25,37,0.11)");
  });
  ctx.restore();

  runtime.ripples.forEach(ripple => {
    const alpha = 0.45 * ripple.life;
    const rw = ripple.r * 1.8;
    const rh = ripple.r * 0.5;
    pixelRect(ripple.x - rw, ripple.y - rh, rw * 0.42, 4, `rgba(255,255,255,${alpha})`);
    pixelRect(ripple.x + rw * 0.18, ripple.y - rh, rw * 0.82, 4, `rgba(255,255,255,${alpha})`);
    pixelRect(ripple.x - rw * 0.72, ripple.y + rh, rw * 1.22, 4, `rgba(255,255,255,${alpha * 0.7})`);
  });
}

function drawShore(w, h, now) {
  const grassTop = h * 0.76;
  pixelRect(0, grassTop, w, h - grassTop, "#6ea044");
  for (let x = -32; x < w + 32; x += 32) {
    const y = grassTop + ((x / 32) % 3) * 6;
    pixelRect(x, y, 32, 18, "#79b24a");
    pixelRect(x, y + 18, 32, 8, "#427b30");
  }
  pixelRect(0, grassTop + 46, w, h - grassTop - 46, "#b98d55");
  for (let y = grassTop + 62; y < h; y += 22) {
    for (let x = (y % 44); x < w; x += 44) {
      pixelRect(x, y, 8, 8, (x + y) % 3 ? "#7b5a3c" : "#5b4738");
    }
  }
  for (let i = 0; i < 34; i++) {
    const x = (i * 43 + (pointer.x - 0.5) * 12) % w;
    const y = grassTop + 4 + (i % 4) * 8;
    pixelRect(x, y, 5, 26 + (i % 3) * 8, i % 2 ? "#2e6d2c" : "#3f8b35");
    pixelRect(x - 5, y + 5, 5, 9, "#235827");
  }
}

function drawAngler(w, h, now) {
  const x = px(w * 0.47);
  const y = px(h * 0.64);
  const castLift = runtime.phase === "waiting" || runtime.phase === "bite" || runtime.phase === "reeling" ? -10 : Math.sin(now / 450) * 4;
  outlinedRect(x - 11, y - 64, 22, 20, "#26384a", "#1a1215", 3);
  pixelRect(x - 7, y - 58, 6, 5, "#f0b27a");
  pixelRect(x + 5, y - 58, 4, 5, "#f0b27a");
  outlinedRect(x - 10, y - 42, 20, 32, "#c98048", "#1a1215", 3);
  pixelRect(x - 16, y - 38, 8, 24, "#f0b27a");
  pixelRect(x + 9, y - 38, 8, 24, "#f0b27a");
  pixelRect(x - 12, y - 10, 8, 28, "#1f3344");
  pixelRect(x + 5, y - 10, 8, 28, "#1f3344");
  pixelRect(x - 18, y + 14, 16, 6, "#161a22");
  pixelRect(x + 5, y + 14, 18, 6, "#161a22");
  drawPixelRod(x + 15, y - 42, x + 235, y - 142 + castLift, "#4c2f20");
}

function drawFishingLine(w, h, now) {
  if (!runtime.cast) return;
  const startX = w * 0.47 + 235;
  const startY = h * 0.64 - 142;
  const bob = runtime.cast;
  const bobY = px(bob.y + Math.sin(now / 210) * (runtime.phase === "bite" ? 8 : 2));
  ctx.save();
  drawPixelLine(startX, startY, bob.x, bobY, "rgba(245,248,255,0.86)", 2);
  const depthY = bobY + 40 + bob.depth * 62;
  drawPixelLine(bob.x, bobY, bob.x + Math.sin(now / 500) * 8, depthY, "rgba(245,248,255,0.72)", 2);

  outlinedRect(bob.x - 7, bobY - 14, 14, 24, runtime.phase === "bite" ? "#ffdf4f" : "#f2f6ff", "#1d1517", 2);
  pixelRect(bob.x - 7, bobY - 2, 14, 8, "#d23d35");
  pixelRect(bob.x - 3, bobY + 10, 6, 5, "#1d1517");

  if (runtime.phase === "reeling" && runtime.biteFish) {
    drawFishSprite(runtime.biteFish, bob.x + Math.sin(now / 160) * 18, depthY, 0.75, now);
  }
  ctx.restore();
}

function drawFishSprite(fish, x, y, scale, now) {
  const flip = Math.sin(now / 220) > 0 ? 1 : -1;
  const s = 5 * scale;
  ctx.save();
  ctx.translate(px(x), px(y));
  ctx.scale(flip, 1);
  pixelRect(-9 * s, -3 * s, 15 * s, 6 * s, "#1d1517");
  pixelRect(-6 * s, -5 * s, 10 * s, 10 * s, "#1d1517");
  pixelRect(-7 * s, -2 * s, 12 * s, 4 * s, fish.color);
  pixelRect(-4 * s, -4 * s, 7 * s, 8 * s, fish.color);
  pixelRect(2 * s, -2 * s, 3 * s, 4 * s, fish.accent);
  pixelRect(-11 * s, -4 * s, 4 * s, 3 * s, fish.accent);
  pixelRect(-11 * s, s, 4 * s, 3 * s, fish.accent);
  pixelRect(4 * s, -2 * s, s, s, "#101014");
  if (RARITY_ORDER[fish.rarity] >= 4) {
    pixelRect(-3 * s, -6 * s, 2 * s, s, fish.rarity === "legendary" ? "#fff2a6" : "#d4a4ff");
    pixelRect(0, 5 * s, 2 * s, s, fish.rarity === "legendary" ? "#fff2a6" : "#d4a4ff");
  }
  ctx.restore();
}

function drawWeatherEffects(w, h, now, dt) {
  if (game.weather === "rain") {
    while (runtime.particles.length < 120) runtime.particles.push({ x: Math.random() * w, y: Math.random() * h, v: rand(500, 780) });
    runtime.particles.forEach(drop => {
      drop.x -= 120 * dt;
      drop.y += drop.v * dt;
      if (drop.y > h || drop.x < -20) {
        drop.x = Math.random() * w;
        drop.y = -20;
        drop.v = rand(500, 780);
      }
      pixelRect(drop.x, drop.y, 3, 12, "rgba(188,222,239,0.58)");
      pixelRect(drop.x - 3, drop.y + 9, 3, 6, "rgba(188,222,239,0.42)");
    });
  } else if (game.weather === "heat") {
    runtime.particles.length = 0;
    for (let i = 0; i < 22; i++) {
      const x = px((i * 61 + now / 45) % w);
      const y = h * 0.45 + (i % 5) * 20;
      pixelRect(x, y, 4, 16, "rgba(255,235,185,0.22)");
      pixelRect(x + 8, y - 16, 4, 16, "rgba(255,235,185,0.18)");
      pixelRect(x - 4, y - 32, 4, 12, "rgba(255,235,185,0.14)");
    }
  } else {
    runtime.particles.length = 0;
  }
}

function drawPixelRoof(x, top, size, color) {
  const left = x - size * 0.62;
  const rowH = size * 0.08;
  const rows = [
    [0.22, 0.56],
    [0.14, 0.72],
    [0.06, 0.88],
    [0, 1]
  ];
  rows.forEach(([offset, width], i) => {
    outlinedRect(left + size * offset, top - rowH * (4 - i), size * width, rowH + 2, color, "#1d1517", i === 0 ? 3 : 2);
    for (let t = 0; t < 5; t++) {
      pixelRect(left + size * offset + t * size * width / 5 + 4, top - rowH * (4 - i) + 3, size * 0.08, 3, "rgba(60,28,37,0.42)");
    }
  });
  pixelRect(x - 6, top - rowH * 5.4, 12, rowH * 1.4, "#6b2d3f");
}

function drawPier(x, y, width) {
  const plank = 22;
  pixelRect(x - 16, y - 10, width + 32, 14, "#1d1517");
  for (let i = 0; i < width / plank; i++) {
    const pxX = x + i * plank;
    pixelRect(pxX, y - 24, plank - 3, 30, i % 2 ? "#a35a3a" : "#b96a43");
    pixelRect(pxX + 3, y - 17, plank - 8, 4, "rgba(87,39,32,0.42)");
  }
  for (let i = 0; i < width / 70; i++) {
    const postX = x + i * 70;
    pixelRect(postX, y - 42, 10, 74, "#5b3428");
    pixelRect(postX - 2, y - 44, 14, 8, "#2a171a");
  }
  pixelRect(x - 10, y - 52, width + 20, 8, "#6e3b33");
}

function drawCrate(x, y) {
  outlinedRect(x, y, 34, 30, "#a45d3f", "#1d1517", 3);
  pixelRect(x + 5, y + 5, 24, 4, "#d18a55");
  pixelRect(x + 5, y + 20, 24, 4, "#6f3c32");
  pixelRect(x + 14, y, 5, 30, "#6f3c32");
}

function drawBarrel(x, y) {
  outlinedRect(x, y, 28, 34, "#b76d47", "#1d1517", 3);
  pixelRect(x - 2, y + 6, 32, 5, "#6e3b33");
  pixelRect(x - 2, y + 23, 32, 5, "#6e3b33");
  pixelRect(x + 8, y + 12, 12, 4, "#e0a05e");
}

function drawBoat(x, y, scale) {
  const s = 4 * scale;
  pixelRect(x - 18 * s, y + 4 * s, 38 * s, 6 * s, "#1d1517");
  pixelRect(x - 15 * s, y, 31 * s, 8 * s, "#ba7046");
  pixelRect(x - 12 * s, y + 8 * s, 24 * s, 5 * s, "#774333");
  pixelRect(x - 2 * s, y - 16 * s, 6 * s, 14 * s, "#f0b27a");
  pixelRect(x - 4 * s, y - 24 * s, 10 * s, 8 * s, "#3f2a24");
  pixelRect(x + 13 * s, y - 18 * s, 6 * s, 16 * s, "#f0b27a");
  pixelRect(x + 11 * s, y - 27 * s, 10 * s, 9 * s, "#233446");
  drawPixelLine(x + 18 * s, y - 12 * s, x + 27 * s, y + 14 * s, "#6d3f2a", 4);
}

function drawPixelRod(x1, y1, x2, y2, color) {
  const steps = 22;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * -22;
    pixelRect(x, y, 5, 5, color);
  }
}

function drawPixelLine(x1, y1, x2, y2, color, size = 2) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 8));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pixelRect(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, size, size, color);
  }
}

function showDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function getRod() {
  return RODS[game.rod] || RODS[0];
}

function getFish(id) {
  return FISH.find(fish => fish.id === id) || FISH[0];
}

function rarityClass(fish) {
  return `rarity-${fish.rarity}`;
}

function fishIconMarkup(fish, missing = false) {
  const color = missing ? "#33343f" : fish.color;
  const accent = missing ? "#1d1517" : fish.accent;
  return `<span class="pixel-fish${missing ? " missing" : ""}" style="--fish:${color};--accent:${accent}" aria-hidden="true"></span>`;
}

function baitIconMarkup(bait) {
  return `<span class="pixel-bait ${bait.id}" aria-hidden="true"></span>`;
}

function timeName(time) {
  return { dawn: "ранок", day: "день", dusk: "вечір", night: "ніч", any: "будь-коли" }[time] || time;
}

function flash(message) {
  els.messageLog.textContent = message;
}

function subtleSave() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...game, nextWeatherIn: runtime.weatherClock }));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mixColor(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const mix = ca.map((part, index) => Math.round(part + (cb[index] - part) * clamp(t, 0, 1)));
  return `rgb(${mix[0]},${mix[1]},${mix[2]})`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16)
  ];
}

document.addEventListener("DOMContentLoaded", init);
