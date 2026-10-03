const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const OUTPUT_FILE = path.join(__dirname, "../cards.json");

const files = fs
  .readdirSync(DATA_DIR)
  .filter((file) => file.endsWith(".json"))
  .sort();

const allCards = [];

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  const cards = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!Array.isArray(cards)) {
    throw new Error(`${file} が配列形式ではありません`);
  }

  console.log(`${file}: ${cards.length}枚`);
  allCards.push(...cards);
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allCards, null, 2), "utf8");

console.log("");
console.log(`統合完了！ 合計 ${allCards.length}枚`);
console.log(`→ ${OUTPUT_FILE}`);
