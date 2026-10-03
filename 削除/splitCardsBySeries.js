const fs = require("fs");
const path = require("path");

// 元データ
const inputPath = path.join(__dirname, "..", "cards.json");

// 出力先
const outputDir = path.join(__dirname, "..", "data");

// cards.jsonを読み込む
const cards = JSON.parse(fs.readFileSync(inputPath, "utf8"));

// dataフォルダを作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 弾ごとに分類
const groups = {};

for (const card of cards) {
  const series = card.series || "その他";

  if (!groups[series]) {
    groups[series] = [];
  }

  groups[series].push(card);
}

// ファイル名を決める
function getFileName(series) {
  const match = series.match(/(\d+)弾/);

  if (match) {
    return `SDV${match[1].padStart(2, "0")}.json`;
  }

  if (series.includes("プロモ")) {
    return "PROMO.json";
  }

  return "OTHER.json";
}

// 書き出し
for (const [series, seriesCards] of Object.entries(groups)) {
  const fileName = getFileName(series);
  const outputPath = path.join(outputDir, fileName);

  fs.writeFileSync(outputPath, JSON.stringify(seriesCards, null, 2), "utf8");

  console.log(`${fileName}: ${seriesCards.length}枚`);
}

console.log("\n分割完了！");
