// const fs = require("fs");
const path = require("path");

const { readStatus } = require("./statusReader");
const { stopOCR } = require("./ocrClient");

function normalizeStatus(value) {

    if (value == null) {
        return value;
    }

    return Math.floor(value / 100) * 100;

}

async function main(cards) {

    const startTime = Date.now();

    const failedCards = [];

    const totalCards = cards.length;

    try {

        for (let i = 0; i < totalCards; i++) {

            const card = cards[i];

            // 表面
            const frontImagePath = path.join(
                __dirname,
                "../images/front",
                card.imageFile
            );

            if (
    i === 0 ||
    (i + 1) % 10 === 0 ||
    i === totalCards - 1
) {
    console.log(`${i + 1} / ${totalCards}`);
}

            try {

                // HP・Power・Guard

const status = await readStatus(frontImagePath);

// エナジー
// const energy = await readEnergy(
//     frontImagePath,
//     energyArea);

const energy = status.energy;

// 補正
const hp = normalizeStatus(status.hp);
const power = normalizeStatus(status.power);
const guard = normalizeStatus(status.guard);

// HP
if (hp >= 1000 && hp <= 9999) {

    if (status.hp !== hp) {
        console.log(`補正 HP    : ${card.id} ${status.hp} → ${hp}`);
    }

    card.hp = hp;

}

// Power
if (power >= 1000 && power <= 9999) {

    if (status.power !== power) {
        console.log(`補正 Power : ${card.id} ${status.power} → ${power}`);
    }

    card.power = power;

}

// Guard
if (guard >= 1000 && guard <= 9999) {

    if (status.guard !== guard) {
        console.log(`補正 Guard : ${card.id} ${status.guard} → ${guard}`);
    }

    card.guard = guard;

}

// Energy
if (energy != null) {
    card.energy = energy;
}

            } catch (err) {

                failedCards.push(card.id);

                console.error(`❌ ${card.id}`, err.message);

            }

        }

    } finally {

        stopOCR();

    }

    const elapsed = (
        (Date.now() - startTime) / 1000
    ).toFixed(1);

    console.log("==============================");
    console.log("🎉 カード情報の読み取り完了！");
    console.log(`成功 : ${totalCards - failedCards.length}枚`);
    console.log(`失敗 : ${failedCards.length}枚`);
    console.log(`処理時間 : ${elapsed}秒`);

    if (failedCards.length > 0) {

        console.log("");
        console.log("失敗したカード");

        failedCards.forEach(id =>
            console.log(`・${id}`)
        );

    }

console.log("==============================");

}

module.exports = main;