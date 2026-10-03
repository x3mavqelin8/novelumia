async function scrape(page, series) {

    await page.goto(
        `https://www.dbsdv.com/cardlist/?series=${series}`,
        {
            waitUntil: "networkidle"
        }
    );

    await page.waitForSelector(".cardlistImgCol");

    const cards = await page.$$eval(".cardlistImgCol", items => {

        return items
            .map(item => {

                const img = item.querySelector("img");

                if (!img) {
                    return null;
                }

                const modal = document.querySelector(item.dataset.src);

                if (!modal) {
                    return null;
                }

                const backImg = modal.querySelector(".img-back img");

                if (!backImg) {
                    return null;
                }

                const rarity =
                    modal.querySelector(".cardData_rarity")?.textContent.trim() ?? "";

                const acquisition =
                    [...modal.querySelectorAll(".cardData_infoInner")]
                        .find(item =>
                            item.querySelector(".cardData_infoTit")?.textContent.trim() === "入手情報"
                        )
                        ?.querySelector(".cardData_infoTxt")
                        ?.textContent.trim();

                if (!img.alt) {
                    return null;
                }

                const parts = img.alt.split(" ");

                if (!img.dataset.src) {
                    return null;
                }

                const imageFile =
                    img.dataset.src.split("/").pop().split("?")[0];

                return {

                    id: imageFile.replace(".webp", ""),

                    rarity,

                    name: parts.slice(1).join(" "),

                    ...(acquisition ? { acquisition } : {}),

                    image:
                        "https://www.dbsdv.com" + img.dataset.src,

                    imageFile,

                    backImage:
                        "https://www.dbsdv.com" + backImg.dataset.src,

                    backImageFile:
                        backImg.dataset.src.split("/").pop().split("?")[0],

                    owned: 0,
                    wanted: false,
                    memo: "",
                    checked: false

                };

            })
            .filter(Boolean);

    });

    return cards;

}

module.exports = scrape;