const scrape = require("./scrape");
const downloadImages = require("./downloadImages");

async function main(){

    const cards = await scrape("598009");

    console.log(`${cards.length}枚取得`);

    await downloadImages(cards);

    console.log("保存完了");

}

main();