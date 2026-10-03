const fs = require("fs");

const original = JSON.parse(fs.readFileSync("./original.json", "utf8"));

const cards = JSON.parse(fs.readFileSync("./cards.json", "utf8"));

const originalMap = new Map(original.map((card) => [card.id, card]));

const mergedCards = cards.map((card) => {
  const source = originalMap.get(card.id);

  return {
    id: card.id,
    name: card.name,
    series: source?.series ?? "",
    rarity: card.rarity,
    displayId: card.displayId,
    parallel: card.parallel,
    type: card.type,
    attackType: card.attackType,
    hp: card.hp,
    power: card.power,
    powerAwakened: card.powerAwakened,
    guard: card.guard,
    initialKi: card.initialKi,
    energy: card.energy,
    specialMove: card.specialMove,
    skillName: card.skillName,
    skillEffect: card.skillEffect,
    actionName: card.actionName,
    actionSkill: source?.actionSkill ?? "",
    actionEffect: card.actionEffect,
    unitName: card.unitName,
    unitCharacters: card.unitCharacters,
    unitEffect: card.unitEffect,
    buppaName: card.buppaName,
    buppaEffect: card.buppaEffect,
    specialRule: card.specialRule,
    acquisition: source?.acquisition ?? "",
    owned: card.owned,
    unopened: card.unopened,
    wanted: card.wanted,
    memo: card.memo,
    checked: card.checked,
  };
});

fs.writeFileSync(
  "./cards_merged.json",
  JSON.stringify(mergedCards, null, 2),
  "utf8",
);

console.log("cards_merged.json を作成しました");
