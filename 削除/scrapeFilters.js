const BATTLE_TYPES = {
    "インパクト": "I",
    "ラッシュ": "R",
    "ブースト": "B",
    "リミテッド": "L"
};

const ACTION_SKILLS = {
    "覚醒": "覚醒",
    "超覚醒": "超覚醒",
    "巨大化": "巨大化",
    "トライバースト": "トライバースト",
    "ランページアタック": "ランページアタック",
    "栽培マン": "栽培マン",
    "バニッシュコンボ": "バニッシュコンボ",
    "ターゲティングボム": "ターゲティングボム",
    "一撃": "一撃",
    "カウンターアタック": "カウンターアタック",
    "チャージクラッシュ": "チャージクラッシュ",
    "リフレクトブレイク": "リフレクトブレイク"
};

async function applyFilter(
    page,
    cards,
    series,
    parameter,
    values,
    property
) {

    const cardMap = new Map(
        cards.map(card => [card.id, card])
    );

    for (const [label, value] of Object.entries(values)) {

        const params = new URLSearchParams({
            freewords: "",
            series: String(series),
            battleTypes:
                parameter === "battleTypes"
                    ? label
                    : "",
            rarities: "",
            actionSkills:
                parameter === "actionSkills"
                    ? label
                    : ""
        });

        await page.goto(
            `https://www.dbsdv.com/cardlist/?${params.toString()}`,
            {
                waitUntil: "networkidle"
            }
        );

        await page.waitForLoadState("networkidle");

        const ids = await page.$$eval(
            ".cardlistImgCol",
            items =>

                items
                    .map(item => {

                        const img =
                            item.querySelector("img");

                        if (!img?.dataset.src) {
                            return null;
                        }

                        return img.dataset.src
                            .split("/")
                            .pop()
                            .split("?")[0]
                            .replace(".webp", "");

                    })
                    .filter(Boolean)
        );

        for (const id of ids) {

            const card = cardMap.get(id);

            if (card) {
                card[property] = value;
            }

        }

    }

}

module.exports = {
    applyFilter,
    BATTLE_TYPES,
    ACTION_SKILLS
};