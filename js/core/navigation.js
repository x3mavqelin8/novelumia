const pages = [
  "cardsPage",
  "deckPage",
  "recordPage",
  "collectionPage",
  "unopenedPage",
  "masterPupilPage",
  "avatarPage",
  "settingsPage",
];

const tabs = ["tabCards", "tabDeck", "tabCollection", "tabSettings"];

function setTopTabActive(tabId) {
  document.querySelectorAll(".top-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });
}

function showPage(pageId, tabId) {
  pages.forEach((id) => {
    const page = document.getElementById(id);
    if (page) page.hidden = true;
  });

  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.hidden = false;

  tabs.forEach((id) => {
    const tab = document.getElementById(id);
    if (tab) tab.classList.toggle("active", id === tabId);
  });

  setTopTabActive(tabId);

  if (pageId === "deckPage" && typeof renderDecks === "function") {
    renderDecks();

    const deckList = document.getElementById("deckList");
    if (deckList && deckList.children.length === 0) {
      deckList.innerHTML = `
        <div class="deck-empty-state">
          <div class="deck-empty-icon">🃏</div>
          <div class="deck-empty-title">まだデッキがありません</div>
          <div class="deck-empty-text">「＋ 新しいデッキ」から作成できます</div>
        </div>
      `;
    }

    const editorPage = document.getElementById("deckEditorPage");
    if (editorPage && !editorPage.hidden && typeof renderDeckCards === "function") {
      renderDeckCards();
    }
  }

  if (pageId === "collectionPage" && typeof renderCollection === "function") {
    renderCollection();
  }

  if (pageId === "unopenedPage" && typeof renderUnopenedPacks === "function") {
    renderUnopenedPacks();
  }

  if (pageId === "masterPupilPage" && typeof renderMasterPupil === "function") {
    renderMasterPupil();
  }
}

// 上部4タブ
function setupTopTabs() {
  document.querySelectorAll(".top-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const pageId = tab.dataset.page;
      const tabId = tab.dataset.tab;
      showPage(pageId, tabId);
    });
  });
}

// 下部ナビ（旧構成との互換用）
document.addEventListener("DOMContentLoaded", () => {
  const tabCards = document.getElementById("tabCards");
  const tabDeck = document.getElementById("tabDeck");
  const tabCollection = document.getElementById("tabCollection");
  const tabSettings = document.getElementById("tabSettings");

  if (tabCards) tabCards.addEventListener("click", () => showPage("cardsPage", "tabCards"));
  if (tabDeck) tabDeck.addEventListener("click", () => showPage("deckPage", "tabDeck"));
  if (tabCollection) tabCollection.addEventListener("click", () => showPage("recordPage", "tabCollection"));
  if (tabSettings) tabSettings.addEventListener("click", () => showPage("settingsPage", "tabSettings"));

  setupTopTabs();
  showPage("cardsPage", "tabCards");
});
