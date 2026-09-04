/* =====================================================
   STRAY
   SHEPHERD'S CACHE
   PUBLIC COLLECTION BOOK
   Supabase + Filters + Share Link + Summary
   ===================================================== */

"use strict";

/* =========================
   CONFIG
   ========================= */

const CONFIG = window.ShepherdCacheConfig || {};

const SUPABASE_URL = String(
  CONFIG.supabaseUrl || ""
)
  .trim()
  .replace(/\/+$/, "");

const SUPABASE_PUBLISHABLE_KEY = String(
  CONFIG.supabasePublishableKey || ""
).trim();

const TOTAL_ITEMS = 22;

const RARITY_ORDER = [
  "common",
  "uncommon",
  "rare",
  "legendary"
];

const RARITY_NAMES = {
  common: "COMMON",
  uncommon: "UNCOMMON",
  rare: "RARE",
  legendary: "LEGENDARY"
};


/* =========================
   COLLECTIBLES
   ========================= */

const COLLECTIBLES = [

  /* COMMON */

  {
    id: "worn-bell",
    name: "Worn Shepherd Bell",
    rarity: "common",
    image: "assets/collectibles/worn-bell.png"
  },

  {
    id: "faded-wool-patch",
    name: "Faded Wool Patch",
    rarity: "common",
    image: "assets/collectibles/faded-wool-patch.png"
  },

  {
    id: "crooked-fence-charm",
    name: "Crooked Fence Charm",
    rarity: "common",
    image: "assets/collectibles/crooked-fence-charm.png"
  },

  {
    id: "wayfarers-feather",
    name: "Wayfarer's Feather",
    rarity: "common",
    image: "assets/collectibles/wayfarers-feather.png"
  },

  {
    id: "old-pasture-token",
    name: "Old Pasture Token",
    rarity: "common",
    image: "assets/collectibles/old-pasture-token.png"
  },


  /* UNCOMMON */

  {
    id: "violet-lamb",
    name: "Violet Wool Lamb",
    rarity: "uncommon",
    image: "assets/collectibles/violet-lamb.png"
  },

  {
    id: "brass-crook-charm",
    name: "Brass Crook Charm",
    rarity: "uncommon",
    image: "assets/collectibles/brass-crook-charm.png"
  },

  {
    id: "stormglass-bead",
    name: "Stormglass Bead",
    rarity: "uncommon",
    image: "assets/collectibles/stormglass-bead.png"
  },

  {
    id: "rainworn-map-fragment",
    name: "Rainworn Map Fragment",
    rarity: "uncommon",
    image: "assets/collectibles/rainworn-map-fragment.png"
  },

  {
    id: "mended-flock-tag",
    name: "Mended Flock Tag",
    rarity: "uncommon",
    image: "assets/collectibles/mended-flock-tag.png"
  },

  {
    id: "violet-thread-spool",
    name: "Violet Thread Spool",
    rarity: "uncommon",
    image: "assets/collectibles/violet-thread-spool.png"
  },

  {
    id: "wayfarers-match-tin",
    name: "Wayfarer's Match Tin",
    rarity: "uncommon",
    image: "assets/collectibles/wayfarers-match-tin.png"
  },


  /* RARE */

  {
    id: "wandering-ram",
    name: "Wandering Ram",
    rarity: "rare",
    image: "assets/collectibles/wandering-ram.png"
  },

  {
    id: "shepherds-seal",
    name: "Shepherd's Seal",
    rarity: "rare",
    image: "assets/collectibles/shepherds-seal.png"
  },

  {
    id: "lost-flock-bell",
    name: "Lost Flock Bell",
    rarity: "rare",
    image: "assets/collectibles/lost-flock-bell.png"
  },

  {
    id: "blackglass-shepherd-lantern",
    name: "Blackglass Shepherd Lantern",
    rarity: "rare",
    image: "assets/collectibles/blackglass-shepherd-lantern.png"
  },

  {
    id: "stormworn-crook-head",
    name: "Stormworn Crook Head",
    rarity: "rare",
    image: "assets/collectibles/stormworn-crook-head.png"
  },


  /* LEGENDARY */

  {
    id: "ninth-lamb",
    name: "The Ninth Lamb",
    rarity: "legendary",
    image: "assets/collectibles/ninth-lamb.png"
  },

  {
    id: "the-first-bell",
    name: "The First Bell",
    rarity: "legendary",
    image: "assets/collectibles/the-first-bell.png"
  },

  {
    id: "the-pale-ram",
    name: "The Pale Ram",
    rarity: "legendary",
    image: "assets/collectibles/the-pale-ram.png"
  },

  {
    id: "ninth-hour-reliquary",
    name: "Ninth Hour Reliquary",
    rarity: "legendary",
    image: "assets/collectibles/ninth-hour-reliquary.png"
  },

  {
    id: "cloud-ninth-familiar",
    name: "Cloud Ninth Familiar",
    rarity: "legendary",
    image: "assets/collectibles/cloud-ninth-familiar.png"
  }
];


/* =========================
   ELEMENTS
   ========================= */

const searchForm =
  document.getElementById(
    "viewer-search-form"
  );

const searchInput =
  document.getElementById(
    "viewer-search-input"
  );

const statusElement =
  document.getElementById(
    "page-status"
  );

const collectionBook =
  document.getElementById(
    "collection-book"
  );

const viewerElement =
  document.getElementById(
    "collection-book-viewer"
  );

const totalPullsElement =
  document.getElementById(
    "total-pulls-value"
  );

const progressCountElement =
  document.getElementById(
    "book-progress-count"
  );

const progressFillElement =
  document.getElementById(
    "book-progress-fill"
  );

const progressMessageElement =
  document.getElementById(
    "book-progress-message"
  );

const sectionsElement =
  document.getElementById(
    "collection-sections"
  );

const lastUpdatedElement =
  document.getElementById(
    "collection-last-updated"
  );


/* =========================
   STATE
   ========================= */

let currentCollection = null;

let currentStatusFilter = "all";

let currentRarityFilter = "all";

let filterToolbar = null;

let collectionSummary = null;

let shareButton = null;


/* =========================
   HELPERS
   ========================= */

function normalizeUsername(
  username
) {

  return String(
    username || ""
  )
    .trim()
    .replace(
      /^@/,
      ""
    )
    .toLowerCase();
}


function setStatus(
  message,
  type = ""
) {

  statusElement.textContent =
    message || "";

  statusElement.className =
    type
      ? "status-" + type
      : "";
}


function setPageUsername(
  username
) {

  const cleanUsername =
    normalizeUsername(
      username
    );

  const url =
    new URL(
      window.location.href
    );


  if (cleanUsername) {

    url.searchParams.set(
      "user",
      cleanUsername
    );

  }

  else {

    url.searchParams.delete(
      "user"
    );
  }


  window.history.replaceState(
    {},
    "",
    url
  );
}


function getUsernameFromPage() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  return normalizeUsername(
    params.get(
      "user"
    )
  );
}


function getItemsObject(
  collection
) {

  if (
    !collection ||
    collection.items == null
  ) {

    return {};
  }


  if (
    typeof collection.items ===
    "object"
  ) {

    return collection.items;
  }


  if (
    typeof collection.items ===
    "string"
  ) {

    try {

      const parsed =
        JSON.parse(
          collection.items
        );


      if (
        parsed &&
        typeof parsed ===
        "object"
      ) {

        return parsed;
      }

    }

    catch (error) {
    }
  }


  return {};
}


function getOwnedCount(
  collection,
  itemId
) {

  const items =
    getItemsObject(
      collection
    );


  const value =
    Number(
      items[itemId] || 0
    );


  if (
    !Number.isFinite(
      value
    ) ||
    value < 0
  ) {

    return 0;
  }


  return Math.floor(
    value
  );
}


function getUniqueCountFromItems(
  collection
) {

  return COLLECTIBLES.reduce(
    (
      count,
      item
    ) => {

      return (
        count +
        (
          getOwnedCount(
            collection,
            item.id
          ) > 0
            ? 1
            : 0
        )
      );
    },
    0
  );
}


function getSafeUniqueCount(
  collection
) {

  const rpcCount =
    Number(
      collection &&
      collection.unique_count != null

        ? collection.unique_count

        : NaN
    );


  const itemCount =
    getUniqueCountFromItems(
      collection
    );


  if (
    Number.isFinite(
      rpcCount
    )
  ) {

    return Math.max(
      0,
      Math.min(
        TOTAL_ITEMS,
        Math.floor(
          Math.max(
            rpcCount,
            itemCount
          )
        )
      )
    );
  }


  return itemCount;
}


function getSafeTotalPulls(
  collection
) {

  const value =
    Number(
      collection &&
      collection.total_pulls != null

        ? collection.total_pulls

        : 0
    );


  if (
    !Number.isFinite(
      value
    )
  ) {

    return 0;
  }


  return Math.max(
    0,
    Math.floor(
      value
    )
  );
}


function getDuplicatePulls(
  collection
) {

  return Math.max(
    0,

    getSafeTotalPulls(
      collection
    )

    -

    getSafeUniqueCount(
      collection
    )
  );
}


function formatUpdatedAt(
  rawValue
) {

  if (!rawValue) {

    return "UPDATED —";
  }


  const date =
    new Date(
      rawValue
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "UPDATED —";
  }


  return (
    "UPDATED "
    +
    date.toLocaleString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }
    )
  );
}


function getProgressMessage(
  uniqueCount,
  completed
) {

  if (completed) {

    return "THE FLOCK IS COMPLETE";
  }


  if (
    uniqueCount >= 20
  ) {

    return "THE FINAL STRETCH";
  }


  if (
    uniqueCount >= 15
  ) {

    return "THE CACHE REMEMBERS";
  }


  if (
    uniqueCount >= 10
  ) {

    return "THE FLOCK GATHERS";
  }


  if (
    uniqueCount >= 5
  ) {

    return "THE TRAIL BEGINS";
  }


  return "THE FLOCK IS STILL GATHERING";
}


/* =========================
   EXTRA UI STYLES

   This lets us add filters without
   changing collection.css.
   ========================= */

function injectEnhancementStyles() {

  if (
    document.getElementById(
      "shepherd-cache-public-enhancement-styles"
    )
  ) {

    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "shepherd-cache-public-enhancement-styles";


  style.textContent = `

    #collection-tools {

      position:
        relative;

      z-index:
        3;

      margin:
        8px 0 4px;

      padding:
        14px;

      border:
        1px solid
        rgba(154, 116, 70, 0.25);

      border-radius:
        12px;

      background:

        radial-gradient(
          circle at 50% 0%,
          rgba(116, 101, 140, 0.10),
          transparent 65%
        ),

        rgba(10, 11, 12, 0.42);
    }


    #collection-summary {

      display:
        flex;

      flex-wrap:
        wrap;

      justify-content:
        center;

      gap:
        7px;

      margin-bottom:
        12px;
    }


    .cache-summary-chip {

      padding:
        6px 9px;

      border:
        1px solid
        rgba(231, 221, 200, 0.10);

      border-radius:
        999px;

      background:
        rgba(13, 14, 15, 0.68);

      color:
        var(
          --stray-cream-muted,
          #bfb49d
        );

      font-size:
        10px;

      font-weight:
        700;

      letter-spacing:
        1px;

      white-space:
        nowrap;
    }


    .cache-summary-chip strong {

      color:
        var(
          --stray-cream,
          #e7ddc8
        );

      font-family:
        "Cinzel",
        serif;

      font-size:
        11px;
    }


    .collection-filter-group {

      display:
        flex;

      flex-wrap:
        wrap;

      align-items:
        center;

      justify-content:
        center;

      gap:
        7px;

      margin-top:
        8px;
    }


    .collection-filter-label {

      margin-right:
        3px;

      color:
        var(
          --stray-brass,
          #9a7446
        );

      font-family:
        "Cinzel",
        serif;

      font-size:
        9px;

      font-weight:
        800;

      letter-spacing:
        1.7px;
    }


    .collection-filter-button,
    #collection-share-link {

      appearance:
        none;

      min-height:
        31px;

      padding:
        6px 10px;

      border:
        1px solid
        rgba(154, 116, 70, 0.34);

      border-radius:
        999px;

      background:
        rgba(36, 36, 38, 0.72);

      color:
        var(
          --stray-cream-muted,
          #bfb49d
        );

      font:
        inherit;

      font-size:
        9px;

      font-weight:
        800;

      letter-spacing:
        1.1px;

      cursor:
        pointer;

      transition:
        border-color 0.18s ease,
        background 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }


    .collection-filter-button:hover,
    #collection-share-link:hover {

      transform:
        translateY(-1px);

      border-color:
        rgba(184, 140, 255, 0.55);

      color:
        var(
          --stray-cream,
          #e7ddc8
        );
    }


    .collection-filter-button.is-active {

      border-color:
        rgba(184, 140, 255, 0.78);

      background:

        linear-gradient(
          135deg,
          rgba(116, 101, 140, 0.42),
          rgba(154, 116, 70, 0.22)
        );

      color:
        var(
          --stray-cream,
          #e7ddc8
        );

      box-shadow:
        0 0 14px
        rgba(184, 140, 255, 0.08);
    }


    #collection-share-link {

      margin-top:
        11px;

      width:
        100%;

      border-radius:
        8px;

      color:
        var(
          --stray-brass,
          #9a7446
        );
    }


    #collection-share-link.is-copied {

      border-color:
        rgba(184, 140, 255, 0.72);

      color:
        #b88cff;
    }


    .collection-filter-empty {

      margin:
        28px 0 12px;

      padding:
        22px 16px;

      border:
        1px dashed
        rgba(154, 116, 70, 0.28);

      border-radius:
        10px;

      text-align:
        center;

      color:
        var(
          --stray-cream-muted,
          #bfb49d
        );

      font-family:
        "Cinzel",
        serif;

      font-size:
        11px;

      font-weight:
        700;

      letter-spacing:
        1.4px;
    }


    @media (
      max-width: 620px
    ) {

      #collection-tools {

        padding:
          11px;
      }


      .collection-filter-label {

        width:
          100%;

        margin:
          0 0 2px;

        text-align:
          center;
      }


      .collection-filter-button {

        flex:
          1 1 auto;
      }
    }

  `;


  document.head.appendChild(
    style
  );
}


/* =========================
   FILTER + SHARE TOOLBAR
   ========================= */

function makeFilterButton(
  label,
  type,
  value
) {

  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.className =
    "collection-filter-button";


  button.textContent =
    label;


  button.dataset.filterType =
    type;


  button.dataset.filterValue =
    value;


  button.addEventListener(
    "click",
    function() {

      if (
        type ===
        "status"
      ) {

        currentStatusFilter =
          value;
      }

      else {

        currentRarityFilter =
          value;
      }


      updateFilterButtonStates();

      renderFilteredSections();
    }
  );


  return button;
}


function ensureFilterToolbar() {

  if (
    filterToolbar
  ) {

    return;
  }


  injectEnhancementStyles();


  filterToolbar =
    document.createElement(
      "section"
    );


  filterToolbar.id =
    "collection-tools";


  collectionSummary =
    document.createElement(
      "div"
    );


  collectionSummary.id =
    "collection-summary";


  filterToolbar.appendChild(
    collectionSummary
  );


  /* -------------------------
     SHOW FILTER
     ------------------------- */

  const statusGroup =
    document.createElement(
      "div"
    );


  statusGroup.className =
    "collection-filter-group";


  const statusLabel =
    document.createElement(
      "span"
    );


  statusLabel.className =
    "collection-filter-label";


  statusLabel.textContent =
    "SHOW";


  statusGroup.appendChild(
    statusLabel
  );


  statusGroup.appendChild(
    makeFilterButton(
      "ALL",
      "status",
      "all"
    )
  );


  statusGroup.appendChild(
    makeFilterButton(
      "DISCOVERED",
      "status",
      "owned"
    )
  );


  statusGroup.appendChild(
    makeFilterButton(
      "MISSING",
      "status",
      "missing"
    )
  );


  filterToolbar.appendChild(
    statusGroup
  );


  /* -------------------------
     RARITY FILTER
     ------------------------- */

  const rarityGroup =
    document.createElement(
      "div"
    );


  rarityGroup.className =
    "collection-filter-group";


  const rarityLabel =
    document.createElement(
      "span"
    );


  rarityLabel.className =
    "collection-filter-label";


  rarityLabel.textContent =
    "RARITY";


  rarityGroup.appendChild(
    rarityLabel
  );


  rarityGroup.appendChild(
    makeFilterButton(
      "ALL",
      "rarity",
      "all"
    )
  );


  for (
    const rarity
    of RARITY_ORDER
  ) {

    rarityGroup.appendChild(
      makeFilterButton(
        RARITY_NAMES[
          rarity
        ],
        "rarity",
        rarity
      )
    );
  }


  filterToolbar.appendChild(
    rarityGroup
  );


  /* -------------------------
     SHARE BUTTON
     ------------------------- */

  shareButton =
    document.createElement(
      "button"
    );


  shareButton.type =
    "button";


  shareButton.id =
    "collection-share-link";


  shareButton.textContent =
    "COPY THIS COLLECTION LINK";


  shareButton.addEventListener(
    "click",
    copyCollectionLink
  );


  filterToolbar.appendChild(
    shareButton
  );


  /*
     Place toolbar directly before
     collection rarity sections.
  */

  sectionsElement.parentNode.insertBefore(
    filterToolbar,
    sectionsElement
  );


  updateFilterButtonStates();
}


function updateFilterButtonStates() {

  if (
    !filterToolbar
  ) {

    return;
  }


  const buttons =
    filterToolbar.querySelectorAll(
      ".collection-filter-button"
    );


  for (
    const button
    of buttons
  ) {

    const type =
      button.dataset.filterType;


    const value =
      button.dataset.filterValue;


    const active =
      (
        type ===
        "status"
        &&
        value ===
        currentStatusFilter
      )

      ||

      (
        type ===
        "rarity"
        &&
        value ===
        currentRarityFilter
      );


    button.classList.toggle(
      "is-active",
      active
    );


    button.setAttribute(
      "aria-pressed",
      active
        ? "true"
        : "false"
    );
  }
}


async function copyCollectionLink() {

  const url =
    window.location.href;


  let copied =
    false;


  /*
     Normal modern browser method.
  */

  if (
    navigator.clipboard
    &&
    window.isSecureContext
  ) {

    try {

      await navigator.clipboard.writeText(
        url
      );


      copied =
        true;
    }

    catch (error) {
    }
  }


  /*
     Fallback method.
  */

  if (!copied) {

    const textarea =
      document.createElement(
        "textarea"
      );


    textarea.value =
      url;


    textarea.setAttribute(
      "readonly",
      ""
    );


    textarea.style.position =
      "fixed";


    textarea.style.opacity =
      "0";


    document.body.appendChild(
      textarea
    );


    textarea.select();


    try {

      copied =
        document.execCommand(
          "copy"
        );
    }

    catch (error) {

      copied =
        false;
    }


    textarea.remove();
  }


  if (
    !shareButton
  ) {

    return;
  }


  shareButton.textContent =
    copied
      ? "LINK COPIED"
      : "COPY FAILED";


  shareButton.classList.toggle(
    "is-copied",
    copied
  );


  window.setTimeout(
    function() {

      shareButton.textContent =
        "COPY THIS COLLECTION LINK";


      shareButton.classList.remove(
        "is-copied"
      );

    },
    1600
  );
}


/* =========================
   SUPABASE
   ========================= */

async function fetchCollection(
  username
) {

  if (!SUPABASE_URL) {

    throw new Error(
      "Supabase Project URL is missing from config.js."
    );
  }


  if (
    !SUPABASE_PUBLISHABLE_KEY
  ) {

    throw new Error(
      "Supabase publishable key is missing from config.js."
    );
  }


  const endpoint =
    SUPABASE_URL
    +
    "/rest/v1/rpc/get_cache_collection";


  const response =
    await fetch(
      endpoint,
      {

        method:
          "POST",


        headers: {

          apikey:
            SUPABASE_PUBLISHABLE_KEY,

          "Content-Type":
            "application/json",

          Accept:
            "application/json"
        },


        body:
          JSON.stringify(
            {

              p_username:
                username
            }
          )
      }
    );


  const responseText =
    await response.text();


  let data =
    null;


  if (
    responseText
  ) {

    try {

      data =
        JSON.parse(
          responseText
        );
    }

    catch (error) {

      data =
        responseText;
    }
  }


  if (
    !response.ok
  ) {

    let message =
      "Supabase returned HTTP "
      +
      response.status
      +
      ".";


    if (
      data
      &&
      typeof data ===
      "object"
      &&
      data.message
    ) {

      message +=
        " "
        +
        data.message;
    }


    throw new Error(
      message
    );
  }


  if (
    Array.isArray(
      data
    )
  ) {

    return data.length > 0

      ? data[0]

      : null;
  }


  if (
    data
    &&
    typeof data ===
    "object"
  ) {

    return data;
  }


  return null;
}


/* =========================
   COLLECTION CARDS
   ========================= */

function createCollectionItem(
  collectible,
  ownedCount
) {

  const owned =
    ownedCount > 0;


  const itemElement =
    document.createElement(
      "article"
    );


  itemElement.className =
    "collection-item "
    +
    (
      owned
        ? "owned "
        : "missing "
    )
    +
    "rarity-"
    +
    collectible.rarity;


  itemElement.dataset.owned =
    owned
      ? "true"
      : "false";


  itemElement.dataset.rarity =
    collectible.rarity;


  /* -------------------------
     IMAGE
     ------------------------- */

  const imageWrap =
    document.createElement(
      "div"
    );


  imageWrap.className =
    "collection-item-image-wrap";


  const image =
    document.createElement(
      "img"
    );


  image.src =
    collectible.image;


  image.alt =
    owned

      ? collectible.name

      : "Undiscovered collectible";


  image.loading =
    "lazy";


  imageWrap.appendChild(
    image
  );


  itemElement.appendChild(
    imageWrap
  );


  /* -------------------------
     DUPLICATE COUNT
     ------------------------- */

  if (
    ownedCount > 1
  ) {

    const countElement =
      document.createElement(
        "div"
      );


    countElement.className =
      "collection-item-owned-count";


    countElement.textContent =
      "×"
      +
      ownedCount;


    itemElement.appendChild(
      countElement
    );
  }


  /* -------------------------
     MISSING MARK
     ------------------------- */

  if (!owned) {

    const missingMark =
      document.createElement(
        "div"
      );


    missingMark.className =
      "collection-missing-mark";


    missingMark.textContent =
      "?";


    itemElement.appendChild(
      missingMark
    );
  }


  /* -------------------------
     NAME
     ------------------------- */

  const nameElement =
    document.createElement(
      "div"
    );


  nameElement.className =
    "collection-item-name";


  nameElement.textContent =
    owned

      ? collectible.name

      : "UNDISCOVERED";


  itemElement.appendChild(
    nameElement
  );


  return itemElement;
}


function collectibleMatchesStatus(
  collection,
  collectible
) {

  if (
    currentStatusFilter ===
    "all"
  ) {

    return true;
  }


  const owned =
    getOwnedCount(
      collection,
      collectible.id
    ) > 0;


  if (
    currentStatusFilter ===
    "owned"
  ) {

    return owned;
  }


  if (
    currentStatusFilter ===
    "missing"
  ) {

    return !owned;
  }


  return true;
}


function createRaritySection(
  rarity,
  collection
) {

  const allRarityCollectibles =
    COLLECTIBLES.filter(
      item =>
        item.rarity ===
        rarity
    );


  const visibleCollectibles =
    allRarityCollectibles.filter(
      collectible =>
        collectibleMatchesStatus(
          collection,
          collectible
        )
    );


  if (
    visibleCollectibles.length ===
    0
  ) {

    return null;
  }


  const ownedUnique =
    allRarityCollectibles.reduce(
      (
        count,
        collectible
      ) => {

        return (
          count
          +
          (
            getOwnedCount(
              collection,
              collectible.id
            ) > 0

              ? 1

              : 0
          )
        );
      },

      0
    );


  const section =
    document.createElement(
      "section"
    );


  section.className =
    "collection-section";


  section.dataset.rarity =
    rarity;


  /* -------------------------
     HEADER
     ------------------------- */

  const sectionHeader =
    document.createElement(
      "header"
    );


  sectionHeader.className =
    "collection-section-header";


  const title =
    document.createElement(
      "div"
    );


  title.className =
    "collection-section-title";


  title.textContent =
    RARITY_NAMES[
      rarity
    ];


  const count =
    document.createElement(
      "div"
    );


  count.className =
    "collection-section-count";


  count.textContent =
    ownedUnique
    +
    " / "
    +
    allRarityCollectibles.length
    +
    " DISCOVERED";


  sectionHeader.appendChild(
    title
  );


  sectionHeader.appendChild(
    count
  );


  /* -------------------------
     GRID
     ------------------------- */

  const grid =
    document.createElement(
      "div"
    );


  grid.className =
    "collection-grid";


  for (
    const collectible
    of visibleCollectibles
  ) {

    grid.appendChild(
      createCollectionItem(
        collectible,
        getOwnedCount(
          collection,
          collectible.id
        )
      )
    );
  }


  section.appendChild(
    sectionHeader
  );


  section.appendChild(
    grid
  );


  return section;
}


/* =========================
   SUMMARY
   ========================= */

function updateCollectionSummary(
  collection
) {

  ensureFilterToolbar();


  const uniqueCount =
    getSafeUniqueCount(
      collection
    );


  const missingCount =
    TOTAL_ITEMS
    -
    uniqueCount;


  const duplicates =
    getDuplicatePulls(
      collection
    );


  const totalPulls =
    getSafeTotalPulls(
      collection
    );


  collectionSummary.innerHTML = `

    <span class="cache-summary-chip">
      <strong>${uniqueCount}</strong> FOUND
    </span>

    <span class="cache-summary-chip">
      <strong>${missingCount}</strong> MISSING
    </span>

    <span class="cache-summary-chip">
      <strong>${duplicates}</strong> DUPLICATES
    </span>

    <span class="cache-summary-chip">
      <strong>${totalPulls}</strong> TOTAL PULLS
    </span>

  `;
}


/* =========================
   FILTERED SECTIONS
   ========================= */

function renderFilteredSections() {

  if (
    !currentCollection
  ) {

    return;
  }


  sectionsElement.innerHTML =
    "";


  let renderedSections =
    0;


  const rarities =
    currentRarityFilter ===
      "all"

      ? RARITY_ORDER

      : [
          currentRarityFilter
        ];


  for (
    const rarity
    of rarities
  ) {

    const section =
      createRaritySection(
        rarity,
        currentCollection
      );


    if (
      section
    ) {

      sectionsElement.appendChild(
        section
      );


      renderedSections++;
    }
  }


  if (
    renderedSections ===
    0
  ) {

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "collection-filter-empty";


    if (
      currentStatusFilter ===
      "owned"
    ) {

      empty.textContent =
        "NO DISCOVERED RELICS MATCH THIS FILTER";
    }


    else if (
      currentStatusFilter ===
      "missing"
    ) {

      empty.textContent =
        "NO MISSING RELICS MATCH THIS FILTER";
    }


    else {

      empty.textContent =
        "NO RELICS MATCH THIS FILTER";
    }


    sectionsElement.appendChild(
      empty
    );
  }
}


/* =========================
   FULL COLLECTION RENDER
   ========================= */

function renderCollection(
  collection
) {

  currentCollection =
    collection;


  currentStatusFilter =
    "all";


  currentRarityFilter =
    "all";


  ensureFilterToolbar();


  updateFilterButtonStates();


  const username =
    normalizeUsername(
      collection.username
    );


  const displayName =
    String(
      collection.display_name
      ||
      collection.username
      ||
      username
    );


  const totalPulls =
    getSafeTotalPulls(
      collection
    );


  const uniqueCount =
    getSafeUniqueCount(
      collection
    );


  const completed =
    collection.completed ===
      true

    ||

    uniqueCount >=
      TOTAL_ITEMS;


  /* -------------------------
     VIEWER NAME
     ------------------------- */

  viewerElement.textContent =
    "@"
    +
    displayName;


  /* -------------------------
     TOTAL PULLS
     ------------------------- */

  totalPullsElement.textContent =
    totalPulls;


  /* -------------------------
     PROGRESS
     ------------------------- */

  progressCountElement.textContent =
    uniqueCount
    +
    " / "
    +
    TOTAL_ITEMS;


  progressFillElement.style.width =
    (
      (
        uniqueCount
        /
        TOTAL_ITEMS
      )
      *
      100
    )
    +
    "%";


  progressMessageElement.textContent =
    getProgressMessage(
      uniqueCount,
      completed
    );


  progressMessageElement.classList.toggle(
    "complete",
    completed
  );


  /* -------------------------
     SUMMARY + ITEMS
     ------------------------- */

  updateCollectionSummary(
    collection
  );


  renderFilteredSections();


  /* -------------------------
     FOOTER
     ------------------------- */

  lastUpdatedElement.textContent =
    formatUpdatedAt(
      collection.updated_at
    );


  /* -------------------------
     SEARCH FIELD
     ------------------------- */

  searchInput.value =
    username;


  /* -------------------------
     PAGE TITLE
     ------------------------- */

  document.title =
    displayName
    +
    " · Shepherd's Cache";


  /* -------------------------
     SHOW COLLECTION
     ------------------------- */

  collectionBook.hidden =
    false;
}


/* =========================
   LOAD VIEWER
   ========================= */

async function loadViewer(
  username
) {

  const cleanUsername =
    normalizeUsername(
      username
    );


  if (
    !cleanUsername
  ) {

    currentCollection =
      null;


    collectionBook.hidden =
      true;


    document.title =
      "Shepherd's Cache";


    setStatus(
      "Enter a Twitch username to open a Shepherd's Cache.",
      "idle"
    );


    return;
  }


  searchInput.value =
    cleanUsername;


  setPageUsername(
    cleanUsername
  );


  currentCollection =
    null;


  collectionBook.hidden =
    true;


  setStatus(
    "OPENING @"
    +
    cleanUsername
    +
    "'S CACHE...",
    "loading"
  );


  try {

    const collection =
      await fetchCollection(
        cleanUsername
      );


    if (
      !collection
    ) {

      document.title =
        "Shepherd's Cache";


      setStatus(
        "No Shepherd's Cache was found for @"
        +
        cleanUsername
        +
        ".",
        "error"
      );


      return;
    }


    renderCollection(
      collection
    );


    setStatus(
      "",
      ""
    );
  }


  catch (
    error
  ) {

    console.error(
      "Shepherd's Cache collection error:",
      error
    );


    currentCollection =
      null;


    collectionBook.hidden =
      true;


    setStatus(

      error
      &&
      error.message

        ? error.message

        : "The Shepherd's Cache could not be opened.",

      "error"
    );
  }
}


/* =========================
   SEARCH
   ========================= */

searchForm.addEventListener(
  "submit",
  function(
    event
  ) {

    event.preventDefault();


    loadViewer(
      searchInput.value
    );
  }
);


/* =========================
   START
   ========================= */

ensureFilterToolbar();


const initialUsername =
  getUsernameFromPage();


if (
  initialUsername
) {

  loadViewer(
    initialUsername
  );
}


else {

  setStatus(
    "Enter a Twitch username to open a Shepherd's Cache.",
    "idle"
  );
}