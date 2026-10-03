const { chromium } = require("playwright");

(async () => {

    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto("https://www.dbsdv.com/cardlist/?series=598010");

    // ページの読み込み完了
    await page.waitForLoadState("networkidle");

    // カード一覧が表示されるまで待つ
    await page.waitForTimeout(5000);

    // カードが何枚あるか確認
    const count = await page.locator("a.cardlistImgCol").count();

    console.log("カード枚数:", count);

    if (count === 0) {
        console.log("カードが見つかりません！");
        await page.screenshot({ path: "debug.png", fullPage: true });
        return;
    }

    // 最初のカードをクリック
    await page.locator("a.cardlistImgCol").first().click({ force: true });

    // モーダルが開くまで待つ
    await page.waitForTimeout(3000);

    console.log("クリック成功！");

    console.log(await page.content());

})();