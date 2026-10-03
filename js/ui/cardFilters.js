// ============================================================
// キャラクター・形態検索
// カード一覧そのものの絞り込みは cardsPage.js が担当
// ============================================================

let selectedCharacterName = "";
let selectedForm = "";

const formSearchArea = document.getElementById("formSearchArea");
const formSearchSelect = document.getElementById("formSearchSelect");

const searchInput = document.getElementById("search");

// ------------------------------------------------------------
// キャラクター名検索
// ------------------------------------------------------------

searchInput?.addEventListener("input", () => {
  const keyword = searchInput.value.trim();

  // いったん形態検索をリセット
  selectedCharacterName = "";
  selectedForm = "";

  if (formSearchSelect) {
    formSearchSelect.innerHTML = `<option value="">形態を選択</option>`;
  }

  if (formSearchArea) {
    formSearchArea.hidden = true;
  }

  // カードデータがまだ読み込まれていなければ何もしない
  if (!Array.isArray(window.cards)) {
    return;
  }

  // 完全一致するキャラクター名を探す
  const forms = [
    ...new Set(
      window.cards
        .filter((card) => card.name === keyword && card.form)
        .map((card) => card.form),
    ),
  ];

  // 形態が存在する場合だけ形態選択を表示
  if (forms.length > 0) {
    selectedCharacterName = keyword;

    if (formSearchSelect) {
      formSearchSelect.innerHTML = `
        <option value="">形態を選択</option>
        ${forms
          .map((form) => `<option value="${form}">${form}</option>`)
          .join("")}
      `;
    }

    if (formSearchArea) {
      formSearchArea.hidden = false;
    }
  }

  // cardsPage.js に描画を任せる
  if (typeof renderCards === "function") {
    renderCards();
  }
});

// ------------------------------------------------------------
// 形態選択
// ------------------------------------------------------------

formSearchSelect?.addEventListener("change", () => {
  selectedForm = formSearchSelect.value;

  // cardsPage.js に描画を任せる
  if (typeof renderCards === "function") {
    renderCards();
  }
});

// ------------------------------------------------------------
// cardsPage.js から参照できるように公開
// ------------------------------------------------------------

window.getSelectedCharacterName = () => selectedCharacterName;
window.getSelectedForm = () => selectedForm;
