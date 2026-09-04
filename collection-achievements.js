/* =====================================================
   STRAY - SHEPHERD'S CACHE
   DYNAMIC SERIES ACHIEVEMENTS + COLLAPSIBLE BOTTOM PANELS
   ===================================================== */

"use strict";

let shepherdAchievementsPanel = null;
let shepherdAchievementsGrid = null;
let shepherdAchievementsSummary = null;
let shepherdAchievementRenderTimer = null;

function injectShepherdAchievementStyles() {
  if (document.getElementById("shepherd-cache-achievement-styles")) return;

  const style = document.createElement("style");
  style.id = "shepherd-cache-achievement-styles";

  style.textContent = `
    #collection-stats,
    #shepherd-achievements {
      position: relative;
      z-index: 3;
      margin: 14px 0 0;
      padding: 0;
      overflow: hidden;
      border: 1px solid rgba(154,116,70,.28);
      border-radius: 12px;
      background: radial-gradient(circle at 50% 0%, rgba(116,101,140,.09), transparent 65%), rgba(10,11,12,.46);
    }

    .cache-bottom-toggle {
      appearance: none;
      width: 100%;
      min-height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 13px 15px;
      border: 0;
      background: rgba(13,14,15,.40);
      color: inherit;
      cursor: pointer;
      text-align: left;
    }

    .cache-bottom-toggle:hover {
      background: rgba(116,101,140,.10);
    }

    .cache-bottom-toggle-left {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .cache-bottom-toggle-title {
      color: #9a7446;
      font-family: "Cinzel", serif;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2.2px;
    }

    .cache-bottom-toggle-subtitle {
      color: rgba(191,180,157,.68);
      font-size: 8px;
      font-weight: 700;
      letter-spacing: .8px;
    }

    .cache-bottom-toggle-right {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cache-bottom-toggle-summary {
      color: #bfb49d;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1px;
      white-space: nowrap;
    }

    .cache-bottom-toggle-summary strong {
      color: #b88cff;
      font-family: "Cinzel", serif;
      font-size: 11px;
    }

    .cache-bottom-toggle-chevron {
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(154,116,70,.34);
      border-radius: 50%;
      color: #bfb49d;
      font-size: 15px;
      font-weight: 700;
      transition: transform .22s ease;
    }

    .cache-bottom-toggle[aria-expanded="true"] .cache-bottom-toggle-chevron {
      transform: rotate(180deg);
    }

    .cache-bottom-collapse-body {
      padding: 0 15px 15px;
      border-top: 1px solid rgba(154,116,70,.15);
    }

    .cache-bottom-collapse-body[hidden] {
      display: none !important;
    }

    #collection-stats-title {
      display: none !important;
    }

    #collection-stats #collection-stats-grid {
      margin-top: 14px;
    }

    #shepherd-achievements-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
      margin-top: 14px;
    }

    .shepherd-achievement {
      min-width: 0;
      min-height: 135px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 8px 10px;
      border: 1px solid rgba(231,221,200,.08);
      border-radius: 10px;
      background: rgba(13,14,15,.62);
      text-align: center;
    }

    .shepherd-achievement.is-unlocked {
      border-color: rgba(154,116,70,.46);
      background: radial-gradient(circle at 50% 0%, rgba(154,116,70,.10), transparent 60%), rgba(20,19,18,.72);
    }

    .shepherd-achievement.is-locked {
      opacity: .42;
      filter: grayscale(.72);
    }

    .shepherd-achievement-seal {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 9px;
      border: 1px solid rgba(154,116,70,.38);
      border-radius: 50%;
      color: rgba(191,180,157,.72);
      font-family: "Cinzel", serif;
      font-size: 13px;
      font-weight: 800;
    }

    .shepherd-achievement.is-unlocked .shepherd-achievement-seal {
      border-color: rgba(154,116,70,.76);
      color: #e7ddc8;
    }

    .shepherd-achievement.is-legendary.is-unlocked .shepherd-achievement-seal {
      border-color: rgba(184,140,255,.78);
      color: #b88cff;
      box-shadow: 0 0 16px rgba(184,140,255,.13);
    }

    .shepherd-achievement-name {
      color: #bfb49d;
      font-family: "Cinzel", serif;
      font-size: 8px;
      font-weight: 800;
      line-height: 1.25;
      letter-spacing: .8px;
    }

    .shepherd-achievement.is-unlocked .shepherd-achievement-name {
      color: #e7ddc8;
    }

    .shepherd-achievement.is-legendary.is-unlocked .shepherd-achievement-name {
      color: #b88cff;
    }

    .shepherd-achievement-description {
      margin-top: 6px;
      color: rgba(191,180,157,.68);
      font-size: 7px;
      font-weight: 600;
      line-height: 1.35;
    }

    .shepherd-achievement-status {
      margin-top: auto;
      padding-top: 8px;
      color: rgba(154,116,70,.75);
      font-size: 7px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    @media (max-width: 900px) {
      #shepherd-achievements-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 620px) {
      .cache-bottom-toggle {
        padding: 12px;
      }

      .cache-bottom-collapse-body {
        padding: 0 11px 11px;
      }
    }
  `;

  document.head.appendChild(style);
}

function getAchievementDefinitions() {
  if (typeof getCurrentSeriesAchievements === "function") {
    const configured = getCurrentSeriesAchievements();

    if (Array.isArray(configured) && configured.length > 0) {
      return configured;
    }
  }

  const total =
    typeof getSeriesTotalItems === "function"
      ? getSeriesTotalItems()
      : 0;

  return [
    {
      id: "first-relic",
      title: "FIRST RELIC",
      description: "Discover your first relic.",
      symbol: "I",
      type: "unique",
      required: 1
    },
    {
      id: "series-complete",
      title: "SERIES COMPLETE",
      description: "Recover every relic in this series.",
      symbol: "IX",
      type: "unique",
      required: total,
      legendary: true
    }
  ];
}

function getAchievementUniqueCount() {
  if (
    typeof currentCollection !== "undefined" &&
    currentCollection &&
    typeof getSafeUniqueCount === "function"
  ) {
    return getSafeUniqueCount(currentCollection);
  }

  return 0;
}

function getAchievementRarityCount(rarity) {
  if (
    typeof currentCollection !== "undefined" &&
    currentCollection &&
    typeof getUniqueByRarity === "function"
  ) {
    return getUniqueByRarity(currentCollection, rarity);
  }

  return 0;
}

function isAchievementUnlocked(achievement) {
  if (!achievement) return false;

  if (achievement.type === "unique") {
    return getAchievementUniqueCount() >= Number(achievement.required || 0);
  }

  if (achievement.type === "rarity") {
    return getAchievementRarityCount(String(achievement.rarity || "")) >=
      Number(achievement.required || 0);
  }

  return false;
}

function getAchievementProgress(achievement) {
  const required = Math.max(0, Number(achievement.required || 0));

  if (achievement.type === "unique") {
    return Math.min(getAchievementUniqueCount(), required) + " / " + required;
  }

  if (achievement.type === "rarity") {
    return Math.min(
      getAchievementRarityCount(String(achievement.rarity || "")),
      required
    ) + " / " + required;
  }

  return "";
}

function createAchievementCard(achievement) {
  const unlocked = isAchievementUnlocked(achievement);
  const card = document.createElement("article");

  card.className =
    "shepherd-achievement " +
    (unlocked ? "is-unlocked" : "is-locked");

  if (achievement.legendary === true) {
    card.classList.add("is-legendary");
  }

  card.dataset.achievement = String(achievement.id || "");

  const symbol = String(achievement.symbol || "•");
  const title = String(achievement.title || "ACHIEVEMENT");
  const description = String(achievement.description || "");

  card.innerHTML = `
    <div class="shepherd-achievement-seal">${symbol}</div>
    <div class="shepherd-achievement-name">${title}</div>
    <div class="shepherd-achievement-description">${description}</div>
    <div class="shepherd-achievement-status">
      ${unlocked ? "UNLOCKED" : getAchievementProgress(achievement)}
    </div>
  `;

  return card;
}

function toggleCollapseSection(toggle, body) {
  if (!toggle || !body) return;

  const expanded = toggle.getAttribute("aria-expanded") === "true";

  toggle.setAttribute(
    "aria-expanded",
    expanded ? "false" : "true"
  );

  body.hidden = expanded;
}

function createShepherdAchievementsPanel() {
  if (shepherdAchievementsPanel) return;

  injectShepherdAchievementStyles();

  shepherdAchievementsPanel = document.createElement("section");
  shepherdAchievementsPanel.id = "shepherd-achievements";

  shepherdAchievementsPanel.innerHTML = `
    <button
      class="cache-bottom-toggle"
      id="shepherd-achievements-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="shepherd-achievements-body"
    >
      <span class="cache-bottom-toggle-left">
        <span class="cache-bottom-toggle-title">CACHE ACHIEVEMENTS</span>

        <span
          class="cache-bottom-toggle-subtitle"
          id="shepherd-achievements-subtitle"
        >
          Series milestones and collection badges
        </span>
      </span>

      <span class="cache-bottom-toggle-right">
        <span
          class="cache-bottom-toggle-summary"
          id="shepherd-achievements-summary"
        >
          <strong>0</strong> / 0
        </span>

        <span
          class="cache-bottom-toggle-chevron"
          aria-hidden="true"
        >
          ⌄
        </span>
      </span>
    </button>

    <div
      class="cache-bottom-collapse-body"
      id="shepherd-achievements-body"
      hidden
    >
      <div id="shepherd-achievements-grid"></div>
    </div>
  `;

  shepherdAchievementsGrid =
    shepherdAchievementsPanel.querySelector(
      "#shepherd-achievements-grid"
    );

  shepherdAchievementsSummary =
    shepherdAchievementsPanel.querySelector(
      "#shepherd-achievements-summary"
    );

  const toggle =
    shepherdAchievementsPanel.querySelector(
      "#shepherd-achievements-toggle"
    );

  const body =
    shepherdAchievementsPanel.querySelector(
      "#shepherd-achievements-body"
    );

  toggle.addEventListener(
    "click",
    () => {
      toggleCollapseSection(
        toggle,
        body
      );
    }
  );

  placeBottomPanels();
}

function prepareStatisticsCollapse() {
  const stats =
    document.getElementById(
      "collection-stats"
    );

  if (
    !stats ||
    stats.dataset.collapseReady === "true"
  ) {
    return;
  }

  stats.dataset.collapseReady =
    "true";

  const oldTitle =
    stats.querySelector(
      "#collection-stats-title"
    );

  if (oldTitle) {
    oldTitle.style.display =
      "none";
  }

  const body =
    document.createElement(
      "div"
    );

  body.id =
    "collection-stats-collapse-body";

  body.className =
    "cache-bottom-collapse-body";

  body.hidden =
    true;

  for (
    const child
    of Array.from(stats.children)
  ) {
    if (
      child !== oldTitle
    ) {
      body.appendChild(
        child
      );
    }
  }

  const toggle =
    document.createElement(
      "button"
    );

  toggle.type =
    "button";

  toggle.id =
    "collection-stats-toggle";

  toggle.className =
    "cache-bottom-toggle";

  toggle.setAttribute(
    "aria-expanded",
    "false"
  );

  toggle.setAttribute(
    "aria-controls",
    "collection-stats-collapse-body"
  );

  toggle.innerHTML = `
    <span class="cache-bottom-toggle-left">
      <span class="cache-bottom-toggle-title">
        COLLECTION STATISTICS
      </span>

      <span class="cache-bottom-toggle-subtitle">
        Pull rates, rarity totals, and collection performance
      </span>
    </span>

    <span class="cache-bottom-toggle-right">
      <span
        class="cache-bottom-toggle-summary"
        id="collection-stats-toggle-summary"
      >
        <strong>0</strong> / 0
      </span>

      <span
        class="cache-bottom-toggle-chevron"
        aria-hidden="true"
      >
        ⌄
      </span>
    </span>
  `;

  toggle.addEventListener(
    "click",
    () => {
      toggleCollapseSection(
        toggle,
        body
      );
    }
  );

  stats.insertBefore(
    toggle,
    stats.firstChild
  );

  stats.appendChild(
    body
  );
}

function placeBottomPanels() {
  const sections =
    document.getElementById(
      "collection-sections"
    );

  if (
    !sections ||
    !sections.parentNode
  ) {
    return;
  }

  const parent =
    sections.parentNode;

  const stats =
    document.getElementById(
      "collection-stats"
    );

  if (stats) {
    parent.insertBefore(
      stats,
      sections.nextSibling
    );
  }

  if (shepherdAchievementsPanel) {
    if (
      stats &&
      stats.parentNode === parent
    ) {
      parent.insertBefore(
        shepherdAchievementsPanel,
        stats.nextSibling
      );
    } else {
      parent.insertBefore(
        shepherdAchievementsPanel,
        sections.nextSibling
      );
    }
  }
}

function renderShepherdAchievements() {
  const book =
    document.getElementById(
      "collection-book"
    );

  if (
    !book ||
    book.hidden
  ) {
    if (shepherdAchievementsPanel) {
      shepherdAchievementsPanel.style.display =
        "none";
    }

    return;
  }

  createShepherdAchievementsPanel();
  prepareStatisticsCollapse();
  placeBottomPanels();

  shepherdAchievementsPanel.style.display =
    "";

  shepherdAchievementsGrid.innerHTML =
    "";

  const definitions =
    getAchievementDefinitions();

  let unlockedCount =
    0;

  for (
    const achievement
    of definitions
  ) {
    if (
      isAchievementUnlocked(
        achievement
      )
    ) {
      unlockedCount++;
    }

    shepherdAchievementsGrid.appendChild(
      createAchievementCard(
        achievement
      )
    );
  }

  shepherdAchievementsSummary.innerHTML =
    "<strong>" +
    unlockedCount +
    "</strong> / " +
    definitions.length;

  const total =
    typeof getSeriesTotalItems === "function"
      ? getSeriesTotalItems()
      : 0;

  const statsSummary =
    document.getElementById(
      "collection-stats-toggle-summary"
    );

  if (statsSummary) {
    statsSummary.innerHTML =
      "<strong>" +
      getAchievementUniqueCount() +
      "</strong> / " +
      total;
  }

  const subtitle =
    shepherdAchievementsPanel.querySelector(
      "#shepherd-achievements-subtitle"
    );

  if (
    subtitle &&
    typeof currentSeries !== "undefined" &&
    currentSeries
  ) {
    subtitle.textContent =
      String(
        currentSeries.series_name ||
        currentSeries.series_id ||
        ""
      ) +
      " milestones and collection badges";
  }
}

function queueShepherdAchievementRender() {
  window.clearTimeout(
    shepherdAchievementRenderTimer
  );

  shepherdAchievementRenderTimer =
    window.setTimeout(
      renderShepherdAchievements,
      80
    );
}

window.addEventListener(
  "shepherd-cache:series-rendered",
  queueShepherdAchievementRender
);

const shepherdAchievementBook =
  document.getElementById(
    "collection-book"
  );

if (shepherdAchievementBook) {
  const observer =
    new MutationObserver(
      queueShepherdAchievementRender
    );

  observer.observe(
    shepherdAchievementBook,
    {
      attributes: true,
      attributeFilter: [
        "hidden",
        "class"
      ]
    }
  );
}

injectShepherdAchievementStyles();
createShepherdAchievementsPanel();
prepareStatisticsCollapse();
placeBottomPanels();
queueShepherdAchievementRender();