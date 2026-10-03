const fs = require("fs");
const path = require("path");

function getSeries(cardId) {
  const match = cardId.match(/^SDV(\d+)/);

  if (match) {
    return `${Number(match[1])}弾`;
  }

  if (cardId.startsWith("TEST")) {
    return "ロケーションテスト";
  }

  return "プロモーションカード";
}

function writeJson(cards) {
  const output = cards.map((card) => {
    const isParallel = card.parallel ?? /p_\d+$/.test(card.id);
    const displayId = isParallel ? card.id.replace(/p_\d+$/, "") : card.id;

    return {
      id: card.id,
      name: card.name,

      rarity: card.rarity,

      displayId,
      parallel: isParallel,

      hp: card.hp ?? null,
      power: card.power ?? null,
      guard: card.guard ?? null,
      energy: card.energy ?? null,

      type: card.type ?? "",
      actionSkill: card.actionSkill ?? "",
      acquisition: card.acquisition ?? "",

      series: card.series ?? getSeries(card.id),

      owned: Number(card.owned ?? 0),
      unopened: card.unopened ?? false,
      wanted: card.wanted ?? false,
      memo: card.memo ?? "",
      checked: card.checked ?? false,
    };
  });

  fs.writeFileSync(
    path.join(__dirname, "../cards.json"),
    JSON.stringify(output, null, 4),
    "utf8",
  );
}

module.exports = writeJson;
