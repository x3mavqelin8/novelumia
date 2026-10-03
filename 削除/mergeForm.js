const fs = require("fs");
const path = require("path");

// ファイルの場所
const cardsPath = path.join(__dirname, "..", "cards.json");
const formPath = path.join(__dirname, "..", "form.json");

// JSONを読み込む
const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));
const forms = JSON.parse(fs.readFileSync(formPath, "utf8"));

// id → form の対応表を作る
const formMap = new Map(forms.map((item) => [item.id, item.form]));

// formをcards.jsonへ追加
let updatedCount = 0;
let missingCount = 0;

const updatedCards = cards.map((card) => {
  const newCard = {
    id: card.id,
    name: card.name,
  };

  if (formMap.has(card.id)) {
    newCard.form = formMap.get(card.id);
    updatedCount++;
  } else if (card.form !== undefined) {
    newCard.form = card.form;
  }

  Object.entries(card).forEach(([key, value]) => {
    if (key !== "id" && key !== "name" && key !== "form") {
      newCard[key] = value;
    }
  });

  return newCard;
});

// cards.jsonに存在しないidを確認
forms.forEach((item) => {
  if (!cards.some((card) => card.id === item.id)) {
    console.log(`⚠ cards.jsonに見つかりません: ${item.id}`);
    missingCount++;
  }
});

// 新しいcards.jsonとして保存
const outputPath = path.join(__dirname, "..", "new_cards.json");

fs.writeFileSync(
  outputPath,
  JSON.stringify(updatedCards, null, 2) + "\n",
  "utf8",
);

console.log(`\n✅ form追加完了`);
console.log(`追加・更新: ${updatedCount}件`);
console.log(`見つからないID: ${missingCount}件`);
