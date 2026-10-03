const {
    hpArea,
    powerArea,
    guardArea,
    energyArea
} = require("./ocrAreas");

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const { readOCR } = require("./ocrClient");

const KERNEL = sharp.kernel.lanczos3;

const SCALE = {
    hp: 6,
    power: 6,
    guard: 6,
    energy: 10
};

const areas = [
    {
        name: "hp",
        area: hpArea
    },
    {
        name: "power",
        area: powerArea
    },
    {
        name: "guard",
        area: guardArea
    },
    {
        name: "energy",
        area: energyArea
    }
];

async function readStatus(imagePath) {

    const imagePaths = [];

    for (const item of areas) {

    const filePath = path.join(
            __dirname,
            "temp",
            `${path.parse(imagePath).name}_${item.name}.png`
    );

    await sharp(imagePath)
        .extract(item.area)
        .grayscale()
        .normalize()
        .resize(
            item.area.width * SCALE[item.name],
            item.area.height * SCALE[item.name],
                        {
                kernel: KERNEL
            }
        )
        .toFile(filePath);

    imagePaths.push(filePath);

}
    const results = [];
    for (const imagePath of imagePaths) {

    const { result } = await readOCR(imagePath);

    // console.log("OCR RAW:", result);

results.push(Number(result));
}

const [hp, power, guard, energy] = results;

    const fixedHp =
    hp >= 10000
        ? Math.floor(hp / 100)
        : hp;

for (const imagePath of imagePaths) {
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

    return {
        hp: fixedHp,
        power,
        guard,
        energy
    };
}

module.exports = {
    readStatus
};