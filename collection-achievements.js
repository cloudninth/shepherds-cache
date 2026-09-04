/* =====================================================
   STRAY
   SHEPHERD'S CACHE

   COLLECTION ACHIEVEMENTS
   + BOTTOM PANEL LAYOUT
   + COLLAPSIBLE STATISTICS
   + COLLAPSIBLE ACHIEVEMENTS

   No Supabase changes.
   No Streamer.bot changes.
   No collection.js changes.
   ===================================================== */

"use strict";


/* =====================================================
   ACHIEVEMENT DEFINITIONS
   ===================================================== */

const SHEPHERD_CACHE_ACHIEVEMENTS = [

  {
    id: "first-relic",
    title: "FIRST RELIC",
    description: "Discover your first relic.",
    symbol: "I",
    type: "unique",
    required: 1
  },

  {
    id: "trail-begins",
    title: "THE TRAIL BEGINS",
    description: "Discover 5 relics.",
    symbol: "V",
    type: "unique",
    required: 5
  },

  {
    id: "flock-gathers",
    title: "THE FLOCK GATHERS",
    description: "Discover 10 relics.",
    symbol: "X",
    type: "unique",
    required: 10
  },

  {
    id: "cache-remembers",
    title: "THE CACHE REMEMBERS",
    description: "Discover 15 relics.",
    symbol: "XV",
    type: "unique",
    required: 15
  },

  {
    id: "final-stretch",
    title: "THE FINAL STRETCH",
    description: "Discover 20 relics.",
    symbol: "XX",
    type: "unique",
    required: 20
  },

  {
    id: "flock-complete",
    title: "THE FLOCK IS COMPLETE",
    description: "Recover every relic in the Shepherd's Cache.",
    symbol: "IX",
    type: "unique",
    required: 22,
    legendary: true
  },

  {
    id: "common-keeper",
    title: "COMMON KEEPER",
    description: "Complete the Common collection.",
    symbol: "C",
    type: "rarity",
    rarity: "common",
    required: 5
  },

  {
    id: "uncommon-keeper",
    title: "UNCOMMON KEEPER",
    description: "Complete the Uncommon collection.",
    symbol: "U",
    type: "rarity",
    rarity: "uncommon",
    required: 7
  },

  {
    id: "rare-keeper",
    title: "RARE KEEPER",
    description: "Complete the Rare collection.",
    symbol: "R",
    type: "rarity",
    rarity: "rare",
    required: 5
  },

  {
    id: "legendary-keeper",
    title: "LEGENDARY KEEPER",
    description: "Complete the Legendary collection.",
    symbol: "L",
    type: "rarity",
    rarity: "legendary",
    required: 5,
    legendary: true
  }

];


/* =====================================================
   STATE
   ===================================================== */

let shepherdAchievementsPanel = null;

let shepherdAchievementsGrid = null;

let shepherdAchievementsSummary = null;

let shepherdAchievementRenderTimer = null;


/* =====================================================
   STYLES
   ===================================================== */

function injectShepherdAchievementStyles() {

  if (
    document.getElementById(
      "shepherd-cache-achievement-styles"
    )
  ) {
    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "shepherd-cache-achievement-styles";


  style.textContent = `

    /* ===============================================
       BOTTOM PANEL SHARED STYLE
       =============================================== */

    #collection-stats,
    #shepherd-achievements {

      position:
        relative;

      z-index:
        3;

      margin:
        14px 0 0;

      padding:
        0;

      overflow:
        hidden;

      border:
        1px solid
        rgba(154, 116, 70, 0.28);

      border-radius:
        12px;

      background:

        radial-gradient(
          circle at 50% 0%,
          rgba(116, 101, 140, 0.09),
          transparent 65%
        ),

        rgba(10, 11, 12, 0.46);
    }


    /* ===============================================
       COLLAPSIBLE HEADER
       =============================================== */

    .cache-bottom-toggle {

      appearance:
        none;

      width:
        100%;

      min-height:
        52px;

      display:
        flex;

      align-items:
        center;

      justify-content:
        space-between;

      gap:
        12px;

      padding:
        13px 15px;

      border:
        0;

      background:
        rgba(13, 14, 15, 0.40);

      color:
        inherit;

      cursor:
        pointer;

      text-align:
        left;

      transition:

        background
        0.18s
        ease,

        border-color
        0.18s
        ease;
    }


    .cache-bottom-toggle:hover {

      background:
        rgba(116, 101, 140, 0.10);
    }


    .cache-bottom-toggle:focus-visible {

      outline:
        2px solid
        rgba(184, 140, 255, 0.72);

      outline-offset:
        -2px;
    }


    .cache-bottom-toggle-left {

      min-width:
        0;

      display:
        flex;

      flex-direction:
        column;

      gap:
        3px;
    }


    .cache-bottom-toggle-title {

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
        2.2px;
    }


    .cache-bottom-toggle-subtitle {

      color:
        rgba(191, 180, 157, 0.68);

      font-size:
        8px;

      font-weight:
        700;

      letter-spacing:
        0.8px;
    }


    .cache-bottom-toggle-right {

      flex:
        0 0 auto;

      display:
        flex;

      align-items:
        center;

      gap:
        10px;
    }


    .cache-bottom-toggle-summary {

      color:
        var(
          --stray-cream-muted,
          #bfb49d
        );

      font-size:
        9px;

      font-weight:
        800;

      letter-spacing:
        1px;

      white-space:
        nowrap;
    }


    .cache-bottom-toggle-summary strong {

      color:
        #b88cff;

      font-family:
        "Cinzel",
        serif;

      font-size:
        11px;
    }


    .cache-bottom-toggle-chevron {

      width:
        25px;

      height:
        25px;

      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      border:
        1px solid
        rgba(154, 116, 70, 0.34);

      border-radius:
        50%;

      color:
        var(
          --stray-cream-muted,
          #bfb49d
        );

      font-size:
        15px;

      font-weight:
        700;

      line-height:
        1;

      transform:
        rotate(0deg);

      transition:
        transform
        0.22s
        ease;
    }


    .cache-bottom-toggle[aria-expanded="true"]
    .cache-bottom-toggle-chevron {

      transform:
        rotate(180deg);
    }


    /* ===============================================
       COLLAPSIBLE BODY
       =============================================== */

    .cache-bottom-collapse-body {

      padding:
        0 15px 15px;

      border-top:
        1px solid
        rgba(154, 116, 70, 0.15);
    }


    .cache-bottom-collapse-body[hidden] {

      display:
        none !important;
    }


    /* ===============================================
       COLLECTION STATISTICS FIXES
       =============================================== */

    #collection-stats-title {

      display:
        none !important;
    }


    #collection-stats
    #collection-stats-grid {

      margin-top:
        14px;
    }


    /* ===============================================
       ACHIEVEMENT GRID
       =============================================== */

    #shepherd-achievements-grid {

      display:
        grid;

      grid-template-columns:
        repeat(
          5,
          minmax(0, 1fr)
        );

      gap:
        8px;

      margin-top:
        14px;
    }


    /* ===============================================
       ACHIEVEMENT CARD
       =============================================== */

    .shepherd-achievement {

      position:
        relative;

      min-width:
        0;

      min-height:
        135px;

      overflow:
        hidden;

      display:
        flex;

      flex-direction:
        column;

      align-items:
        center;

      justify-content:
        flex-start;

      padding:
        12px 8px 10px;

      border:
        1px solid
        rgba(231, 221, 200, 0.08);

      border-radius:
        10px;

      background:
        rgba(13, 14, 15, 0.62);

      text-align:
        center;

      transition:

        transform
        0.18s
        ease,

        border-color
        0.18s
        ease,

        box-shadow
        0.18s
        ease;
    }


    .shepherd-achievement.is-unlocked {

      border-color:
        rgba(154, 116, 70, 0.46);

      background:

        radial-gradient(
          circle at 50% 0%,
          rgba(154, 116, 70, 0.10),
          transparent 60%
        ),

        rgba(20, 19, 18, 0.72);
    }


    .shepherd-achievement.is-unlocked:hover {

      transform:
        translateY(-2px);

      border-color:
        rgba(184, 140, 255, 0.48);

      box-shadow:
        0 7px 18px
        rgba(0, 0, 0, 0.28);
    }


    .shepherd-achievement.is-locked {

      opacity:
        0.42;

      filter:
        grayscale(0.72);
    }


    /* ===============================================
       ACHIEVEMENT SEAL
       =============================================== */

    .shepherd-achievement-seal {

      width:
        42px;

      height:
        42px;

      flex:
        0 0 auto;

      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      margin-bottom:
        9px;

      border:
        1px solid
        rgba(154, 116, 70, 0.38);

      border-radius:
        50%;

      background:

        radial-gradient(
          circle,
          rgba(116, 101, 140, 0.13),
          rgba(13, 14, 15, 0.92)
        );

      color:
        rgba(191, 180, 157, 0.72);

      font-family:
        "Cinzel",
        serif;

      font-size:
        13px;

      font-weight:
        800;

      letter-spacing:
        0.5px;
    }


    .shepherd-achievement.is-unlocked
    .shepherd-achievement-seal {

      border-color:
        rgba(154, 116, 70, 0.76);

      color:
        #e7ddc8;

      box-shadow:

        0 0 12px
        rgba(154, 116, 70, 0.12),

        inset
        0 0 10px
        rgba(154, 116, 70, 0.08);
    }


    .shepherd-achievement.is-legendary.is-unlocked
    .shepherd-achievement-seal {

      border-color:
        rgba(184, 140, 255, 0.78);

      color:
        #b88cff;

      background:

        radial-gradient(
          circle,
          rgba(184, 140, 255, 0.21),
          rgba(13, 14, 15, 0.94)
        );

      text-shadow:
        0 0 10px
        rgba(184, 140, 255, 0.65);

      box-shadow:
        0 0 16px
        rgba(184, 140, 255, 0.13);
    }


    /* ===============================================
       ACHIEVEMENT COPY
       =============================================== */

    .shepherd-achievement-name {

      color:
        var(
          --stray-cream-muted,
          #bfb49d
        );

      font-family:
        "Cinzel",
        serif;

      font-size:
        8px;

      font-weight:
        800;

      line-height:
        1.25;

      letter-spacing:
        0.8px;
    }


    .shepherd-achievement.is-unlocked
    .shepherd-achievement-name {

      color:
        var(
          --stray-cream,
          #e7ddc8
        );
    }


    .shepherd-achievement.is-legendary.is-unlocked
    .shepherd-achievement-name {

      color:
        #b88cff;

      text-shadow:
        0 0 9px
        rgba(184, 140, 255, 0.25);
    }


    .shepherd-achievement-description {

      margin-top:
        6px;

      color:
        rgba(191, 180, 157, 0.68);

      font-size:
        7px;

      font-weight:
        600;

      line-height:
        1.35;

      letter-spacing:
        0.35px;
    }


    .shepherd-achievement-status {

      margin-top:
        auto;

      padding-top:
        8px;

      color:
        rgba(154, 116, 70, 0.75);

      font-size:
        7px;

      font-weight:
        800;

      letter-spacing:
        1px;
    }


    .shepherd-achievement.is-unlocked
    .shepherd-achievement-status {

      color:
        #9a7446;
    }


    .shepherd-achievement.is-legendary.is-unlocked
    .shepherd-achievement-status {

      color:
        #b88cff;
    }


    /* ===============================================
       COMPLETE COLLECTION
       =============================================== */

    #collection-book.is-complete
    #shepherd-achievements {

      border-color:
        rgba(184, 140, 255, 0.34);

      box-shadow:
        0 0 22px
        rgba(184, 140, 255, 0.05);
    }


    /* ===============================================
       RESPONSIVE
       =============================================== */

    @media (
      max-width: 900px
    ) {

      #shepherd-achievements-grid {

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

      .cache-bottom-toggle {

        padding:
          12px;
      }


      .cache-bottom-toggle-right {

        gap:
          6px;
      }


      .cache-bottom-toggle-summary {

        font-size:
          8px;
      }


      .cache-bottom-collapse-body {

        padding:
          0 11px 11px;
      }


      #shepherd-achievements-grid {

        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );

        gap:
          7px;
      }


      .shepherd-achievement {

        min-height:
          128px;
      }
    }


    @media (
      max-width: 430px
    ) {

      .cache-bottom-toggle-subtitle {

        display:
          none;
      }


      .cache-bottom-toggle-title {

        font-size:
          9px;

        letter-spacing:
          1.5px;
      }


      .cache-bottom-toggle-summary {

        font-size:
          7px;
      }
    }

  `;


  document.head.appendChild(
    style
  );
}


/* =====================================================
   COLLECTION DATA
   ===================================================== */

function getAchievementUniqueCount() {

  if (
    typeof currentCollection !==
      "undefined"

    &&

    currentCollection

    &&

    typeof getSafeUniqueCount ===
      "function"
  ) {

    return getSafeUniqueCount(
      currentCollection
    );
  }


  const progress =
    document.getElementById(
      "book-progress-count"
    );


  if (
    !progress
  ) {

    return 0;
  }


  const match =
    String(
      progress.textContent || ""
    )
      .match(
        /(\d+)/
      );


  return match

    ? Number(
        match[1]
      ) || 0

    : 0;
}


/* =====================================================
   RARITY COUNT
   ===================================================== */

function getAchievementRarityCount(
  rarity
) {

  if (
    typeof currentCollection !==
      "undefined"

    &&

    currentCollection

    &&

    typeof getUniqueByRarity ===
      "function"
  ) {

    return getUniqueByRarity(
      currentCollection,
      rarity
    );
  }


  return 0;
}


/* =====================================================
   ACHIEVEMENT STATE
   ===================================================== */

function isAchievementUnlocked(
  achievement
) {

  if (
    !achievement
  ) {

    return false;
  }


  if (
    achievement.type ===
    "unique"
  ) {

    return (
      getAchievementUniqueCount()
      >=
      achievement.required
    );
  }


  if (
    achievement.type ===
    "rarity"
  ) {

    return (
      getAchievementRarityCount(
        achievement.rarity
      )
      >=
      achievement.required
    );
  }


  return false;
}


/* =====================================================
   ACHIEVEMENT PROGRESS
   ===================================================== */

function getAchievementProgress(
  achievement
) {

  if (
    achievement.type ===
    "unique"
  ) {

    const value =
      Math.min(
        getAchievementUniqueCount(),
        achievement.required
      );


    return (
      value
      +
      " / "
      +
      achievement.required
    );
  }


  if (
    achievement.type ===
    "rarity"
  ) {

    const value =
      Math.min(
        getAchievementRarityCount(
          achievement.rarity
        ),
        achievement.required
      );


    return (
      value
      +
      " / "
      +
      achievement.required
    );
  }


  return "";
}


/* =====================================================
   ACHIEVEMENT CARD
   ===================================================== */

function createAchievementCard(
  achievement
) {

  const unlocked =
    isAchievementUnlocked(
      achievement
    );


  const card =
    document.createElement(
      "article"
    );


  card.className =
    "shepherd-achievement "
    +
    (
      unlocked

        ? "is-unlocked"

        : "is-locked"
    );


  if (
    achievement.legendary
  ) {

    card.classList.add(
      "is-legendary"
    );
  }


  card.dataset.achievement =
    achievement.id;


  card.innerHTML = `

    <div class="shepherd-achievement-seal">
      ${achievement.symbol}
    </div>


    <div class="shepherd-achievement-name">
      ${achievement.title}
    </div>


    <div class="shepherd-achievement-description">
      ${achievement.description}
    </div>


    <div class="shepherd-achievement-status">

      ${
        unlocked

          ? "UNLOCKED"

          : getAchievementProgress(
              achievement
            )
      }

    </div>

  `;


  return card;
}


/* =====================================================
   CREATE ACHIEVEMENTS PANEL
   ===================================================== */

function createShepherdAchievementsPanel() {

  if (
    shepherdAchievementsPanel
  ) {

    return;
  }


  injectShepherdAchievementStyles();


  shepherdAchievementsPanel =
    document.createElement(
      "section"
    );


  shepherdAchievementsPanel.id =
    "shepherd-achievements";


  shepherdAchievementsPanel.innerHTML = `

    <button
      class="cache-bottom-toggle"
      id="shepherd-achievements-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="shepherd-achievements-body"
    >

      <span class="cache-bottom-toggle-left">

        <span class="cache-bottom-toggle-title">
          CACHE ACHIEVEMENTS
        </span>

        <span class="cache-bottom-toggle-subtitle">
          Milestones earned across the Shepherd's Cache
        </span>

      </span>


      <span class="cache-bottom-toggle-right">

        <span
          class="cache-bottom-toggle-summary"
          id="shepherd-achievements-summary"
        >
          <strong>0</strong> / 10
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

      <div id="shepherd-achievements-grid">
      </div>

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
    function() {

      toggleCollapseSection(
        toggle,
        body
      );
    }
  );


  placeBottomPanels();
}


/* =====================================================
   MAKE STATISTICS COLLAPSIBLE
   ===================================================== */

function prepareStatisticsCollapse() {

  const stats =
    document.getElementById(
      "collection-stats"
    );


  if (
    !stats
  ) {

    return;
  }


  if (
    stats.dataset.collapseReady ===
    "true"
  ) {

    return;
  }


  stats.dataset.collapseReady =
    "true";


  const oldTitle =
    stats.querySelector(
      "#collection-stats-title"
    );


  if (
    oldTitle
  ) {

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


  /*
     Move all current statistics content into
     the collapsible body except the hidden title.
  */

  const children =
    Array.from(
      stats.children
    );


  for (
    const child
    of children
  ) {

    if (
      child ===
      oldTitle
    ) {

      continue;
    }


    body.appendChild(
      child
    );
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
        VIEW STATS
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
    function() {

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


/* =====================================================
   UPDATE STATISTICS HEADER SUMMARY
   ===================================================== */

function updateStatisticsToggleSummary() {

  const summary =
    document.getElementById(
      "collection-stats-toggle-summary"
    );


  if (
    !summary
  ) {

    return;
  }


  const unique =
    getAchievementUniqueCount();


  summary.innerHTML =
    "<strong>"
    +
    unique
    +
    "</strong> / 22";
}


/* =====================================================
   COLLAPSE TOGGLE
   ===================================================== */

function toggleCollapseSection(
  toggle,
  body
) {

  if (
    !toggle
    ||
    !body
  ) {

    return;
  }


  const expanded =
    toggle.getAttribute(
      "aria-expanded"
    ) ===
    "true";


  const newExpanded =
    !expanded;


  toggle.setAttribute(
    "aria-expanded",
    newExpanded
      ? "true"
      : "false"
  );


  body.hidden =
    !newExpanded;
}


/* =====================================================
   MOVE BOTTOM PANELS
   ===================================================== */

function placeBottomPanels() {

  const sections =
    document.getElementById(
      "collection-sections"
    );


  if (
    !sections
    ||
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


  /*
     Desired order:

     collection-sections
     collection-stats
     shepherd-achievements
     footer
  */


  if (
    stats
  ) {

    parent.insertBefore(
      stats,
      sections.nextSibling
    );
  }


  if (
    shepherdAchievementsPanel
  ) {

    if (
      stats
      &&
      stats.parentNode ===
        parent
    ) {

      parent.insertBefore(
        shepherdAchievementsPanel,
        stats.nextSibling
      );
    }

    else {

      parent.insertBefore(
        shepherdAchievementsPanel,
        sections.nextSibling
      );
    }
  }
}


/* =====================================================
   RENDER ACHIEVEMENTS
   ===================================================== */

function renderShepherdAchievements() {

  const collectionBook =
    document.getElementById(
      "collection-book"
    );


  if (
    !collectionBook
    ||
    collectionBook.hidden
  ) {

    if (
      shepherdAchievementsPanel
    ) {

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


  let unlockedCount =
    0;


  for (
    const achievement
    of SHEPHERD_CACHE_ACHIEVEMENTS
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
    "<strong>"
    +
    unlockedCount
    +
    "</strong> / "
    +
    SHEPHERD_CACHE_ACHIEVEMENTS.length;


  updateStatisticsToggleSummary();
}


/* =====================================================
   QUEUED RENDER
   ===================================================== */

function queueShepherdAchievementRender() {

  window.clearTimeout(
    shepherdAchievementRenderTimer
  );


  shepherdAchievementRenderTimer =
    window.setTimeout(
      function() {

        renderShepherdAchievements();

      },
      80
    );
}


/* =====================================================
   WATCH COLLECTION VISIBILITY
   ===================================================== */

const shepherdAchievementBook =
  document.getElementById(
    "collection-book"
  );


if (
  shepherdAchievementBook
) {

  const bookAttributeObserver =
    new MutationObserver(
      function() {

        queueShepherdAchievementRender();
      }
    );


  bookAttributeObserver.observe(
    shepherdAchievementBook,
    {

      attributes:
        true,

      attributeFilter:
        [
          "hidden",
          "class"
        ]
    }
  );
}


/* =====================================================
   WATCH COLLECTIBLE RENDERING
   ===================================================== */

const shepherdAchievementSections =
  document.getElementById(
    "collection-sections"
  );


if (
  shepherdAchievementSections
) {

  const sectionObserver =
    new MutationObserver(
      function() {

        queueShepherdAchievementRender();
      }
    );


  sectionObserver.observe(
    shepherdAchievementSections,
    {

      childList:
        true,

      subtree:
        true
    }
  );
}


/* =====================================================
   SEARCH FORM
   ===================================================== */

const shepherdAchievementSearch =
  document.getElementById(
    "viewer-search-form"
  );


if (
  shepherdAchievementSearch
) {

  shepherdAchievementSearch.addEventListener(
    "submit",
    function() {

      if (
        shepherdAchievementsPanel
      ) {

        shepherdAchievementsPanel.style.display =
          "none";
      }
    }
  );
}


/* =====================================================
   START
   ===================================================== */

injectShepherdAchievementStyles();

createShepherdAchievementsPanel();

prepareStatisticsCollapse();

placeBottomPanels();

queueShepherdAchievementRender();