/* =====================================================
   STRAY - SHEPHERD'S CACHE
   PUBLIC COLLECTION BOOK
   SERIES I - 50 COLLECTIBLES

   Supabase RPC + filters + sharing + stats + completion
   ===================================================== */

"use strict";

const CONFIG = window.ShepherdCacheConfig || {};
const SUPABASE_URL = String(CONFIG.supabaseUrl || "").trim().replace(/\/+$/, "");
const SUPABASE_PUBLISHABLE_KEY = String(CONFIG.supabasePublishableKey || "").trim();

const TOTAL_ITEMS = 50;

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

const RARITY_TOTALS = {
  common: 20,
  uncommon: 15,
  rare: 10,
  legendary: 5
};

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

  {
    id: "shepherds-twine-bundle",
    name: "Shepherd's Twine Bundle",
    rarity: "common",
    image: "assets/collectibles/shepherds-twine-bundle.png"
  },

  {
    id: "bent-gate-hinge",
    name: "Bent Gate Hinge",
    rarity: "common",
    image: "assets/collectibles/bent-gate-hinge.png"
  },

  {
    id: "flock-chalk-stub",
    name: "Flock Chalk Stub",
    rarity: "common",
    image: "assets/collectibles/flock-chalk-stub.png"
  },

  {
    id: "worn-wool-comb",
    name: "Worn Wool Comb",
    rarity: "common",
    image: "assets/collectibles/worn-wool-comb.png"
  },

  {
    id: "weathered-tin-cup",
    name: "Weathered Tin Cup",
    rarity: "common",
    image: "assets/collectibles/weathered-tin-cup.png"
  },

  {
    id: "mended-work-glove",
    name: "Mended Work Glove",
    rarity: "common",
    image: "assets/collectibles/mended-work-glove.png"
  },

  {
    id: "field-needle-case",
    name: "Field Needle Case",
    rarity: "common",
    image: "assets/collectibles/field-needle-case.png"
  },

  {
    id: "split-fence-peg",
    name: "Split Fence Peg",
    rarity: "common",
    image: "assets/collectibles/split-fence-peg.png"
  },

  {
    id: "old-brass-buckle",
    name: "Old Brass Buckle",
    rarity: "common",
    image: "assets/collectibles/old-brass-buckle.png"
  },

  {
    id: "tallow-candle-stub",
    name: "Tallow Candle Stub",
    rarity: "common",
    image: "assets/collectibles/tallow-candle-stub.png"
  },

  {
    id: "folded-feed-sack",
    name: "Folded Feed Sack",
    rarity: "common",
    image: "assets/collectibles/folded-feed-sack.png"
  },

  {
    id: "crookmakers-wood-offcut",
    name: "Crookmaker's Wood Offcut",
    rarity: "common",
    image: "assets/collectibles/crookmakers-wood-offcut.png"
  },

  {
    id: "sootnose-lamb",
    name: "Sootnose Lamb",
    rarity: "common",
    image: "assets/collectibles/sootnose-lamb.png"
  },

  {
    id: "fencepost-sparrow",
    name: "Fencepost Sparrow",
    rarity: "common",
    image: "assets/collectibles/fencepost-sparrow.png"
  },

  {
    id: "pasture-mouse",
    name: "Pasture Mouse",
    rarity: "common",
    image: "assets/collectibles/pasture-mouse.png"
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

  {
    id: "shepherds-knot-charm",
    name: "Shepherd's Knot Charm",
    rarity: "uncommon",
    image: "assets/collectibles/shepherds-knot-charm.png"
  },

  {
    id: "stormstitch-needle",
    name: "Stormstitch Needle",
    rarity: "uncommon",
    image: "assets/collectibles/stormstitch-needle.png"
  },

  {
    id: "violet-rain-flask",
    name: "Violet Rain Flask",
    rarity: "uncommon",
    image: "assets/collectibles/violet-rain-flask.png"
  },

  {
    id: "black-feather-keepsake",
    name: "Black Feather Keepsake",
    rarity: "uncommon",
    image: "assets/collectibles/black-feather-keepsake.png"
  },

  {
    id: "brass-field-compass",
    name: "Brass Field Compass",
    rarity: "uncommon",
    image: "assets/collectibles/brass-field-compass.png"
  },

  {
    id: "mended-bell-strap",
    name: "Mended Bell Strap",
    rarity: "uncommon",
    image: "assets/collectibles/mended-bell-strap.png"
  },

  {
    id: "ashen-lamb-figurine",
    name: "Ashen Lamb Figurine",
    rarity: "uncommon",
    image: "assets/collectibles/ashen-lamb-figurine.png"
  },

  {
    id: "gatekeepers-brass-key",
    name: "Gatekeeper's Brass Key",
    rarity: "uncommon",
    image: "assets/collectibles/gatekeepers-brass-key.png"
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

  {
    id: "blackwool-ewe",
    name: "Blackwool Ewe",
    rarity: "rare",
    image: "assets/collectibles/blackwool-ewe.png"
  },

  {
    id: "shepherds-field-journal",
    name: "Shepherd's Field Journal",
    rarity: "rare",
    image: "assets/collectibles/shepherds-field-journal.png"
  },

  {
    id: "stormglass-crook-ring",
    name: "Stormglass Crook Ring",
    rarity: "rare",
    image: "assets/collectibles/stormglass-crook-ring.png"
  },

  {
    id: "nightwatch-signal-horn",
    name: "Nightwatch Signal Horn",
    rarity: "rare",
    image: "assets/collectibles/nightwatch-signal-horn.png"
  },

  {
    id: "rainworn-flock-standard",
    name: "Rainworn Flock Standard",
    rarity: "rare",
    image: "assets/collectibles/rainworn-flock-standard.png"
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


/* =====================================================
   ELEMENTS
   ===================================================== */

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


/* =====================================================
   STATE
   ===================================================== */

let currentCollection =
  null;

let currentStatusFilter =
  "all";

let currentRarityFilter =
  "all";

let filterToolbar =
  null;

let collectionSummary =
  null;

let statsPanel =
  null;

let shareButton =
  null;

let completionBanner =
  null;


/* =====================================================
   HELPERS
   ===================================================== */

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

  if (!statusElement) {
    return;
  }


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


  if (
    cleanUsername
  ) {

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
    !collection
    ||
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
        parsed
        &&
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
    )
    ||
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
        count
        +
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
      collection
      &&
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
      collection
      &&
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


function isCollectionComplete(
  collection
) {

  /*
     This is intentionally based on 50 unique items,
     not an old stored completed=true value from the
     original 22-item collection.
  */

  return (
    !!collection
    &&
    getSafeUniqueCount(
      collection
    ) >=
      TOTAL_ITEMS
  );
}


function getUniqueByRarity(
  collection,
  rarity
) {

  return COLLECTIBLES

    .filter(
      item =>
        item.rarity ===
        rarity
    )

    .reduce(
      (
        count,
        item
      ) => {

        return (
          count
          +
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


function getPullsByRarity(
  collection,
  rarity
) {

  return COLLECTIBLES

    .filter(
      item =>
        item.rarity ===
        rarity
    )

    .reduce(
      (
        count,
        item
      ) => {

        return (
          count
          +
          getOwnedCount(
            collection,
            item.id
          )
        );
      },

      0
    );
}


function getMostOwnedRelic(
  collection
) {

  let best =
    null;


  let bestCount =
    0;


  for (
    const item
    of COLLECTIBLES
  ) {

    const count =
      getOwnedCount(
        collection,
        item.id
      );


    if (
      count >
      bestCount
    ) {

      best =
        item;


      bestCount =
        count;
    }
  }


  return best

    ? {
        item:
          best,

        count:
          bestCount
      }

    : null;
}


function percent(
  numerator,
  denominator
) {

  if (
    !denominator
    ||
    denominator <= 0
  ) {

    return 0;
  }


  return Math.max(
    0,
    Math.min(
      100,

      Math.round(
        (
          numerator
          /
          denominator
        )
        *
        100
      )
    )
  );
}


function formatUpdatedAt(
  rawValue
) {

  if (
    !rawValue
  ) {

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
        month:
          "short",

        day:
          "numeric",

        year:
          "numeric",

        hour:
          "numeric",

        minute:
          "2-digit"
      }
    )
  );
}


function getProgressMessage(
  uniqueCount,
  completed
) {

  if (
    completed
  ) {

    return "THE FLOCK IS COMPLETE";
  }


  if (
    uniqueCount >= 40
  ) {

    return "THE FINAL STRETCH";
  }


  if (
    uniqueCount >= 30
  ) {

    return "THE CACHE REMEMBERS";
  }


  if (
    uniqueCount >= 20
  ) {

    return "THE FLOCK GATHERS";
  }


  if (
    uniqueCount >= 10
  ) {

    return "THE TRAIL BEGINS";
  }


  return "THE FLOCK IS STILL GATHERING";
}


/* =====================================================
   ENHANCEMENT STYLES
   ===================================================== */

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

    #collection-tools,
    #collection-stats {

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


    .cache-summary-chip.complete-chip {

      border-color:
        rgba(184, 140, 255, 0.62);

      background:

        linear-gradient(
          135deg,
          rgba(116, 101, 140, 0.34),
          rgba(154, 116, 70, 0.18)
        );

      color:
        #b88cff;

      box-shadow:
        0 0 16px
        rgba(184, 140, 255, 0.11);
    }


    /* ===============================================
       STATS
       =============================================== */

    #collection-stats-title {

      margin-bottom:
        12px;

      text-align:
        center;

      color:
        var(
          --stray-brass,
          #9a7446
        );

      font-family:
        "Cinzel",
        serif;

      font-size:
        11px;

      font-weight:
        800;

      letter-spacing:
        2.4px;
    }


    #collection-stats-grid {

      display:
        grid;

      grid-template-columns:
        repeat(
          4,
          minmax(0, 1fr)
        );

      gap:
        8px;
    }


    .cache-stat-card {

      min-width:
        0;

      padding:
        10px 8px;

      border:
        1px solid
        rgba(231, 221, 200, 0.09);

      border-radius:
        9px;

      background:
        rgba(13, 14, 15, 0.58);

      text-align:
        center;
    }


    .cache-stat-card.stat-common {

      border-color:
        rgba(191, 180, 157, 0.22);
    }


    .cache-stat-card.stat-uncommon {

      border-color:
        rgba(116, 101, 140, 0.36);
    }


    .cache-stat-card.stat-rare {

      border-color:
        rgba(184, 152, 109, 0.38);
    }


    .cache-stat-card.stat-legendary {

      border-color:
        rgba(184, 140, 255, 0.42);
    }


    .cache-stat-value {

      color:
        var(
          --stray-cream,
          #e7ddc8
        );

      font-family:
        "Cinzel",
        serif;

      font-size:
        16px;

      font-weight:
        800;

      line-height:
        1.1;
    }


    .cache-stat-label {

      margin-top:
        5px;

      color:
        var(
          --stray-cream-muted,
          #bfb49d
        );

      font-size:
        8px;

      font-weight:
        800;

      letter-spacing:
        1.2px;

      line-height:
        1.25;
    }


    .cache-stat-sub {

      margin-top:
        4px;

      color:
        rgba(191, 180, 157, 0.72);

      font-size:
        8px;

      line-height:
        1.25;
    }


    #collection-rarity-stats {

      display:
        grid;

      grid-template-columns:
        repeat(
          4,
          minmax(0, 1fr)
        );

      gap:
        8px;

      margin-top:
        8px;
    }


    #collection-most-owned {

      margin-top:
        9px;

      padding:
        9px 11px;

      border:
        1px dashed
        rgba(154, 116, 70, 0.25);

      border-radius:
        8px;

      text-align:
        center;

      color:
        var(
          --stray-cream-muted,
          #bfb49d
        );

      font-size:
        9px;

      letter-spacing:
        0.8px;
    }


    #collection-most-owned strong {

      color:
        var(
          --stray-cream,
          #e7ddc8
        );

      font-family:
        "Cinzel",
        serif;
    }


    /* ===============================================
       FILTERS
       =============================================== */

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

        border-color
        0.18s
        ease,

        background
        0.18s
        ease,

        color
        0.18s
        ease,

        transform
        0.18s
        ease;
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


    /* ===============================================
       COMPLETION
       =============================================== */

    #cache-completion-banner {

      position:
        relative;

      z-index:
        4;

      display:
        none;

      overflow:
        hidden;

      margin:
        10px 0 15px;

      padding:
        21px 18px 18px;

      border:
        1px solid
        rgba(184, 140, 255, 0.68);

      border-radius:
        14px;

      background:

        radial-gradient(
          circle at 50% 0%,
          rgba(184, 140, 255, 0.19),
          transparent 54%
        ),

        radial-gradient(
          circle at 50% 100%,
          rgba(154, 116, 70, 0.15),
          transparent 62%
        ),

        linear-gradient(
          145deg,
          rgba(34, 30, 41, 0.97),
          rgba(13, 14, 15, 0.98)
        );

      text-align:
        center;

      box-shadow:

        0 0 28px
        rgba(184, 140, 255, 0.12),

        inset
        0 0 30px
        rgba(154, 116, 70, 0.06);
    }


    #collection-book.is-complete
    #cache-completion-banner {

      display:
        block;

      animation:
        cacheCompletionBannerIn
        0.65s
        ease
        both;
    }


    #cache-completion-banner::before {

      content:
        "";

      position:
        absolute;

      inset:
        7px;

      border:
        1px dashed
        rgba(231, 221, 200, 0.13);

      border-radius:
        9px;

      pointer-events:
        none;
    }


    #cache-completion-seal {

      width:
        50px;

      height:
        50px;

      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      margin:
        0 auto 9px;

      border:
        1px solid
        rgba(154, 116, 70, 0.8);

      border-radius:
        50%;

      background:

        radial-gradient(
          circle,
          rgba(184, 140, 255, 0.23),
          rgba(13, 14, 15, 0.9)
        );

      color:
        #e7ddc8;

      font-family:
        "Cinzel",
        serif;

      font-size:
        23px;

      font-weight:
        800;

      text-shadow:
        0 0 12px
        rgba(184, 140, 255, 0.7);

      box-shadow:

        0 0 19px
        rgba(184, 140, 255, 0.16),

        inset
        0 0 12px
        rgba(154, 116, 70, 0.12);
    }


    #cache-completion-kicker {

      color:
        var(
          --stray-brass,
          #9a7446
        );

      font-size:
        9px;

      font-weight:
        800;

      letter-spacing:
        3px;
    }


    #cache-completion-title {

      margin-top:
        5px;

      color:
        var(
          --stray-cream,
          #e7ddc8
        );

      font-family:
        "Cinzel",
        serif;

      font-size:
        23px;

      font-weight:
        800;

      letter-spacing:
        1.2px;

      text-shadow:

        0 0 16px
        rgba(184, 140, 255, 0.38),

        0 3px 4px
        rgba(0, 0, 0, 0.7);
    }


    #cache-completion-count {

      margin-top:
        6px;

      color:
        #b88cff;

      font-family:
        "Cinzel",
        serif;

      font-size:
        18px;

      font-weight:
        800;

      letter-spacing:
        3px;
    }


    #cache-completion-copy {

      margin-top:
        7px;

      color:
        var(
          --stray-cream-muted,
          #bfb49d
        );

      font-size:
        10px;

      font-weight:
        600;

      letter-spacing:
        1px;
    }


    @keyframes cacheCompletionBannerIn {

      from {

        opacity:
          0;

        transform:
          translateY(10px)
          scale(0.98);
      }


      to {

        opacity:
          1;

        transform:
          translateY(0)
          scale(1);
      }
    }


    #collection-book.is-complete
    #collection-book-panel {

      border-color:
        rgba(184, 140, 255, 0.66);

      box-shadow:

        0 24px 70px
        rgba(0, 0, 0, 0.72),

        0 0 36px
        rgba(184, 140, 255, 0.12),

        inset
        0 0 50px
        rgba(116, 101, 140, 0.07);
    }


    #collection-book.is-complete
    #collection-book-viewer,

    #collection-book.is-complete
    #book-progress-count,

    #collection-book.is-complete
    #book-progress-message {

      color:
        #b88cff;

      text-shadow:
        0 0 12px
        rgba(184, 140, 255, 0.32);
    }


    #collection-book.is-complete
    #book-progress-fill {

      background:

        linear-gradient(
          90deg,
          #5d452d,
          #9a7446,
          #b88cff,
          #e7ddc8
        );

      background-size:
        200% 100%;

      animation:
        completedProgressShimmer
        3.8s
        linear
        infinite;
    }


    @keyframes completedProgressShimmer {

      from {

        background-position:
          0% 50%;
      }


      to {

        background-position:
          200% 50%;
      }
    }


    #collection-book.is-complete
    .collection-item.rarity-legendary.owned {

      border-color:
        rgba(184, 140, 255, 0.82);

      box-shadow:

        inset
        0 0 30px
        rgba(116, 101, 140, 0.17),

        0 0 17px
        rgba(184, 140, 255, 0.12);
    }


    #collection-book.is-complete
    #collection-share-link {

      border-color:
        rgba(184, 140, 255, 0.52);

      color:
        #b88cff;

      background:

        linear-gradient(
          135deg,
          rgba(116, 101, 140, 0.28),
          rgba(36, 36, 38, 0.8)
        );
    }


    @media (
      prefers-reduced-motion: reduce
    ) {

      #collection-book.is-complete
      #book-progress-fill,

      #collection-book.is-complete
      #cache-completion-banner {

        animation:
          none !important;
      }
    }


    @media (
      max-width: 760px
    ) {

      #collection-stats-grid,
      #collection-rarity-stats {

        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );
      }
    }


    @media (
      max-width: 620px
    ) {

      #collection-tools,
      #collection-stats {

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


      #cache-completion-title {

        font-size:
          19px;
      }
    }

  `;


  document.head.appendChild(
    style
  );
}


/* =====================================================
   COMPLETION BANNER
   ===================================================== */

function ensureCompletionBanner() {

  if (
    completionBanner
  ) {

    return;
  }


  completionBanner =
    document.createElement(
      "section"
    );


  completionBanner.id =
    "cache-completion-banner";


  completionBanner.innerHTML = `

    <div id="cache-completion-seal">
      IX
    </div>

    <div id="cache-completion-kicker">
      COMPLETE COLLECTION
    </div>

    <div id="cache-completion-title">
      THE FLOCK IS COMPLETE
    </div>

    <div id="cache-completion-count">
      50 / 50
    </div>

    <div id="cache-completion-copy">
      Every relic of Shepherd's Cache Series I has been recovered.
    </div>

  `;


  if (
    filterToolbar
    &&
    filterToolbar.parentNode
  ) {

    filterToolbar.parentNode.insertBefore(
      completionBanner,
      filterToolbar
    );
  }

  else if (
    sectionsElement
    &&
    sectionsElement.parentNode
  ) {

    sectionsElement.parentNode.insertBefore(
      completionBanner,
      sectionsElement
    );
  }
}


/* =====================================================
   STAT PANEL
   ===================================================== */

function ensureStatsPanel() {

  if (
    statsPanel
  ) {

    return;
  }


  statsPanel =
    document.createElement(
      "section"
    );


  statsPanel.id =
    "collection-stats";


  statsPanel.innerHTML = `

    <div id="collection-stats-title">
      COLLECTION STATISTICS
    </div>

    <div id="collection-stats-grid">
    </div>

    <div id="collection-rarity-stats">
    </div>

    <div id="collection-most-owned">
    </div>

  `;


  if (
    filterToolbar
    &&
    filterToolbar.parentNode
  ) {

    filterToolbar.parentNode.insertBefore(
      statsPanel,
      filterToolbar
    );
  }
}


/* =====================================================
   COMPLETION
   ===================================================== */

function updateCompletionTreatment(
  collection
) {

  ensureCompletionBanner();


  const completed =
    isCollectionComplete(
      collection
    );


  collectionBook.classList.toggle(
    "is-complete",
    completed
  );


  if (
    shareButton
  ) {

    shareButton.textContent =
      completed

        ? "COPY COMPLETED COLLECTION LINK"

        : "COPY THIS COLLECTION LINK";
  }
}


/* =====================================================
   FILTER BUTTONS
   ===================================================== */

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


/* =====================================================
   TOOLBAR
   ===================================================== */

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


  sectionsElement.parentNode.insertBefore(
    filterToolbar,
    sectionsElement
  );


  ensureStatsPanel();


  ensureCompletionBanner();


  updateFilterButtonStates();
}


/* =====================================================
   FILTER STATES
   ===================================================== */

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


/* =====================================================
   SHARE
   ===================================================== */

function getDefaultShareButtonText() {

  return (
    currentCollection
    &&
    isCollectionComplete(
      currentCollection
    )
  )

    ? "COPY COMPLETED COLLECTION LINK"

    : "COPY THIS COLLECTION LINK";
}


async function copyCollectionLink() {

  const url =
    window.location.href;


  let copied =
    false;


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


  if (
    !copied
  ) {

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
        getDefaultShareButtonText();


      shareButton.classList.remove(
        "is-copied"
      );

    },
    1600
  );
}


/* =====================================================
   SUPABASE
   ===================================================== */

async function fetchCollection(
  username
) {

  if (
    !SUPABASE_URL
  ) {

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


/* =====================================================
   COLLECTION CARD
   ===================================================== */

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


  if (
    !owned
  ) {

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


/* =====================================================
   FILTER MATCH
   ===================================================== */

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


/* =====================================================
   RARITY SECTIONS
   ===================================================== */

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
    getUniqueByRarity(
      collection,
      rarity
    );


  const section =
    document.createElement(
      "section"
    );


  section.className =
    "collection-section";


  section.dataset.rarity =
    rarity;


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


/* =====================================================
   SUMMARY
   ===================================================== */

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


  const completed =
    isCollectionComplete(
      collection
    );


  collectionSummary.innerHTML = `

    ${
      completed

        ? `
          <span class="cache-summary-chip complete-chip">
            <strong>✓</strong> COMPLETE COLLECTION
          </span>
        `

        : ""
    }

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


/* =====================================================
   COLLECTION STATS
   ===================================================== */

function updateCollectionStats(
  collection
) {

  ensureStatsPanel();


  const uniqueCount =
    getSafeUniqueCount(
      collection
    );


  const totalPulls =
    getSafeTotalPulls(
      collection
    );


  const duplicatePulls =
    getDuplicatePulls(
      collection
    );


  const completionPercent =
    percent(
      uniqueCount,
      TOTAL_ITEMS
    );


  const discoveryRate =
    percent(
      uniqueCount,
      totalPulls
    );


  const duplicateRate =
    percent(
      duplicatePulls,
      totalPulls
    );


  const legendaryPulls =
    getPullsByRarity(
      collection,
      "legendary"
    );


  const mostOwned =
    getMostOwnedRelic(
      collection
    );


  const statsGrid =
    statsPanel.querySelector(
      "#collection-stats-grid"
    );


  const rarityStats =
    statsPanel.querySelector(
      "#collection-rarity-stats"
    );


  const mostOwnedElement =
    statsPanel.querySelector(
      "#collection-most-owned"
    );


  statsGrid.innerHTML = `

    <div class="cache-stat-card">

      <div class="cache-stat-value">
        ${completionPercent}%
      </div>

      <div class="cache-stat-label">
        COLLECTION COMPLETE
      </div>

      <div class="cache-stat-sub">
        ${uniqueCount} of ${TOTAL_ITEMS} relics
      </div>

    </div>


    <div class="cache-stat-card">

      <div class="cache-stat-value">
        ${discoveryRate}%
      </div>

      <div class="cache-stat-label">
        DISCOVERY RATE
      </div>

      <div class="cache-stat-sub">
        unique relics per pull
      </div>

    </div>


    <div class="cache-stat-card">

      <div class="cache-stat-value">
        ${duplicateRate}%
      </div>

      <div class="cache-stat-label">
        DUPLICATE RATE
      </div>

      <div class="cache-stat-sub">
        ${duplicatePulls} duplicate pulls
      </div>

    </div>


    <div class="cache-stat-card stat-legendary">

      <div class="cache-stat-value">
        ${legendaryPulls}
      </div>

      <div class="cache-stat-label">
        LEGENDARY PULLS
      </div>

      <div class="cache-stat-sub">
        including duplicates
      </div>

    </div>

  `;


  rarityStats.innerHTML =
    RARITY_ORDER

      .map(
        rarity => {

          const unique =
            getUniqueByRarity(
              collection,
              rarity
            );


          const pulls =
            getPullsByRarity(
              collection,
              rarity
            );


          const total =
            RARITY_TOTALS[
              rarity
            ];


          return `

            <div class="cache-stat-card stat-${rarity}">

              <div class="cache-stat-value">
                ${unique}/${total}
              </div>

              <div class="cache-stat-label">
                ${RARITY_NAMES[rarity]}
              </div>

              <div class="cache-stat-sub">
                ${pulls} total pull${pulls === 1 ? "" : "s"}
              </div>

            </div>

          `;
        }
      )

      .join(
        ""
      );


  if (
    !mostOwned
    ||
    mostOwned.count <= 0
  ) {

    mostOwnedElement.innerHTML =
      "MOST OWNED RELIC · <strong>NONE YET</strong>";
  }

  else {

    mostOwnedElement.innerHTML =
      "MOST OWNED RELIC · <strong>"
      +
      mostOwned.item.name
      +
      "</strong> · ×"
      +
      mostOwned.count;
  }
}


/* =====================================================
   RENDER FILTERS
   ===================================================== */

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


/* =====================================================
   FULL RENDER
   ===================================================== */

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
    isCollectionComplete(
      collection
    );


  viewerElement.textContent =
    "@"
    +
    displayName;


  totalPullsElement.textContent =
    totalPulls;


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


  updateCompletionTreatment(
    collection
  );


  updateCollectionSummary(
    collection
  );


  updateCollectionStats(
    collection
  );


  renderFilteredSections();


  lastUpdatedElement.textContent =
    formatUpdatedAt(
      collection.updated_at
    );


  searchInput.value =
    username;


  document.title =
    completed

      ? displayName
        +
        " · 50/50 · Shepherd's Cache"

      : displayName
        +
        " · Shepherd's Cache";


  collectionBook.hidden =
    false;
}


/* =====================================================
   LOAD VIEWER
   ===================================================== */

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


    collectionBook.classList.remove(
      "is-complete"
    );


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


  collectionBook.classList.remove(
    "is-complete"
  );


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


    collectionBook.classList.remove(
      "is-complete"
    );


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


/* =====================================================
   SEARCH
   ===================================================== */

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


/* =====================================================
   START
   ===================================================== */

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