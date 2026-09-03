/* =====================================================
   STRAY
   SHEPHERD'S CACHE

   PUBLIC COLLECTION BOOK
   SUPABASE VERSION
   ===================================================== */


"use strict";


/* =====================================================
   CONFIG
   ===================================================== */


const CONFIG =
  window.ShepherdCacheConfig || {};


const SUPABASE_URL =
  String(
    CONFIG.supabaseUrl || ""
  )
    .trim()
    .replace(
      /\/+$/,
      ""
    );


const SUPABASE_PUBLISHABLE_KEY =
  String(
    CONFIG.supabasePublishableKey || ""
  )
    .trim();


const TOTAL_ITEMS =
  22;



/* =====================================================
   RARITY DATA
   ===================================================== */


const RARITY_ORDER = [

  "common",
  "uncommon",
  "rare",
  "legendary"

];


const RARITY_NAMES = {

  common:
    "COMMON",

  uncommon:
    "UNCOMMON",

  rare:
    "RARE",

  legendary:
    "LEGENDARY"

};



/* =====================================================
   COLLECTIBLES
   ===================================================== */


const COLLECTIBLES = [


  /* COMMON */


  {
    id:
      "worn-bell",

    name:
      "Worn Shepherd Bell",

    rarity:
      "common",

    image:
      "assets/collectibles/worn-bell.png"
  },


  {
    id:
      "faded-wool-patch",

    name:
      "Faded Wool Patch",

    rarity:
      "common",

    image:
      "assets/collectibles/faded-wool-patch.png"
  },


  {
    id:
      "crooked-fence-charm",

    name:
      "Crooked Fence Charm",

    rarity:
      "common",

    image:
      "assets/collectibles/crooked-fence-charm.png"
  },


  {
    id:
      "wayfarers-feather",

    name:
      "Wayfarer's Feather",

    rarity:
      "common",

    image:
      "assets/collectibles/wayfarers-feather.png"
  },


  {
    id:
      "old-pasture-token",

    name:
      "Old Pasture Token",

    rarity:
      "common",

    image:
      "assets/collectibles/old-pasture-token.png"
  },



  /* UNCOMMON */


  {
    id:
      "violet-lamb",

    name:
      "Violet Wool Lamb",

    rarity:
      "uncommon",

    image:
      "assets/collectibles/violet-lamb.png"
  },


  {
    id:
      "brass-crook-charm",

    name:
      "Brass Crook Charm",

    rarity:
      "uncommon",

    image:
      "assets/collectibles/brass-crook-charm.png"
  },


  {
    id:
      "stormglass-bead",

    name:
      "Stormglass Bead",

    rarity:
      "uncommon",

    image:
      "assets/collectibles/stormglass-bead.png"
  },


  {
    id:
      "rainworn-map-fragment",

    name:
      "Rainworn Map Fragment",

    rarity:
      "uncommon",

    image:
      "assets/collectibles/rainworn-map-fragment.png"
  },


  {
    id:
      "mended-flock-tag",

    name:
      "Mended Flock Tag",

    rarity:
      "uncommon",

    image:
      "assets/collectibles/mended-flock-tag.png"
  },


  {
    id:
      "violet-thread-spool",

    name:
      "Violet Thread Spool",

    rarity:
      "uncommon",

    image:
      "assets/collectibles/violet-thread-spool.png"
  },


  {
    id:
      "wayfarers-match-tin",

    name:
      "Wayfarer's Match Tin",

    rarity:
      "uncommon",

    image:
      "assets/collectibles/wayfarers-match-tin.png"
  },



  /* RARE */


  {
    id:
      "wandering-ram",

    name:
      "Wandering Ram",

    rarity:
      "rare",

    image:
      "assets/collectibles/wandering-ram.png"
  },


  {
    id:
      "shepherds-seal",

    name:
      "Shepherd's Seal",

    rarity:
      "rare",

    image:
      "assets/collectibles/shepherds-seal.png"
  },


  {
    id:
      "lost-flock-bell",

    name:
      "Lost Flock Bell",

    rarity:
      "rare",

    image:
      "assets/collectibles/lost-flock-bell.png"
  },


  {
    id:
      "blackglass-shepherd-lantern",

    name:
      "Blackglass Shepherd Lantern",

    rarity:
      "rare",

    image:
      "assets/collectibles/blackglass-shepherd-lantern.png"
  },


  {
    id:
      "stormworn-crook-head",

    name:
      "Stormworn Crook Head",

    rarity:
      "rare",

    image:
      "assets/collectibles/stormworn-crook-head.png"
  },



  /* LEGENDARY */


  {
    id:
      "ninth-lamb",

    name:
      "The Ninth Lamb",

    rarity:
      "legendary",

    image:
      "assets/collectibles/ninth-lamb.png"
  },


  {
    id:
      "the-first-bell",

    name:
      "The First Bell",

    rarity:
      "legendary",

    image:
      "assets/collectibles/the-first-bell.png"
  },


  {
    id:
      "the-pale-ram",

    name:
      "The Pale Ram",

    rarity:
      "legendary",

    image:
      "assets/collectibles/the-pale-ram.png"
  },


  {
    id:
      "ninth-hour-reliquary",

    name:
      "Ninth Hour Reliquary",

    rarity:
      "legendary",

    image:
      "assets/collectibles/ninth-hour-reliquary.png"
  },


  {
    id:
      "cloud-ninth-familiar",

    name:
      "Cloud Ninth Familiar",

    rarity:
      "legendary",

    image:
      "assets/collectibles/cloud-ninth-familiar.png"
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

  } else {

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


function getOwnedCount(
  collection,
  itemId
) {

  const items =
    collection &&
    collection.items &&
    typeof collection.items ===
      "object"

      ? collection.items

      : {};


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
    "UPDATED " +
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



/* =====================================================
   SUPABASE
   ===================================================== */


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

          "apikey":
            SUPABASE_PUBLISHABLE_KEY,

          "Content-Type":
            "application/json",

          "Accept":
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


  if (responseText) {

    try {

      data =
        JSON.parse(
          responseText
        );

    }

    catch {

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
      data &&
      typeof data ===
        "object" &&
      data.message
    ) {

      message +=
        " " +
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

    return (
      data.length > 0
        ? data[0]
        : null
    );
  }


  if (
    data &&
    typeof data ===
      "object"
  ) {

    return data;
  }


  return null;

}



/* =====================================================
   COLLECTION RENDERING
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
    ownedCount >
    1
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


function createRaritySection(
  rarity,
  collection
) {

  const collectibles =
    COLLECTIBLES.filter(
      item =>
        item.rarity ===
        rarity
    );


  let ownedUnique =
    0;


  for (
    const collectible
    of collectibles
  ) {

    if (
      getOwnedCount(
        collection,
        collectible.id
      ) > 0
    ) {

      ownedUnique++;
    }
  }


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
    collectibles.length
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
    of collectibles
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


function renderCollection(
  collection
) {

  const username =
    normalizeUsername(
      collection.username
    );


  const displayName =
    String(
      collection.display_name ||
      collection.username ||
      username
    );


  const totalPulls =
    Number(
      collection.total_pulls ||
      0
    );


  let uniqueCount =
    Number(
      collection.unique_count ||
      0
    );


  if (
    !Number.isFinite(
      uniqueCount
    )
  ) {

    uniqueCount =
      0;
  }


  uniqueCount =
    Math.max(
      0,
      Math.min(
        TOTAL_ITEMS,
        Math.floor(
          uniqueCount
        )
      )
    );


  viewerElement.textContent =
    "@"
    +
    displayName;


  totalPullsElement.textContent =
    Number.isFinite(
      totalPulls
    )
      ? Math.max(
          0,
          Math.floor(
            totalPulls
          )
        )
      : 0;


  progressCountElement.textContent =
    uniqueCount
    +
    " / "
    +
    TOTAL_ITEMS;


  const progressPercent =
    (
      uniqueCount /
      TOTAL_ITEMS
    )
    *
    100;


  progressFillElement.style.width =
    progressPercent
    +
    "%";


  const completed =
    collection.completed ===
      true
    ||
    uniqueCount >=
      TOTAL_ITEMS;


  if (completed) {

    progressMessageElement.textContent =
      "THE FLOCK IS COMPLETE";


    progressMessageElement.classList.add(
      "complete"
    );

  }

  else {

    progressMessageElement.textContent =
      "THE FLOCK IS STILL GATHERING";


    progressMessageElement.classList.remove(
      "complete"
    );
  }


  sectionsElement.innerHTML =
    "";


  for (
    const rarity
    of RARITY_ORDER
  ) {

    sectionsElement.appendChild(

      createRaritySection(
        rarity,
        collection
      )

    );
  }


  lastUpdatedElement.textContent =
    formatUpdatedAt(
      collection.updated_at
    );


  searchInput.value =
    username;


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


  if (!cleanUsername) {

    collectionBook.hidden =
      true;


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


    if (!collection) {

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


    collectionBook.hidden =
      true;


    setStatus(
      error &&
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


const initialUsername =
  getUsernameFromPage();


if (initialUsername) {

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