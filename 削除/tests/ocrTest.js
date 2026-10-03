const path = require("path");
const { readStatus } = require("./ocr");

async function main() {

    const imagePath = path.join(
        "images",
        "back",
        "SDV10-061_b.webp"
    );

const status = await readStatus(imagePath);

console.log(status);

}

main();