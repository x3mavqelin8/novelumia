console.log("=== DBSDV Image Update Start ===");

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const https = require("https");
const sharp = require("sharp");

const SERIES_LIST = [
  // 598012, 598011, 598010, 598009, 598008, 598007, 598006, 598005, 598004, 598003,
  // 598002, 598001,
  598000,
];

const FRONT_DIR = path.join(__dirname, "../images/front");
const BACK_DIR = path.join(__dirname, "../images/back");
const THUMB_DIR = path.join(__dirname, "../images/thumb");

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      resolve(false);
      return;
    }

    const file = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          file.close();
          fs.unlinkSync(filePath);

          downloadFile(response.headers.location, filePath)
            .then(resolve)
            .catch(reject);

          return;
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(filePath);
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      })
      .on("error", (error) => {
        file.close();

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        reject(error);
      });
  });
}

async function scrapeCards(page, series) {
  await page.goto(`https://www.dbsdv.com/cardlist/?series=${series}`, {
    waitUntil: "networkidle",
  });

  await page.waitForSelector(".cardlistImgCol");

  return await page.$$eval(".cardlistImgCol", (items) => {
    return items
      .map((item) => {
        const img = item.querySelector("img");

        if (!img || !img.alt || !img.dataset.src) {
          return null;
        }

        const modal = document.querySelector(item.dataset.src);

        if (!modal) {
          return null;
        }

        const backImg = modal.querySelector(".img-back img");

        if (!backImg || !backImg.dataset.src) {
          return null;
        }

        const parts = img.alt.split(" ");
        const imageFile = img.dataset.src.split("/").pop().split("?")[0];

        const backImageFile = backImg.dataset.src
          .split("/")
          .pop()
          .split("?")[0];

        return {
          id: imageFile.replace(".webp", ""),

          image: "https://www.dbsdv.com" + img.dataset.src,

          imageFile,

          backImage: "https://www.dbsdv.com" + backImg.dataset.src,

          backImageFile,
        };
      })
      .filter(Boolean);
  });
}

async function downloadImages(cards) {
  fs.mkdirSync(FRONT_DIR, { recursive: true });
  fs.mkdirSync(BACK_DIR, { recursive: true });

  let newCount = 0;
  let existingCount = 0;

  console.log("画像を確認しています...");

  for (const card of cards) {
    const frontPath = path.join(FRONT_DIR, card.imageFile);
    const backPath = path.join(BACK_DIR, card.backImageFile);

    const frontExists = fs.existsSync(frontPath);
    const backExists = fs.existsSync(backPath);

    if (frontExists && backExists) {
      existingCount++;
      continue;
    }

    if (!frontExists) {
      await downloadFile(card.image, frontPath);
    }

    if (!backExists) {
      await downloadFile(card.backImage, backPath);
    }

    newCount++;
  }

  console.log("\n画像ダウンロード完了！");
  console.log(`新規ダウンロード：${newCount}枚`);
  console.log(`既存画像　　　　：${existingCount}枚`);
}

async function createThumbnails() {
  fs.mkdirSync(THUMB_DIR, { recursive: true });

  const files = fs
    .readdirSync(FRONT_DIR)
    .filter((file) => file.toLowerCase().endsWith(".webp"));

  console.log(`\n${files.length}枚の画像を確認しています`);

  for (const file of files) {
    const inputPath = path.join(FRONT_DIR, file);
    const outputPath = path.join(THUMB_DIR, file);

    if (fs.existsSync(outputPath)) {
      continue;
    }

    await sharp(inputPath)
      .resize({ width: 150 })
      .webp({ quality: 80 })
      .toFile(outputPath);
  }

  console.log("サムネイルの生成が完了しました！");
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
    const cards = [];

    console.log("① 公式サイトからカード一覧取得");

    for (const series of SERIES_LIST) {
      const result = await scrapeCards(page, series);

      console.log(`${series}：${result.length}枚`);

      cards.push(...result);
    }

    console.log(`合計：${cards.length}枚`);

    console.log("\n② カード画像をダウンロード");

    await downloadImages(cards);

    console.log("\n③ サムネイルを作成");

    await createThumbnails();

    console.log(`
================================
🎉 完了！
画像ダウンロード＋サムネイル作成が完了しました。
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
