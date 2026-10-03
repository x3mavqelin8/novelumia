function getCollectionStats(series = null) {
  const targetCards = series
    ? cards.filter((card) => card.series === series)
    : cards;

  const owned = targetCards.filter((card) => card.owned).length;

  const total = targetCards.length;

  const percent = total === 0 ? 0 : (owned / total) * 100;

  return {
    owned,
    total,
    percent,
  };
}

function renderCollection() {
  const container = document.getElementById("collectionCards");

  const stats = getCollectionStats();

  const seriesList = [...new Set(cards.map((card) => card.series))];

  seriesList.sort((a, b) => {
    const order = {
      "12弾": 12,
      "11弾": 11,
      "10弾": 10,
      "9弾": 9,
      "8弾": 8,
      "7弾": 7,
      "6弾": 6,
      "5弾": 5,
      "4弾": 4,
      "3弾": 3,
      "2弾": 2,
      "1弾": 1,
      ロケーションテスト: 0,
      プロモーションカード: -1,
    };

    return order[b] - order[a];
  });

  container.innerHTML = createCollectionCard("🌍 全体", stats);

  seriesList.forEach((series) => {
    const stats = getCollectionStats(series);

    container.innerHTML += createCollectionCard(
      series,
      stats,
      stats.percent === 100,
    );
  });
}

function getCollectionColor(percent) {
  if (percent === 0) {
    return "none";
  }

  if (percent >= 100) {
    return "complete";
  }

  if (percent >= 75) {
    return "green";
  }

  if (percent >= 50) {
    return "yellow";
  }

  if (percent >= 25) {
    return "orange";
  }

  return "red";
}

function createCollectionCard(title, stats, complete = false) {
  const colorClass = getCollectionColor(stats.percent);

  return `

        <div class="collection-card ${colorClass}" data-series="${title}">

            <div class="collection-header">

                <span class="collection-title">
                    ${title}
                </span>

                ${
                  complete
                    ? `<span class="collection-complete">👑 COMPLETE</span>`
                    : ""
                }

            </div>

            <progress
    class="progress-${colorClass}"
    value="${stats.percent}"
    max="100">
</progress>

            <div class="collection-footer">

                <span>${stats.percent.toFixed(1)}%</span>

                <span>${stats.owned} / ${stats.total}枚</span>

            </div>

            <div class="collection-detail-area"></div>

        </div>

    `;
}

function getRarityStats(series) {
  const targetCards = cards.filter((card) => card.series === series);

  const rarities = ["SEC", "PUR", "EXR", "GDR", "SR", "R", "N"];

  return rarities.map((rarity) => {
    const rarityCards = targetCards.filter((card) => card.rarity === rarity);

    const owned = rarityCards.filter((card) => card.owned).length;

    return {
      rarity,
      owned,
      total: rarityCards.length,
    };
  });
}

document.addEventListener("click", (e) => {
  const card = e.target.closest(".collection-card");

  if (!card) return;

  const series = card.dataset.series;

  if (series === "🌍 全体") return;

  const detail = card.querySelector(".collection-detail-area");

  if (detail.innerHTML) {
    detail.innerHTML = "";
    return;
  }

  const rarityStats = getRarityStats(series);

  detail.innerHTML = `
    <h3>${series}</h3>

    ${rarityStats
      .map(
        (item) => `

    <div class="rarity-detail">

        <span>
            ${item.rarity}
        </span>

        <span>
            ${item.owned} / ${item.total}枚
        </span>

    </div>

`,
      )
      .join("")}
`;
});
