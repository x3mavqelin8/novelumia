const path = require("path");
const fs = require("fs");

const downloadImages = require("./downloadCardImages");
const createThumbnails = require("./create-thumbnails");

const cards = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../cards.json"), "utf8"),
);

async function run() {
  console.log("📥 カード画像をダウンロード中...");

  const downloaded = await downloadImages(cards);

  console.log("\n🖼️ サムネイルを作成中...");

  await createThumbnails();

  if (downloaded > 0) {
    console.log("\n🔄 バージョンを更新中...");

    require("./release");
  }

  console.log("\n✅ 完了");
}

run().catch(console.error);
