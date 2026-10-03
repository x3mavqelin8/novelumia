const sharp = require("sharp");
const path = require("path");

const inputImage = process.argv[2];

if (!inputImage) {
  console.error("画像指定なし");
  process.exit(1);
}

const outputDir = "OCR_Skill";

const crops = {
  specialMove: {
    left: 68,
    top: 400,
    width: 426,
    height: 32,
  },

  skillName: {
    left: 110,
    top: 438,
    width: 235,
    height: 37,
  },

  skillText: {
    left: 9,
    top: 475,
    width: 560,
    height: 105,
  },

  actionSkillName: {
    left: 117,
    top: 570,
    width: 350,
    height: 55,
  },

  unitSkillName: {
    left: 121,
    top: 734,
    width: 220,
    height: 33,
  },

  unitSkillTarget: {
    left: 330,
    top: 730,
    width: 250,
    height: 45,
  },

  unitSkillText: {
    left: 50,
    top: 760,
    width: 520,
    height: 80,
  },
};

async function cropSkill() {
  for (const [name, area] of Object.entries(crops)) {
    await sharp(inputImage)
      .extract(area)
      .webp({
        quality: 90,
      })
      .toFile(path.join(outputDir, `${name}.webp`));

    console.log(`${name} 完了`);
  }
}

cropSkill().catch((err) => {
  console.error(err);
});
