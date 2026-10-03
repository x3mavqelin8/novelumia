const sharp = require("sharp");

const inputImage = "images/back/AP-029_b.webp";

const crops = {
  specialMove: {
    left: 50,
    top: 390,
    width: 450,
    height: 60,
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
    top: 579,
    width: 229,
    height: 30,
  },

  actionSkillText: {
    left: 118,
    top: 606,
    width: 450,
    height: 130,
  },

  unitSkillName: {
    left: 117,
    top: 737,
    width: 218,
    height: 25,
  },

  unitSkillTarget: {
    left: 337,
    top: 736,
    width: 216,
    height: 28,
  },

  unitSkillText: {
    left: 116,
    top: 769,
    width: 452,
    height: 69,
  },
};

async function cropSkill() {
  for (const [name, area] of Object.entries(crops)) {
    await sharp(inputImage)
      .extract(area)
      .webp({
        quality: 90,
      })
      .toFile(`OCR_Skill/${name}.webp`);

    console.log(`${name} 完了`);
  }
}

cropSkill().catch((err) => {
  console.error(err);
});
