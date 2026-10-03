const fs = require("fs");
const path = require("path");

const originalPath = path.join(__dirname, "../cards(元データ).json");

const ocrPath = path.join(__dirname, "../cards(仮).json");

const outputPath = path.join(__dirname, "../cards_v3.json");

const originalCards = JSON.parse(fs.readFileSync(originalPath, "utf8"));

const ocrCards = JSON.parse(fs.readFileSync(ocrPath, "utf8"));

const ocrMap = new Map(ocrCards.map((card) => [card.id, card]));

function getAttackType(battleStyle = "") {
  if (battleStyle.includes("打撃")) {
    return "打撃";
  }

  if (battleStyle.includes("気弾")) {
    return "気弾";
  }

  return "";
}

function splitPower(value) {
  if (value === undefined || value === null || value === "") {
    return {
      power: null,
      powerAwakened: null,
    };
  }

  const text = String(value).trim();

  if (text.includes("→")) {
    const [before, after] = text.split("→");

    return {
      power: Number(before.trim()) || null,
      powerAwakened: Number(after.trim()) || null,
    };
  }

  return {
    power: Number(text) || null,
    powerAwakened: null,
  };
}

const mergedCards = originalCards.map((originalCard) => {
  const ocrCard = ocrMap.get(originalCard.id) || {};

  const powerData = splitPower(ocrCard.power ?? originalCard.power);

  return {
    id: originalCard.id,

    name: ocrCard.name || originalCard.name || "",

    series: ocrCard.series || originalCard.series || "",

    rarity: ocrCard.rarity || originalCard.rarity || "",

    displayId: ocrCard.displayId || originalCard.displayId || originalCard.id,

    parallel: ocrCard.parallel ?? originalCard.parallel ?? false,

    type: ocrCard.type || originalCard.type || "",

    attackType: getAttackType(ocrCard.battleStyle),

    hp: ocrCard.hp ?? originalCard.hp ?? null,

    power: powerData.power,

    powerAwakened: powerData.powerAwakened,

    guard: ocrCard.guard ?? originalCard.guard ?? null,

    initialKi: ocrCard.initialKi ?? null,

    energy: ocrCard.energy ?? originalCard.energy ?? null,

    specialMove: ocrCard.specialMoveName || "",

    skillName: ocrCard.skillName || "",

    skillEffect: ocrCard.skillEffect || "",

    actionName: ocrCard.actionSkillName || "",

    actionCategory: ocrCard.actionSkill || "",

    actionEffect: ocrCard.standbyActionSkillEffect || "",

    unitName: ocrCard.unitSkillName || "",

    unitCharacters: ocrCard.unitMembers || "",

    unitEffect: ocrCard.unitSkillEffect || "",

    buppaName: ocrCard.buppaSkillName || "",

    buppaEffect: ocrCard.buppaSkillEffect || "",

    specialRule: ocrCard.specialRule || "",

    acquisition: ocrCard.acquisition || originalCard.acquisition || "",

    owned: originalCard.owned ?? 0,

    unopened: originalCard.unopened ?? false,

    wanted: originalCard.wanted ?? false,

    memo: originalCard.memo || "",

    checked: originalCard.checked ?? false,

    sourceFile: ocrCard.sourceFile || "",
  };
});

fs.writeFileSync(outputPath, JSON.stringify(mergedCards, null, 2));

console.log(`✅ ${mergedCards.length}枚を統合しました`);

console.log("📄 cards_v3.json を作成しました");
