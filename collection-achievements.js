/* =====================================================
   STRAY
   SHEPHERD'S CACHE

   COLLECTION ACHIEVEMENTS

   Adds permanent viewer achievements based entirely
   on existing Shepherd's Cache collection data.

   No Supabase changes.
   No Streamer.bot changes.
   ===================================================== */

"use strict";


/* =====================================================
   ACHIEVEMENT DEFINITIONS
   ===================================================== */

const SHEPHERD_CACHE_ACHIEVEMENTS = [

  {
    id: "first-relic",

    title:
      "FIRST RELIC",

    description:
      "Discover your first relic.",

    symbol:
      "I",

    type:
      "unique",

    required:
      1
  },


  {
    id: "trail-begins",

    title:
      "THE TRAIL BEGINS",

    description:
      "Discover 5 relics.",

    symbol:
      "V",

    type:
      "unique",

    required:
      5
  },


  {
    id: "flock-gathers",

    title:
      "THE FLOCK GATHERS",

    description:
      "Discover 10 relics.",

    symbol:
      "X",

    type:
      "unique",

    required:
      10
  },


  {
    id: "cache-remembers",

    title:
      "THE CACHE REMEMBERS",

    description:
      "Discover 15 relics.",

    symbol:
      "XV",

    type:
      "unique",

    required:
      15
  },


  {
    id: "final-stretch",

    title:
      "THE FINAL STRETCH",

    description:
      "Discover 20 relics.",

    symbol:
      "XX",

    type:
      "unique",

    required:
      20
  },


  {
    id: "flock-complete",

    title:
      "THE FLOCK IS COMPLETE",

    description:
      "Recover every relic in the Shepherd's Cache.",

    symbol:
      "IX",

    type:
      "unique",

    required:
      22,

    legendary:
      true
  },


  {
    id: "common-keeper",

    title:
      "COMMON KEEPER",

    description:
      "Complete the Common collection.",

    symbol:
      "C",

    type:
      "rarity",

    rarity:
      "common",

    required:
      5
  },


  {
    id: "uncommon-keeper",

    title:
      "UNCOMMON KEEPER",

    description:
      "Complete the Uncommon collection.",

    symbol:
      "U",

    type:
      "rarity",

    rarity:
      "uncommon",

    required:
      7
  },


  {
    id: "rare-keeper",

    title:
      "RARE KEEPER",

    description:
      "Complete the Rare collection.",

    symbol:
      "R",

    type:
      "rarity",

    rarity:
      "rare",

    required:
      5
  },


  {
    id: "legendary-keeper",

    title:
      "LEGENDARY KEEPER",

    description:
      "Complete the Legendary collection.",

    symbol:
      "L",

    type:
      "rarity",

    rarity:
      "legendary",

    required:
      5,

    legendary:
      true
  }

];


/* =====================================================
   STATE
   ===================================================== */

let shepherdAchievementsPanel =
  null;

let shepherdAchievementsGrid =
  null;

let shepherdAchievementsSummary =
  null;

let shepherdAchievementRenderTimer =
  null;


/* =====================================================
   STYLE
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
       ACHIEVEMENT PANEL
       =============================================== */

    #shepherd-achievements {

      position:
        relative;

      z-index:
        3;

      margin:
        8px 0 4px;

      padding:
        15px;

      border:
        1px solid
        rgba(154, 116, 70, 0.25);

      border-radius:
        12px;

      background:

        radial-gradient(
          circle at 50% 0%,
          rgba(116, 101, 140, 0.11),
          transparent 62%
        ),

        rgba(10, 11, 12, 0.44);
    }


    #shepherd-achievements-header {

      display:
        flex;

      align-items:
        center;

      justify-content:
        space-between;

      gap:
        12px;

      margin-bottom:
        13px;
    }


    #shepherd-achievements-title {

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


    #shepherd-achievements-summary {

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


    #shepherd-achievements-summary strong {

      color:
        #b88cff;

      font-family:
        "Cinzel",
        serif;

      font-size:
        11px;
    }


    /* ===============================================
       GRID
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
       SEAL
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
       TEXT
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
       COMPLETED COLLECTION
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

      #shepherd-achievements {

        padding:
          11px;
      }


      #shepherd-achievements-header {

        align-items:
          flex-start;

        flex-direction:
          column;

        gap:
          5px;
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

  `;


  document.head.appendChild(
    style
  );
}


/* =====================================================
   CREATE PANEL
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

    <div id="shepherd-achievements-header">

      <div id="shepherd-achievements-title">
        CACHE ACHIEVEMENTS
      </div>

      <div id="shepherd-achievements-summary">
        <strong>0</strong> / 10 UNLOCKED
      </div>

    </div>


    <div id="shepherd-achievements-grid">
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


  /*
     Prefer placing achievements immediately after
     the existing collection statistics section.
  */

  const stats =
    document.getElementById(
      "collection-stats"
    );


  const tools =
    document.getElementById(
      "collection-tools"
    );


  const sections =
    document.getElementById(
      "collection-sections"
    );


  if (
    stats
    &&
    stats.parentNode
  ) {

    stats.parentNode.insertBefore(
      shepherdAchievementsPanel,
      stats.nextSibling
    );
  }


  else if (
    tools
    &&
    tools.parentNode
  ) {

    tools.parentNode.insertBefore(
      shepherdAchievementsPanel,
      tools
    );
  }


  else if (
    sections
    &&
    sections.parentNode
  ) {

    sections.parentNode.insertBefore(
      shepherdAchievementsPanel,
      sections
    );
  }
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
   RARITY COUNTS
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
   PROGRESS TEXT
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
   CREATE CARD
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
   RENDER
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
    SHEPHERD_CACHE_ACHIEVEMENTS.length
    +
    " UNLOCKED";
}


/* =====================================================
   QUEUED RENDER

   Prevents repeated DOM mutations from causing
   unnecessary rapid redraws.
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
      50
    );
}


/* =====================================================
   WATCH COLLECTION PAGE
   ===================================================== */

const shepherdAchievementObserver =
  new MutationObserver(
    function() {

      queueShepherdAchievementRender();
    }
  );


const shepherdAchievementBook =
  document.getElementById(
    "collection-book"
  );


if (
  shepherdAchievementBook
) {

  shepherdAchievementObserver.observe(
    shepherdAchievementBook,
    {

      childList:
        true,

      subtree:
        true,

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
   SEARCH FORM

   Hide the old viewer's achievements immediately
   while another viewer is loading.
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

queueShepherdAchievementRender();