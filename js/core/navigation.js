const pages = [
  "cardsPage",
  "deckPage",
  "collectionPage",
  "unopenedPage",
  "masterPupilPage",
  "settingsPage",
];

const tabs = [
  "tabCards",
  "tabDeck",
  "tabCollection",
  "tabUnopened",
  "tabMasterPupil",
  "tabSettings",
];

function showPage(pageId, tabId) {
  // 全ページをいったん非表示
  pages.forEach((id) => {
    const page = document.getElementById(id);

    if (page) {
      page.hidden = true;
    }
  });

  // 選択したページだけ表示
  const targetPage = document.getElementById(pageId);

  if (targetPage) {
    targetPage.hidden = false;
  }

  // タブのactive切り替え
  tabs.forEach((id) => {
    const tab = document.getElementById(id);

    if (tab) {
      tab.classList.toggle("active", id === tabId);
    }
  });

  // 各ページの再描画
  if (pageId === "collectionPage") {
    if (typeof renderCollection === "function") {
      renderCollection();
    }
  }

  if (pageId === "deckPage") {
    if (typeof renderDecks === "function") {
      renderDecks();
    }
  }

  if (pageId === "unopenedPage") {
    if (typeof renderUnopenedPacks === "function") {
      renderUnopenedPacks();
    }
  }

  if (pageId === "masterPupilPage") {
    if (typeof renderMasterPupil === "function") {
      renderMasterPupil();
    }
  }
}

// ==============================
// タブ
// ==============================

document.getElementById("tabCards")?.addEventListener("click", () => {
  showPage("cardsPage", "tabCards");
});

document.getElementById("tabDeck")?.addEventListener("click", () => {
  showPage("deckPage", "tabDeck");
});

document.getElementById("tabCollection")?.addEventListener("click", () => {
  showPage("collectionPage", "tabCollection");
});

document.getElementById("tabUnopened")?.addEventListener("click", () => {
  showPage("unopenedPage", "tabUnopened");
});

document.getElementById("tabMasterPupil")?.addEventListener("click", () => {
  showPage("masterPupilPage", "tabMasterPupil");
});

document.getElementById("tabSettings")?.addEventListener("click", () => {
  showPage("settingsPage", "tabSettings");
});

// ==============================
// 初期表示
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  showPage("cardsPage", "tabCards");
});
