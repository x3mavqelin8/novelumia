const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "../images/front");
const outputDir = path.join(__dirname, "../images/thumb");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function createThumbnails() {
  const files = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith(".webp"));

  console.log(`${files.length}枚の画像を確認しています`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    if (fs.existsSync(outputPath)) {
      continue;
    }

    await sharp(inputPath)
      .resize({
        width: 150,
      })
      .webp({
        quality: 80,
      })
      .toFile(outputPath);

    console.log(`完了: ${file}`);
  }

  console.log("サムネイルの生成が完了しました！");
}

module.exports = createThumbnails;
