console.log("=== DBSDV Update Start ===");

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const scrapeCards = require("./scrapeCards");
const { applyFilter, BATTLE_TYPES, ACTION_SKILLS } = require("./scrapeFilters");

const buildCardsJson = require("./buildCardsJson");
const downloadCardImages = require("./downloadCardImages");
const readCardData = require("./readCardData");

const versionPath = path.join(__dirname, "../version.json");

function loadVersion() {
  if (!fs.existsSync(versionPath)) {
    return {
      version: "0.1.0",
    };
  }

  return JSON.parse(fs.readFileSync(versionPath, "utf8"));
}

function saveVersion(version, addedCards) {
  const current = loadVersion();

  fs.writeFileSync(
    versionPath,
    JSON.stringify(
      {
        version,
        updated: new Date().toLocaleString("ja-JP"),
        addedCards,
        build: current.build ?? 0,
      },
      null,
      4,
    ),
    "utf8",
  );
}

function incrementVersion(version) {
  const parts = version.split(".").map(Number);

  parts[2]++;

  return parts.join(".");
}

// 更新対象シリーズ（新しい弾から順番）
const SERIES_LIST = [
  // 598011, 598010, 598009, 598008, 598007, 598006, 598005, 598004, 598003,
  // 598002, 598001,
  598000, 598901, 598012,
];

function getSeriesName(series) {
  if (series === 598901) {
    return "プロモーション";
  }

  if (series === 598000) {
    return "ロケーションテスト";
  }

  return `SDV${series - 598000}`;
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1280,
      height: 720,
    },
  });

  try {
    const cardsPath = path.join(__dirname, "../cards.json");

    const existingCards = fs.existsSync(cardsPath)
      ? JSON.parse(fs.readFileSync(cardsPath, "utf8"))
      : [];

    const cards = [];

    console.log("① カード一覧取得");

    for (const series of SERIES_LIST) {
      const seriesName = getSeriesName(series);

      const result = await scrapeCards(page, series);

      console.log(`${seriesName}：${result.length}枚`);

      cards.push(...result);

      await applyFilter(
        page,
        result,
        series,
        "battleTypes",
        BATTLE_TYPES,
        "type",
      );

      await applyFilter(
        page,
        result,
        series,
        "actionSkills",
        ACTION_SKILLS,
        "actionSkill",
      );
    }

    console.log(`合計：${cards.length}枚`);

    const existingIds = new Set(existingCards.map((card) => card.id));

    const newCards = cards.filter((card) => !existingIds.has(card.id));

    const normalCards = newCards.filter((card) => !/p_\d+$/.test(card.id));

    const parallelCards = newCards.filter((card) => /p_\d+$/.test(card.id));
    console.log(`新規カード：${newCards.length}枚`);

    let newVersion = null;

    if (newCards.length > 0) {
      const versionInfo = loadVersion();

      const oldVersion = versionInfo.version;
      newVersion = incrementVersion(oldVersion);

      console.log(`📦 Version ${oldVersion} → ${newVersion}`);

      console.log("② 画像ダウンロード");

      await downloadCardImages(newCards);

      console.log("③ OCR開始");

      await readCardData(normalCards);

      for (const parallel of parallelCards) {
        const normal = [...existingCards, ...normalCards].find(
          (card) => card.id === parallel.id.replace(/p_\d+$/, ""),
        );

        if (!normal) {
          continue;
        }

        parallel.hp = normal.hp;
        parallel.power = normal.power;
        parallel.guard = normal.guard;
        parallel.energy = normal.energy;

        parallel.type = normal.type;
        parallel.actionSkill = normal.actionSkill;
        parallel.specialMove = normal.specialMove;
        parallel.skill = normal.skill;
        parallel.initialKi = normal.initialKi;
      }
    } else {
      console.log("更新はありません。");
    }

    const allCards = [...existingCards, ...newCards];

    buildCardsJson(allCards);

    if (newCards.length > 0) {
      saveVersion(newVersion, newCards.length);
    }

    console.log(`
================================
🎉 更新完了！
Version : ${newVersion}
追加カード : ${newCards.length}枚
cards.json を更新しました。
================================
`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("❌ 更新失敗");
  console.error(error);
});
