const { spawn } = require("child_process");

const python = spawn("py", ["-3.12", "OCR_Skill/ocr_text_server.py"]);

const cleanText = require("./cleanText");

const images = {
  specialMove: "OCR_Skill/specialMove.webp",
  skillName: "OCR_Skill/skillName.webp",
  skillText: "OCR_Skill/skillText.webp",
  actionSkillName: "OCR_Skill/actionSkillName.webp",
  actionSkillText: "OCR_Skill/actionSkillText.webp",
  unitSkillName: "OCR_Skill/unitSkillName.webp",
  unitSkillTarget: "OCR_Skill/unitSkillTarget.webp",
  unitSkillText: "OCR_Skill/unitSkillText.webp",
};

function correctOCR(text) {
  return cleanText(text);
}

const results = {};

// Python OCR結果受信
python.stdout.on("data", (data) => {
  const lines = data.toString().trim().split("\n");

  for (const line of lines) {
    try {
      const json = JSON.parse(line);

      if (json.result !== undefined) {
        const current = Object.keys(results).find(
          (key) => results[key] === null,
        );

        if (current) {
          console.log("補正前:", json.result);

          results[current] = correctOCR(json.result);

          console.log("補正後:", results[current]);
        }
      }
    } catch (e) {
      console.log(line);
    }
  }
});

// OCRログ
python.stderr.on("data", (data) => {
  console.error(data.toString());
});

// 順番にOCR
async function runOCR() {
  for (const [name, image] of Object.entries(images)) {
    results[name] = null;

    python.stdin.write(
      JSON.stringify({
        image: image,
      }) + "\n",
    );

    await new Promise((resolve) => {
      const timer = setInterval(() => {
        if (results[name] !== null) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  }

  console.log(
    JSON.stringify(
      {
        results,
      },
      null,
      2,
    ),
  );

  python.stdin.end();
}

runOCR();
