const modal = document.getElementById("cardModal");

const countMinus = document.getElementById("countMinus");
const modalOwnedCount = document.getElementById("modalOwnedCount");
const countPlus = document.getElementById("countPlus");

const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalNumber = document.getElementById("modalNumber");
const modalRarity = document.getElementById("modalRarity");

const modalForm = document.getElementById("modalForm");

const modalType = document.getElementById("modalType");
const modalAttackType = document.getElementById("modalAttackType");

const modalHp = document.getElementById("modalHp");
const modalPower = document.getElementById("modalPower");

const modalPowerAwakened = document.getElementById("modalPowerAwakened");

const modalPowerAwakenedRow = document.getElementById("modalPowerAwakenedRow");

const modalGuard = document.getElementById("modalGuard");
const modalInitialKi = document.getElementById("modalInitialKi");
const modalEnergy = document.getElementById("modalEnergy");

const modalSpecialMove = document.getElementById("modalSpecialMove");

const modalSkillSection = document.getElementById("modalSkillSection");

const modalSkillName = document.getElementById("modalSkillName");

const modalSkillEffect = document.getElementById("modalSkillEffect");

const modalActionSection = document.getElementById("modalActionSection");

const modalActionName = document.getElementById("modalActionName");

const modalActionCategory = document.getElementById("modalActionCategory");

const modalActionEffect = document.getElementById("modalActionEffect");

const modalUnitSection = document.getElementById("modalUnitSection");

const modalUnitName = document.getElementById("modalUnitName");

const modalUnitCharacters = document.getElementById("modalUnitCharacters");

const modalUnitEffect = document.getElementById("modalUnitEffect");

const modalBuppaSection = document.getElementById("modalBuppaSection");

const modalBuppaName = document.getElementById("modalBuppaName");

const modalBuppaEffect = document.getElementById("modalBuppaEffect");

const modalSpecialRuleSection = document.getElementById(
  "modalSpecialRuleSection",
);

const modalSpecialRule = document.getElementById("modalSpecialRule");

const modalWanted = document.getElementById("modalWanted");
const modalUnopened = document.getElementById("modalUnopened");

const modalMistake = document.getElementById("modalMistake");

const modalAcquisition = document.getElementById("modalAcquisition");
const modalAcquisitionSection = document.getElementById(
  "modalAcquisitionSection",
);

const modalMemo = document.getElementById("modalMemo");

const closeModal = document.getElementById("closeModal");
const prevCardBtn = document.getElementById("prevCard");
const nextCardBtn = document.getElementById("nextCard");

let selectedCard = null;

let currentCard = null;

let currentCards = [];
let currentIndex = -1;

let showingFront = true;

const showFrontBtn = document.getElementById("showFront");
const showBackBtn = document.getElementById("showBack");

/* -------------------------
   モーダルを開く
------------------------- */

function showCardDetail(card, list = cards) {
  selectedCard = card;

  currentCard = card;

  currentIndex = window.currentVisibleCards
    ? window.currentVisibleCards.findIndex((c) => c.id === card.id)
    : cards.findIndex((c) => c.id === card.id);

  modalImage.src = showingFront
    ? `images/front/${currentCard.id}.webp`
    : `images/back/${currentCard.id}_b.webp`;

  showFrontBtn.disabled = showingFront;
  showBackBtn.disabled = !showingFront;

  modalName.textContent = card.name || "-";
  modalForm.textContent = card.form || "";

  document.getElementById("modalNumberMobile").textContent = card.id || "-";

  document.getElementById("modalOwnedCount").textContent = card.count ?? 0;

  modalRarity.textContent = `${card.parallel ? "★" : ""}${card.rarity || "-"}`;

  const typeData = {
    I: {
      name: "インパクト",
      color: "#2196f3",
    },
    B: {
      name: "ブースト",
      color: "#43a047",
    },
    R: {
      name: "ラッシュ",
      color: "#fb8c00",
    },
    L: {
      name: "リミテッド",
      color: "#b0b0b0",
    },
  };

  const type = typeData[card.type];

  if (type) {
    modalType.textContent = type.name;
    modalType.style.color = type.color;
  } else {
    modalType.textContent = "-";
    modalType.style.color = "";
  }

  modalAttackType.textContent = card.attackType || "-";

  modalHp.textContent = card.hp || "-";
  modalPower.textContent = card.power || "-";
  modalGuard.textContent = card.guard || "-";
  modalInitialKi.textContent = card.initialKi || "-";
  modalEnergy.textContent = card.energy || "-";

  if (card.powerAwakened !== null) {
    modalPowerAwakenedRow.style.display = "";

    modalPowerAwakened.textContent = card.powerAwakened;
  } else {
    modalPowerAwakenedRow.style.display = "none";
  }

  modalSpecialMove.textContent = card.specialMove || "-";

  // スキル
  if (card.skillName || card.skillEffect) {
    modalSkillSection.style.display = "";

    modalSkillName.textContent = card.skillName || "";
    modalSkillEffect.textContent = card.skillEffect || "";
  } else {
    modalSkillSection.style.display = "none";
  }

  // アクション
  if (card.actionName || card.actionCategory || card.actionEffect) {
    modalActionSection.style.display = "";

    modalActionName.textContent = card.actionName || "";
    modalActionCategory.textContent = card.actionCategory || "";
    modalActionEffect.textContent = card.actionEffect || "";
  } else {
    modalActionSection.style.display = "none";
  }

  // ユニット
  if (card.unitName || card.unitCharacters || card.unitEffect) {
    modalUnitSection.style.display = "";

    modalUnitName.textContent = card.unitName || "";

    modalUnitName.textContent = card.unitName || "";

    if (card.unitCharacters) {
      modalUnitCharacters.innerHTML = card.unitCharacters
        .split("/")
        .map((character) => {
          return `<span class="unit-chip">${character.trim()}</span>`;
        })
        .join("");
    } else {
      modalUnitCharacters.innerHTML = "";
    }

    modalUnitEffect.textContent = card.unitEffect || "";

    modalUnitEffect.textContent = card.unitEffect || "";
  } else {
    modalUnitSection.style.display = "none";
  }

  // ブッパ
  if (card.buppaName || card.buppaEffect) {
    modalBuppaSection.style.display = "";

    modalBuppaName.textContent = card.buppaName || "";
    modalBuppaEffect.textContent = card.buppaEffect || "";
  } else {
    modalBuppaSection.style.display = "none";
  }

  // 特殊ルール
  if (card.specialRule) {
    modalSpecialRuleSection.style.display = "";

    modalSpecialRule.textContent = card.specialRule;
  } else {
    modalSpecialRuleSection.style.display = "none";
  }

  modalWanted.checked = card.wanted ?? false;
  modalUnopened.checked = card.unopened ?? false;
  modalMistake.checked = card.mistake ?? false;

  if (card.acquisition) {
    modalAcquisitionSection.style.display = "";

    modalAcquisition.textContent = card.acquisition;
  } else {
    modalAcquisitionSection.style.display = "none";
  }

  modalMemo.value = card.memo ?? "";

  // レアリティ色
  modalRarity.className = "";

  if (card.rarity) {
    modalRarity.classList.add(`rarity-${card.rarity}`);
  }

  console.log("isDeckEditing =", isDeckEditing);

  modal.style.display = "flex";

  document.body.style.overflow = "hidden";

  modal.scrollTop = 0;

  modal.querySelector(".modal-content").scrollTop = 0;

  document.getElementById("cardCount").textContent =
    `${currentIndex + 1} / ${window.currentVisibleCards.length}枚`;
} //

/* -------------------------
   モーダルを閉じる
------------------------- */

function closeCardDetail() {
  modal.style.display = "none";

  document.body.style.overflow = "";
}

/* -------------------------
   イベント
------------------------- */

closeModal.addEventListener("click", closeCardDetail);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeCardDetail();
  }
});

document.addEventListener("keydown", (e) => {
  // モーダルが閉じていたら何もしない
  if (modal.style.display !== "flex") return;

  switch (e.key) {
    case "Escape":
      closeCardDetail();

      break;

    case "ArrowLeft":
      prevCardBtn.click();

      break;

    case "ArrowRight":
      nextCardBtn.click();

      break;
  }
});

/* -------------------------
   表示切り替え
------------------------- */

showFrontBtn.addEventListener("click", () => {
  if (!currentCard) return;

  showingFront = true;

  modalImage.src = `images/front/${currentCard.id}.webp`;

  showFrontBtn.disabled = true;
  showBackBtn.disabled = false;
});

showBackBtn.addEventListener("click", () => {
  if (!currentCard) return;

  showingFront = false;

  modalImage.src = `images/back/${currentCard.id}_b.webp`;

  showFrontBtn.disabled = false;
  showBackBtn.disabled = true;
});

countPlus.addEventListener("click", () => {
  if (!currentCard) return;

  currentCard.count = (currentCard.count ?? 0) + 1;
  currentCard.owned = currentCard.count > 0;

  modalOwnedCount.textContent = currentCard.count;

  if (currentCard.count > 0) {
    modalWanted.checked = false;
    currentCard.wanted = false;
  }

  saveCardData();

  updateCardListItem(currentCard);
  renderCollection();
});

countMinus.addEventListener("click", () => {
  if (!currentCard) return;

  if ((currentCard.count ?? 0) <= 0) return;

  currentCard.count--;

  currentCard.owned = currentCard.count > 0;

  modalOwnedCount.textContent = currentCard.count;

  saveCardData();

  updateCardListItem(currentCard);
  renderCollection();
});

/* -------------------------
   前のカード
------------------------- */

prevCardBtn.addEventListener("click", () => {
  if (currentIndex <= 0) {
    currentIndex = window.currentVisibleCards.length - 1;
  } else {
    currentIndex--;
  }

  showCardDetail(
    window.currentVisibleCards[currentIndex],
    window.currentVisibleCards,
  );
});

/* -------------------------
   次のカード
------------------------- */

nextCardBtn.addEventListener("click", () => {
  if (currentIndex >= window.currentVisibleCards.length - 1) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }

  showCardDetail(
    window.currentVisibleCards[currentIndex],
    window.currentVisibleCards,
  );
});
modalWanted.addEventListener("change", () => {
  if (!currentCard) return;

  // 所持中は「探している」にできない
  if (currentCard.owned && modalWanted.checked) {
    modalWanted.checked = false;
    return;
  }

  currentCard.wanted = modalWanted.checked;

  saveCardData();
});

modalMistake.addEventListener("change", () => {
  if (!currentCard) return;

  currentCard.mistake = modalMistake.checked;

  saveCardData();
});

modalUnopened.addEventListener("change", () => {
  if (!currentCard) return;

  currentCard.unopened = modalUnopened.checked;

  saveCardData();
  renderCards();
});

modalMemo.addEventListener("input", () => {
  if (!currentCard) return;

  currentCard.memo = modalMemo.value;

  saveCardData();
});
