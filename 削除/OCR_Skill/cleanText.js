const corrections = {
  南い合う力: "補い合う力",
  堅手: "堅撃",
  堅革: "堅撃",
  ダメーヅ: "ダメージ",
  アクシヨン: "アクション",
  シヨン: "ション",
  パトル: "バトル",
  ランベージ: "ランページ",
  アタツカー: "アタッカー",
  メンパー: "メンバー",
  メンバ一: "メンバー",
  イーダブルバスターー: "ダブルバスター",
  政撃: "攻撃",
  政華: "攻撃",
  スビ一ド: "スピード",
  少レ: "少し",
  韓尚: "[毎回]",
  "自 分": "自分",
  ダメーヅ: "ダメージ",
  孫信夫: "孫悟飯",
  "15倍": "1.5倍",
  こ迅雷風烈破山: "迅雷風烈破",
  ラウソド: "ラウンド",
  ダメ一ヅ: "ダメージ",
  至員: "全員",
  運身の一ー降: "渾身の一撃・降臨",
  カのバニッシュコンボ: "力のバニッシュコンボ",
  " いちげ": "",
  いちげ: "",
  孫悟夫: "孫悟飯",

  "ガー ド": "ガード",
  "1回限リ": "1回限り",
  限リ: "限り",
};

function cleanText(text) {
  if (!text) return "";

  // 誤認識修正
  for (const [before, after] of Object.entries(corrections)) {
    text = text.replaceAll(before, after);
  }

  return (
    text

      // ふりがな除去
      .replace(/おきな\s*ちから\s*/g, "")
      .replace(/せんけつていし/g, "")
      .replace(/はつせ/g, "")
      .replace(/まいかし/g, "")
      .replace(/はウどつ/g, "")

      // OCR特有の分割修正
      .replace(/ガー\s*ド/g, "ガード")
      .replace(/\s1\s/g, "")
      .replace(/気\s*\[毎回\]\s*力/g, "気力")
      .replace(/自\s*してい\s*分/g, "自分")

      // 記号修正
      .replace(/\s+る/g, "る")
      .replace(/\./g, "。")
      .replace(/(\d+)。(\d+)/g, "$1.$2")
      .replace(/&/g, "＆")

      // 空白整理
      .replace(/\s+/g, " ")
      .trim()
  );
}

module.exports = cleanText;
