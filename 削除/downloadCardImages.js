const fs = require("fs");
const path = require("path");
const https = require("https");

const WAIT_MIN = 2000;
const WAIT_MAX = 4000;

const FRONT_DIR = path.join("images", "front");
const BACK_DIR = path.join("images", "back");

async function downloadImages(cards) {
  let downloaded = 0;
  let skipped = 0;

  console.log("画像を確認しています...");

  for (const card of cards) {
    const filePath = path.join(FRONT_DIR, `${card.id}.webp`);

    const backFilePath = path.join(BACK_DIR, `${card.id}_b.webp`);

    const frontExists = fs.existsSync(filePath);
    const backExists = fs.existsSync(backFilePath);

    if (frontExists && backExists) {
      skipped++;
      continue;
    }

    downloaded++;

    const wait = WAIT_MIN + Math.random() * (WAIT_MAX - WAIT_MIN);

    console.log(
      `[${downloaded}/${cards.length}] ${card.id} をダウンロード中...`,
    );

    await new Promise((resolve) => setTimeout(resolve, wait));

    await downloadFile(
      `https://www.dbsdv.com/images/cardlist/card/${card.id}.webp`,
      filePath,
    );

    await downloadFile(
      `https://www.dbsdv.com/images/cardlist/card/${card.id}_b.webp`,
      backFilePath,
    );
  }

  console.log("");
  console.log("画像ダウンロード完了！");
  console.log(`新規ダウンロード：${downloaded}枚`);
  console.log(`既存画像　　　　：${skipped}枚`);
  console.log("");

  return downloaded;
}

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(filePath), {
      recursive: true,
    });

    const file = fs.createWriteStream(filePath);

    file.on("error", reject);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {});

        reject(err);
      });
  });
}

module.exports = downloadImages;
