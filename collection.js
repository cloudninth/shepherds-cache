/* =====================================================
   STRAY - SHEPHERD'S CACHE
   PUBLIC COLLECTION - FINAL SERIES AWARE
   ===================================================== */

"use strict";

const CONFIG = window.ShepherdCacheConfig || {};
const SUPABASE_URL = String(CONFIG.supabaseUrl || "").trim().replace(/\/+$/, "");
const SUPABASE_PUBLISHABLE_KEY = String(CONFIG.supabasePublishableKey || "").trim();

const RARITY_ORDER = ["common", "uncommon", "rare", "legendary"];
const RARITY_NAMES = {
  common: "COMMON",
  uncommon: "UNCOMMON",
  rare: "RARE",
  legendary: "LEGENDARY"
};

const searchForm = document.getElementById("viewer-search-form");
const searchInput = document.getElementById("viewer-search-input");
const seriesSelect = document.getElementById("series-select");
const seriesCaption = document.getElementById("series-caption");
const statusElement = document.getElementById("page-status");
const collectionBook = document.getElementById("collection-book");
const viewerElement = document.getElementById("collection-book-viewer");
const totalPullsElement = document.getElementById("total-pulls-value");
const progressCountElement = document.getElementById("book-progress-count");
const progressFillElement = document.getElementById("book-progress-fill");
const progressMessageElement = document.getElementById("book-progress-message");
const sectionsElement = document.getElementById("collection-sections");
const lastUpdatedElement = document.getElementById("collection-last-updated");

let SERIES_CATALOG = [];
let COLLECTIBLES = [];
let currentSeries = null;
let currentCollection = null;
let currentStatusFilter = "all";
let currentRarityFilter = "all";
let filterToolbar = null;
let collectionSummary = null;
let statsPanel = null;
let shareButton = null;
let completionBanner = null;

function parseJsonValue(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "object") return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed == null ? fallback : parsed;
    } catch (error) {
      return fallback;
    }
  }

  return fallback;
}

function normalizeUsername(username) {
  return String(username || "").trim().replace(/^@/, "").toLowerCase();
}

function normalizeSeriesId(seriesId) {
  const value = String(seriesId || "").trim().toLowerCase();

  if (value === "1" || value === "series1" || value === "series-i") {
    return "series-1";
  }

  return value;
}

function setStatus(message, type = "") {
  if (!statusElement) return;
  statusElement.textContent = message || "";
  statusElement.className = type ? "status-" + type : "";
}

function setPageParams(username, seriesId) {
  const url = new URL(window.location.href);
  const cleanUsername = normalizeUsername(username);
  const cleanSeries = normalizeSeriesId(seriesId);

  if (cleanUsername) url.searchParams.set("user", cleanUsername);
  else url.searchParams.delete("user");

  if (cleanSeries) url.searchParams.set("series", cleanSeries);
  else url.searchParams.delete("series");

  window.history.replaceState({}, "", url);
}

function getPageUsername() {
  return normalizeUsername(new URLSearchParams(window.location.search).get("user"));
}

function getPageSeriesId() {
  return normalizeSeriesId(new URLSearchParams(window.location.search).get("series"));
}

async function rpc(name, body) {
  if (!SUPABASE_URL) throw new Error("Supabase Project URL is missing from config.js.");
  if (!SUPABASE_PUBLISHABLE_KEY) throw new Error("Supabase publishable key is missing from config.js.");

  const response = await fetch(
    SUPABASE_URL + "/rest/v1/rpc/" + name,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body || {})
    }
  );

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = text;
    }
  }

  if (!response.ok) {
    let message = "Supabase returned HTTP " + response.status + ".";
    if (data && typeof data === "object" && data.message) message += " " + data.message;
    throw new Error(message);
  }

  return data;
}

async function fetchSeriesCatalog() {
  const data = await rpc("get_cache_series_catalog", {});
  return Array.isArray(data) ? data : [];
}

async function fetchSeriesItems(seriesId) {
  const data = await rpc("get_cache_series_items", { p_series_id: seriesId });

  return (Array.isArray(data) ? data : []).map((row) => ({
    id: String(row.item_id || ""),
    name: String(row.item_name || ""),
    rarity: String(row.rarity || "").toLowerCase(),
    image: String(row.image_path || ""),
    sortOrder: Number(row.sort_order || 0)
  }));
}

async function fetchCollection(username, seriesId) {
  const data = await rpc(
    "get_cache_series_collection",
    {
      p_username: username,
      p_series_id: seriesId
    }
  );

  if (Array.isArray(data)) return data.length > 0 ? data[0] : null;
  if (data && typeof data === "object") return data;
  return null;
}

function getSeriesById(seriesId) {
  const clean = normalizeSeriesId(seriesId);
  return SERIES_CATALOG.find((series) => normalizeSeriesId(series.series_id) === clean) || null;
}

function getActiveSeries() {
  return SERIES_CATALOG.find((series) => series.is_active === true) || SERIES_CATALOG[0] || null;
}

function getSeriesTotalItems() {
  if (!currentSeries) return COLLECTIBLES.length;
  const value = Number(currentSeries.total_items);
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : COLLECTIBLES.length;
}

function getRarityTotals() {
  const configured = parseJsonValue(currentSeries && currentSeries.rarity_totals, {});
  const totals = {};

  for (const rarity of RARITY_ORDER) {
    const configuredValue = Number(configured[rarity]);

    if (Number.isFinite(configuredValue) && configuredValue >= 0) {
      totals[rarity] = Math.floor(configuredValue);
    } else {
      totals[rarity] = COLLECTIBLES.filter((item) => item.rarity === rarity).length;
    }
  }

  return totals;
}

function getCurrentSeriesAchievements() {
  return parseJsonValue(currentSeries && currentSeries.achievements, []);
}

function getCurrentSeriesMilestones() {
  return parseJsonValue(currentSeries && currentSeries.milestones, {});
}

function getItemsObject(collection) {
  if (!collection || collection.items == null) return {};
  return parseJsonValue(collection.items, {});
}

function getOwnedCount(collection, itemId) {
  const value = Number(getItemsObject(collection)[itemId] || 0);

  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}

function getUniqueCountFromItems(collection) {
  let count = 0;

  for (const collectible of COLLECTIBLES) {
    if (getOwnedCount(collection, collectible.id) > 0) count++;
  }

  return count;
}

function getSafeUniqueCount(collection) {
  const rpcCount = Number(collection && collection.unique_count != null ? collection.unique_count : NaN);
  const itemCount = getUniqueCountFromItems(collection);
  const total = getSeriesTotalItems();

  if (Number.isFinite(rpcCount)) {
    return Math.max(0, Math.min(total, Math.floor(Math.max(rpcCount, itemCount))));
  }

  return Math.min(total, itemCount);
}

function getSafeTotalPulls(collection) {
  const value = Number(collection && collection.total_pulls != null ? collection.total_pulls : 0);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

function getDuplicatePulls(collection) {
  return Math.max(0, getSafeTotalPulls(collection) - getSafeUniqueCount(collection));
}

function isCollectionComplete(collection) {
  const total = getSeriesTotalItems();
  return total > 0 && getSafeUniqueCount(collection) >= total;
}

function getUniqueByRarity(collection, rarity) {
  let count = 0;

  for (const item of COLLECTIBLES) {
    if (item.rarity === rarity && getOwnedCount(collection, item.id) > 0) count++;
  }

  return count;
}

function getPullsByRarity(collection, rarity) {
  let count = 0;

  for (const item of COLLECTIBLES) {
    if (item.rarity === rarity) count += getOwnedCount(collection, item.id);
  }

  return count;
}

function getMostOwnedRelic(collection) {
  let best = null;
  let bestCount = 0;

  for (const item of COLLECTIBLES) {
    const count = getOwnedCount(collection, item.id);

    if (count > bestCount) {
      best = item;
      bestCount = count;
    }
  }

  return best ? { item: best, count: bestCount } : null;
}

function percent(numerator, denominator) {
  if (!denominator || denominator <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((numerator / denominator) * 100)));
}

function formatUpdatedAt(rawValue) {
  if (!rawValue) return "UPDATED —";

  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) return "UPDATED —";

  return "UPDATED " + date.toLocaleString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }
  );
}

function getProgressMessage(uniqueCount, completed) {
  const milestones = getCurrentSeriesMilestones();

  if (completed) {
    const completeTitle = milestones[String(getSeriesTotalItems())];
    return completeTitle || "THE FLOCK IS COMPLETE";
  }

  let bestThreshold = -1;
  let bestTitle = "";

  for (const key of Object.keys(milestones)) {
    const threshold = Number(key);

    if (
      Number.isFinite(threshold) &&
      threshold <= uniqueCount &&
      threshold < getSeriesTotalItems() &&
      threshold > bestThreshold
    ) {
      bestThreshold = threshold;
      bestTitle = String(milestones[key] || "");
    }
  }

  return bestTitle || "THE FLOCK IS STILL GATHERING";
}

function injectEnhancementStyles() {
  if (document.getElementById("shepherd-cache-series-styles")) return;

  const style = document.createElement("style");
  style.id = "shepherd-cache-series-styles";

  style.textContent = `
    #series-picker {
      max-width: 760px;
      margin: 0 auto 18px;
      padding: 12px;
      border: 1px solid rgba(154,116,70,.25);
      border-radius: 12px;
      background: rgba(10,11,12,.42);
    }

    #series-picker label {
      display: block;
      margin-bottom: 7px;
      color: #9a7446;
      font-family: "Cinzel", serif;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.8px;
    }

    #series-select {
      width: 100%;
      min-height: 40px;
      padding: 8px 11px;
      border: 1px solid rgba(154,116,70,.42);
      border-radius: 8px;
      background: #171819;
      color: #e7ddc8;
      font: inherit;
      font-weight: 700;
    }

    #series-caption {
      margin-top: 7px;
      color: rgba(191,180,157,.7);
      font-size: 8px;
      font-weight: 700;
      letter-spacing: .8px;
    }

    #collection-tools,
    #collection-stats {
      position: relative;
      z-index: 3;
      margin: 8px 0 4px;
      padding: 14px;
      border: 1px solid rgba(154,116,70,.25);
      border-radius: 12px;
      background: radial-gradient(circle at 50% 0%, rgba(116,101,140,.10), transparent 65%), rgba(10,11,12,.42);
    }

    #collection-summary {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 7px;
      margin-bottom: 12px;
    }

    .cache-summary-chip {
      padding: 6px 9px;
      border: 1px solid rgba(231,221,200,.10);
      border-radius: 999px;
      background: rgba(13,14,15,.68);
      color: #bfb49d;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .cache-summary-chip strong {
      color: #e7ddc8;
      font-family: "Cinzel", serif;
      font-size: 11px;
    }

    .cache-summary-chip.complete-chip {
      border-color: rgba(184,140,255,.62);
      color: #b88cff;
    }

    #collection-stats-title {
      margin-bottom: 12px;
      text-align: center;
      color: #9a7446;
      font-family: "Cinzel", serif;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2.4px;
    }

    #collection-stats-grid,
    #collection-rarity-stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }

    #collection-rarity-stats { margin-top: 8px; }

    .cache-stat-card {
      min-width: 0;
      padding: 10px 8px;
      border: 1px solid rgba(231,221,200,.09);
      border-radius: 9px;
      background: rgba(13,14,15,.58);
      text-align: center;
    }

    .cache-stat-value {
      color: #e7ddc8;
      font-family: "Cinzel", serif;
      font-size: 16px;
      font-weight: 800;
    }

    .cache-stat-label {
      margin-top: 5px;
      color: #bfb49d;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1.2px;
    }

    .cache-stat-sub {
      margin-top: 4px;
      color: rgba(191,180,157,.72);
      font-size: 8px;
    }

    #collection-most-owned {
      margin-top: 9px;
      padding: 9px 11px;
      border: 1px dashed rgba(154,116,70,.25);
      border-radius: 8px;
      text-align: center;
      color: #bfb49d;
      font-size: 9px;
      letter-spacing: .8px;
    }

    #collection-most-owned strong {
      color: #e7ddc8;
      font-family: "Cinzel", serif;
    }

    .collection-filter-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 7px;
      margin-top: 8px;
    }

    .collection-filter-label {
      margin-right: 3px;
      color: #9a7446;
      font-family: "Cinzel", serif;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.7px;
    }

    .collection-filter-button,
    #collection-share-link {
      appearance: none;
      min-height: 31px;
      padding: 6px 10px;
      border: 1px solid rgba(154,116,70,.34);
      border-radius: 999px;
      background: rgba(36,36,38,.72);
      color: #bfb49d;
      font: inherit;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.1px;
      cursor: pointer;
    }

    .collection-filter-button.is-active {
      border-color: rgba(184,140,255,.78);
      background: linear-gradient(135deg, rgba(116,101,140,.42), rgba(154,116,70,.22));
      color: #e7ddc8;
    }

    #collection-share-link {
      width: 100%;
      margin-top: 11px;
      border-radius: 8px;
      color: #9a7446;
    }

    .collection-filter-empty {
      margin: 28px 0 12px;
      padding: 22px 16px;
      border: 1px dashed rgba(154,116,70,.28);
      border-radius: 10px;
      text-align: center;
      color: #bfb49d;
      font-family: "Cinzel", serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.4px;
    }

    #cache-completion-banner {
      display: none;
      margin: 10px 0 15px;
      padding: 21px 18px 18px;
      border: 1px solid rgba(184,140,255,.68);
      border-radius: 14px;
      background: radial-gradient(circle at 50% 0%, rgba(184,140,255,.19), transparent 54%), #151318;
      text-align: center;
      box-shadow: 0 0 28px rgba(184,140,255,.12);
    }

    #collection-book.is-complete #cache-completion-banner { display: block; }

    #cache-completion-seal {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 9px;
      border: 1px solid rgba(154,116,70,.8);
      border-radius: 50%;
      color: #e7ddc8;
      font-family: "Cinzel", serif;
      font-size: 23px;
      font-weight: 800;
    }

    #cache-completion-kicker {
      color: #9a7446;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 3px;
    }

    #cache-completion-title {
      margin-top: 5px;
      color: #e7ddc8;
      font-family: "Cinzel", serif;
      font-size: 23px;
      font-weight: 800;
    }

    #cache-completion-count {
      margin-top: 6px;
      color: #b88cff;
      font-family: "Cinzel", serif;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 3px;
    }

    #cache-completion-copy {
      margin-top: 7px;
      color: #bfb49d;
      font-size: 10px;
    }

    #collection-book.is-complete #collection-book-panel {
      border-color: rgba(184,140,255,.66);
      box-shadow: 0 24px 70px rgba(0,0,0,.72), 0 0 36px rgba(184,140,255,.12);
    }

    @media (max-width: 760px) {
      #collection-stats-grid,
      #collection-rarity-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `;

  document.head.appendChild(style);
}

function ensureCompletionBanner() {
  if (completionBanner) return;

  completionBanner = document.createElement("section");
  completionBanner.id = "cache-completion-banner";

  completionBanner.innerHTML = `
    <div id="cache-completion-seal">IX</div>
    <div id="cache-completion-kicker">COMPLETE COLLECTION</div>
    <div id="cache-completion-title">THE FLOCK IS COMPLETE</div>
    <div id="cache-completion-count">0 / 0</div>
    <div id="cache-completion-copy"></div>
  `;

  if (filterToolbar && filterToolbar.parentNode) {
    filterToolbar.parentNode.insertBefore(completionBanner, filterToolbar);
  } else if (sectionsElement && sectionsElement.parentNode) {
    sectionsElement.parentNode.insertBefore(completionBanner, sectionsElement);
  }
}

function ensureStatsPanel() {
  if (statsPanel) return;

  statsPanel = document.createElement("section");
  statsPanel.id = "collection-stats";
  statsPanel.innerHTML = `
    <div id="collection-stats-title">COLLECTION STATISTICS</div>
    <div id="collection-stats-grid"></div>
    <div id="collection-rarity-stats"></div>
    <div id="collection-most-owned"></div>
  `;

  if (filterToolbar && filterToolbar.parentNode) {
    filterToolbar.parentNode.insertBefore(statsPanel, filterToolbar);
  }
}

function makeFilterButton(label, type, value) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "collection-filter-button";
  button.textContent = label;
  button.dataset.filterType = type;
  button.dataset.filterValue = value;

  button.addEventListener("click", () => {
    if (type === "status") currentStatusFilter = value;
    else currentRarityFilter = value;

    updateFilterButtonStates();
    renderFilteredSections();
  });

  return button;
}

function ensureFilterToolbar() {
  if (filterToolbar) return;

  injectEnhancementStyles();

  filterToolbar = document.createElement("section");
  filterToolbar.id = "collection-tools";

  collectionSummary = document.createElement("div");
  collectionSummary.id = "collection-summary";
  filterToolbar.appendChild(collectionSummary);

  const statusGroup = document.createElement("div");
  statusGroup.className = "collection-filter-group";
  statusGroup.innerHTML = `<span class="collection-filter-label">SHOW</span>`;
  statusGroup.appendChild(makeFilterButton("ALL", "status", "all"));
  statusGroup.appendChild(makeFilterButton("DISCOVERED", "status", "owned"));
  statusGroup.appendChild(makeFilterButton("MISSING", "status", "missing"));
  filterToolbar.appendChild(statusGroup);

  const rarityGroup = document.createElement("div");
  rarityGroup.className = "collection-filter-group";
  rarityGroup.innerHTML = `<span class="collection-filter-label">RARITY</span>`;
  rarityGroup.appendChild(makeFilterButton("ALL", "rarity", "all"));

  for (const rarity of RARITY_ORDER) {
    rarityGroup.appendChild(makeFilterButton(RARITY_NAMES[rarity], "rarity", rarity));
  }

  filterToolbar.appendChild(rarityGroup);

  shareButton = document.createElement("button");
  shareButton.type = "button";
  shareButton.id = "collection-share-link";
  shareButton.textContent = "COPY THIS COLLECTION LINK";
  shareButton.addEventListener("click", copyCollectionLink);
  filterToolbar.appendChild(shareButton);

  sectionsElement.parentNode.insertBefore(filterToolbar, sectionsElement);

  ensureStatsPanel();
  ensureCompletionBanner();
  updateFilterButtonStates();
}

function updateFilterButtonStates() {
  if (!filterToolbar) return;

  for (const button of filterToolbar.querySelectorAll(".collection-filter-button")) {
    const active =
      (button.dataset.filterType === "status" && button.dataset.filterValue === currentStatusFilter) ||
      (button.dataset.filterType === "rarity" && button.dataset.filterValue === currentRarityFilter);

    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

async function copyCollectionLink() {
  let copied = false;

  try {
    await navigator.clipboard.writeText(window.location.href);
    copied = true;
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = window.location.href;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      copied = document.execCommand("copy");
    } catch (copyError) {
      copied = false;
    }

    textarea.remove();
  }

  shareButton.textContent = copied ? "LINK COPIED" : "COPY FAILED";

  window.setTimeout(() => {
    shareButton.textContent = isCollectionComplete(currentCollection)
      ? "COPY COMPLETED COLLECTION LINK"
      : "COPY THIS COLLECTION LINK";
  }, 1600);
}

function createCollectionItem(collectible, ownedCount) {
  const owned = ownedCount > 0;
  const itemElement = document.createElement("article");

  itemElement.className =
    "collection-item " +
    (owned ? "owned " : "missing ") +
    "rarity-" +
    collectible.rarity;

  itemElement.dataset.owned = owned ? "true" : "false";
  itemElement.dataset.rarity = collectible.rarity;

  const imageWrap = document.createElement("div");
  imageWrap.className = "collection-item-image-wrap";

  const image = document.createElement("img");
  image.src = collectible.image;
  image.alt = owned ? collectible.name : "Undiscovered collectible";
  image.loading = "lazy";
  imageWrap.appendChild(image);
  itemElement.appendChild(imageWrap);

  if (ownedCount > 1) {
    const countElement = document.createElement("div");
    countElement.className = "collection-item-owned-count";
    countElement.textContent = "×" + ownedCount;
    itemElement.appendChild(countElement);
  }

  if (!owned) {
    const missingMark = document.createElement("div");
    missingMark.className = "collection-missing-mark";
    missingMark.textContent = "?";
    itemElement.appendChild(missingMark);
  }

  const nameElement = document.createElement("div");
  nameElement.className = "collection-item-name";
  nameElement.textContent = owned ? collectible.name : "UNDISCOVERED";
  itemElement.appendChild(nameElement);

  return itemElement;
}

function collectibleMatchesStatus(collection, collectible) {
  if (currentStatusFilter === "all") return true;

  const owned = getOwnedCount(collection, collectible.id) > 0;

  if (currentStatusFilter === "owned") return owned;
  if (currentStatusFilter === "missing") return !owned;

  return true;
}

function createRaritySection(rarity, collection) {
  const allRarityCollectibles = COLLECTIBLES.filter((item) => item.rarity === rarity);
  const visibleCollectibles = allRarityCollectibles.filter((item) => collectibleMatchesStatus(collection, item));

  if (visibleCollectibles.length === 0) return null;

  const section = document.createElement("section");
  section.className = "collection-section";
  section.dataset.rarity = rarity;

  const sectionHeader = document.createElement("header");
  sectionHeader.className = "collection-section-header";

  const title = document.createElement("div");
  title.className = "collection-section-title";
  title.textContent = RARITY_NAMES[rarity];

  const count = document.createElement("div");
  count.className = "collection-section-count";
  count.textContent =
    getUniqueByRarity(collection, rarity) +
    " / " +
    allRarityCollectibles.length +
    " DISCOVERED";

  sectionHeader.appendChild(title);
  sectionHeader.appendChild(count);

  const grid = document.createElement("div");
  grid.className = "collection-grid";

  for (const collectible of visibleCollectibles) {
    grid.appendChild(
      createCollectionItem(
        collectible,
        getOwnedCount(collection, collectible.id)
      )
    );
  }

  section.appendChild(sectionHeader);
  section.appendChild(grid);

  return section;
}

function updateCollectionSummary(collection) {
  ensureFilterToolbar();

  const total = getSeriesTotalItems();
  const unique = getSafeUniqueCount(collection);
  const missing = Math.max(0, total - unique);
  const duplicates = getDuplicatePulls(collection);
  const totalPulls = getSafeTotalPulls(collection);
  const completed = isCollectionComplete(collection);

  collectionSummary.innerHTML = `
    ${completed ? `<span class="cache-summary-chip complete-chip"><strong>✓</strong> COMPLETE COLLECTION</span>` : ""}
    <span class="cache-summary-chip"><strong>${unique}</strong> FOUND</span>
    <span class="cache-summary-chip"><strong>${missing}</strong> MISSING</span>
    <span class="cache-summary-chip"><strong>${duplicates}</strong> DUPLICATES</span>
    <span class="cache-summary-chip"><strong>${totalPulls}</strong> TOTAL PULLS</span>
  `;
}

function updateCollectionStats(collection) {
  ensureStatsPanel();

  const total = getSeriesTotalItems();
  const unique = getSafeUniqueCount(collection);
  const totalPulls = getSafeTotalPulls(collection);
  const duplicatePulls = getDuplicatePulls(collection);
  const legendaryPulls = getPullsByRarity(collection, "legendary");
  const mostOwned = getMostOwnedRelic(collection);
  const rarityTotals = getRarityTotals();

  statsPanel.querySelector("#collection-stats-grid").innerHTML = `
    <div class="cache-stat-card">
      <div class="cache-stat-value">${percent(unique, total)}%</div>
      <div class="cache-stat-label">COLLECTION COMPLETE</div>
      <div class="cache-stat-sub">${unique} of ${total} relics</div>
    </div>

    <div class="cache-stat-card">
      <div class="cache-stat-value">${percent(unique, totalPulls)}%</div>
      <div class="cache-stat-label">DISCOVERY RATE</div>
      <div class="cache-stat-sub">unique relics per pull</div>
    </div>

    <div class="cache-stat-card">
      <div class="cache-stat-value">${percent(duplicatePulls, totalPulls)}%</div>
      <div class="cache-stat-label">DUPLICATE RATE</div>
      <div class="cache-stat-sub">${duplicatePulls} duplicate pulls</div>
    </div>

    <div class="cache-stat-card stat-legendary">
      <div class="cache-stat-value">${legendaryPulls}</div>
      <div class="cache-stat-label">LEGENDARY PULLS</div>
      <div class="cache-stat-sub">including duplicates</div>
    </div>
  `;

  statsPanel.querySelector("#collection-rarity-stats").innerHTML =
    RARITY_ORDER.map((rarity) => `
      <div class="cache-stat-card stat-${rarity}">
        <div class="cache-stat-value">${getUniqueByRarity(collection, rarity)}/${rarityTotals[rarity]}</div>
        <div class="cache-stat-label">${RARITY_NAMES[rarity]}</div>
        <div class="cache-stat-sub">${getPullsByRarity(collection, rarity)} total pulls</div>
      </div>
    `).join("");

  statsPanel.querySelector("#collection-most-owned").innerHTML =
    mostOwned && mostOwned.count > 0
      ? "MOST OWNED RELIC · <strong>" + mostOwned.item.name + "</strong> · ×" + mostOwned.count
      : "MOST OWNED RELIC · <strong>NONE YET</strong>";
}

function updateCompletionTreatment(collection) {
  ensureCompletionBanner();

  const total = getSeriesTotalItems();
  const completed = isCollectionComplete(collection);
  const completeTitle = getCurrentSeriesMilestones()[String(total)] || "THE FLOCK IS COMPLETE";

  collectionBook.classList.toggle("is-complete", completed);

  completionBanner.querySelector("#cache-completion-title").textContent = completeTitle;
  completionBanner.querySelector("#cache-completion-count").textContent = total + " / " + total;
  completionBanner.querySelector("#cache-completion-copy").textContent =
    "Every relic of " +
    (currentSeries ? currentSeries.series_name : "this series") +
    " has been recovered.";

  if (shareButton) {
    shareButton.textContent = completed
      ? "COPY COMPLETED COLLECTION LINK"
      : "COPY THIS COLLECTION LINK";
  }
}

function renderFilteredSections() {
  if (!currentCollection) return;

  sectionsElement.innerHTML = "";
  let rendered = 0;

  const rarities =
    currentRarityFilter === "all"
      ? RARITY_ORDER
      : [currentRarityFilter];

  for (const rarity of rarities) {
    const section = createRaritySection(rarity, currentCollection);

    if (section) {
      sectionsElement.appendChild(section);
      rendered++;
    }
  }

  if (rendered === 0) {
    const empty = document.createElement("div");
    empty.className = "collection-filter-empty";
    empty.textContent =
      currentStatusFilter === "owned"
        ? "NO DISCOVERED RELICS MATCH THIS FILTER"
        : currentStatusFilter === "missing"
          ? "NO MISSING RELICS MATCH THIS FILTER"
          : "NO RELICS MATCH THIS FILTER";

    sectionsElement.appendChild(empty);
  }
}

function renderCollection(collection) {
  currentCollection = collection;
  currentStatusFilter = "all";
  currentRarityFilter = "all";

  ensureFilterToolbar();
  updateFilterButtonStates();

  const username = normalizeUsername(collection.username);
  const displayName = String(collection.display_name || collection.username || username);
  const totalPulls = getSafeTotalPulls(collection);
  const uniqueCount = getSafeUniqueCount(collection);
  const total = getSeriesTotalItems();
  const completed = isCollectionComplete(collection);

  viewerElement.textContent = "@" + displayName;
  totalPullsElement.textContent = totalPulls;
  progressCountElement.textContent = uniqueCount + " / " + total;
  progressFillElement.style.width = (total > 0 ? (uniqueCount / total) * 100 : 0) + "%";
  progressMessageElement.textContent = getProgressMessage(uniqueCount, completed);
  progressMessageElement.classList.toggle("complete", completed);

  updateCompletionTreatment(collection);
  updateCollectionSummary(collection);
  updateCollectionStats(collection);
  renderFilteredSections();

  lastUpdatedElement.textContent = formatUpdatedAt(collection.updated_at);
  searchInput.value = username;

  const seriesName = currentSeries ? currentSeries.series_name : "Shepherd's Cache";
  document.title =
    completed
      ? displayName + " · " + total + "/" + total + " · " + seriesName
      : displayName + " · " + seriesName;

  collectionBook.hidden = false;

  window.dispatchEvent(
    new CustomEvent(
      "shepherd-cache:series-rendered",
      {
        detail: {
          series: currentSeries,
          collection: currentCollection
        }
      }
    )
  );
}

async function loadViewer(username, seriesId) {
  const cleanUsername = normalizeUsername(username);
  const cleanSeries = normalizeSeriesId(seriesId);

  if (!cleanUsername) {
    currentCollection = null;
    collectionBook.hidden = true;
    setStatus("Enter a Twitch username to open a Shepherd's Cache.", "idle");
    return;
  }

  const selectedSeries = getSeriesById(cleanSeries) || getActiveSeries();

  if (!selectedSeries) {
    throw new Error("No Shepherd's Cache series is available.");
  }

  currentSeries = selectedSeries;
  seriesSelect.value = selectedSeries.series_id;
  seriesCaption.textContent =
    String(selectedSeries.series_subtitle || "") +
    " · " +
    Number(selectedSeries.total_items || 0) +
    " RELICS";

  setPageParams(cleanUsername, selectedSeries.series_id);
  currentCollection = null;
  collectionBook.hidden = true;
  collectionBook.classList.remove("is-complete");

  setStatus(
    "OPENING @" +
    cleanUsername +
    " · " +
    String(selectedSeries.series_name || selectedSeries.series_id).toUpperCase() +
    "...",
    "loading"
  );

  const results = await Promise.all([
    fetchSeriesItems(selectedSeries.series_id),
    fetchCollection(cleanUsername, selectedSeries.series_id)
  ]);

  COLLECTIBLES = results[0];
  const collection = results[1];

  if (!collection) {
    currentCollection = null;
    collectionBook.hidden = true;

    setStatus(
      "No " +
      selectedSeries.series_name +
      " collection was found for @" +
      cleanUsername +
      ".",
      "error"
    );

    return;
  }

  renderCollection(collection);
  setStatus("", "");
}

function populateSeriesSelector() {
  seriesSelect.innerHTML = "";

  for (const series of SERIES_CATALOG) {
    const option = document.createElement("option");
    option.value = series.series_id;
    option.textContent =
      String(series.series_name || series.series_id) +
      " · " +
      Number(series.total_items || 0) +
      " RELICS";

    seriesSelect.appendChild(option);
  }

  seriesSelect.disabled = SERIES_CATALOG.length === 0;
}

async function initialize() {
  injectEnhancementStyles();
  ensureFilterToolbar();

  try {
    SERIES_CATALOG = await fetchSeriesCatalog();
    populateSeriesSelector();

    const requestedSeries = getPageSeriesId();
    const selectedSeries = getSeriesById(requestedSeries) || getActiveSeries();

    if (selectedSeries) {
      currentSeries = selectedSeries;
      seriesSelect.value = selectedSeries.series_id;
      seriesCaption.textContent =
        String(selectedSeries.series_subtitle || "") +
        " · " +
        Number(selectedSeries.total_items || 0) +
        " RELICS";
    }

    const username = getPageUsername();

    if (username && selectedSeries) {
      await loadViewer(username, selectedSeries.series_id);
    } else {
      setStatus("Enter a Twitch username to open a Shepherd's Cache.", "idle");
    }
  } catch (error) {
    console.error(error);
    setStatus(
      error && error.message
        ? error.message
        : "The Shepherd's Cache could not be initialized.",
      "error"
    );
  }
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await loadViewer(searchInput.value, seriesSelect.value);
  } catch (error) {
    console.error(error);
    collectionBook.hidden = true;
    setStatus(error && error.message ? error.message : "The Shepherd's Cache could not be opened.", "error");
  }
});

seriesSelect.addEventListener("change", async () => {
  const username = normalizeUsername(searchInput.value || getPageUsername());
  const seriesId = seriesSelect.value;

  if (!username) {
    const selectedSeries = getSeriesById(seriesId);

    if (selectedSeries) {
      currentSeries = selectedSeries;
      seriesCaption.textContent =
        String(selectedSeries.series_subtitle || "") +
        " · " +
        Number(selectedSeries.total_items || 0) +
        " RELICS";

      setPageParams("", selectedSeries.series_id);
    }

    return;
  }

  try {
    await loadViewer(username, seriesId);
  } catch (error) {
    console.error(error);
    collectionBook.hidden = true;
    setStatus(error && error.message ? error.message : "The Shepherd's Cache could not be opened.", "error");
  }
});

initialize();
