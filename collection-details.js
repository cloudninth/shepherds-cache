/* =====================================================
   STRAY
   SHEPHERD'S CACHE

   COLLECTIBLE DETAIL VIEWER

   Adds:
   - Click discovered collectible to inspect
   - Large artwork preview
   - Rarity treatment
   - Owned quantity
   - Keyboard support
   - Escape / backdrop close

   No Supabase changes required.
   ===================================================== */

"use strict";


/* =====================================================
   STATE
   ===================================================== */

let cacheDetailModal =
  null;

let cacheDetailPanel =
  null;

let cacheDetailImage =
  null;

let cacheDetailRarity =
  null;

let cacheDetailName =
  null;

let cacheDetailOwned =
  null;

let cacheDetailClose =
  null;

let previousBodyOverflow =
  "";


/* =====================================================
   RARITY NAMES
   ===================================================== */

const CACHE_DETAIL_RARITY_NAMES = {

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
   STYLES
   ===================================================== */

function injectCacheDetailStyles() {

  if (
    document.getElementById(
      "shepherd-cache-detail-styles"
    )
  ) {

    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "shepherd-cache-detail-styles";


  style.textContent = `

    /* ===============================================
       DISCOVERED CARDS
       =============================================== */

    .collection-item.owned {

      cursor:
        pointer;

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


    .collection-item.owned:hover {

      transform:
        translateY(-3px)
        scale(1.015);

      border-color:
        rgba(184, 140, 255, 0.48);

      box-shadow:

        0 8px 22px
        rgba(0, 0, 0, 0.35),

        0 0 18px
        rgba(184, 140, 255, 0.08);
    }


    .collection-item.owned:focus-visible {

      outline:
        2px solid
        rgba(184, 140, 255, 0.85);

      outline-offset:
        3px;
    }


    .collection-item.missing {

      cursor:
        default;
    }


    /* ===============================================
       MODAL SHELL
       =============================================== */

    #cache-detail-modal {

      position:
        fixed;

      inset:
        0;

      z-index:
        10000;

      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      padding:
        24px;

      opacity:
        0;

      visibility:
        hidden;

      pointer-events:
        none;

      transition:

        opacity
        0.22s
        ease,

        visibility
        0.22s
        ease;
    }


    #cache-detail-modal.is-open {

      opacity:
        1;

      visibility:
        visible;

      pointer-events:
        auto;
    }


    #cache-detail-backdrop {

      position:
        absolute;

      inset:
        0;

      background:
        rgba(4, 5, 6, 0.88);

      backdrop-filter:
        blur(8px);

      -webkit-backdrop-filter:
        blur(8px);
    }


    /* ===============================================
       DETAIL PANEL
       =============================================== */

    #cache-detail-panel {

      --detail-rarity:
        #bfb49d;

      position:
        relative;

      z-index:
        1;

      width:
        min(
          520px,
          94vw
        );

      max-height:
        92vh;

      overflow:
        auto;

      padding:
        28px 28px 25px;

      border:
        1px solid
        rgba(154, 116, 70, 0.6);

      border-radius:
        16px;

      background:

        radial-gradient(
          circle at 50% 25%,
          rgba(116, 101, 140, 0.13),
          transparent 48%
        ),

        linear-gradient(
          145deg,
          rgba(36, 36, 38, 0.99),
          rgba(13, 14, 15, 0.995)
        );

      box-shadow:

        0 30px 90px
        rgba(0, 0, 0, 0.82),

        0 0 34px
        color-mix(
          in srgb,
          var(--detail-rarity) 15%,
          transparent
        ),

        inset
        0 0 45px
        rgba(0, 0, 0, 0.32);

      text-align:
        center;

      transform:
        translateY(18px)
        scale(0.96);

      transition:
        transform
        0.28s
        cubic-bezier(
          0.18,
          0.89,
          0.32,
          1.18
        );
    }


    #cache-detail-modal.is-open
    #cache-detail-panel {

      transform:
        translateY(0)
        scale(1);
    }


    #cache-detail-panel::before {

      content:
        "";

      position:
        absolute;

      inset:
        8px;

      border:
        1px dashed
        rgba(231, 221, 200, 0.10);

      border-radius:
        10px;

      pointer-events:
        none;
    }


    /* ===============================================
       RARITY COLORS
       =============================================== */

    #cache-detail-panel.rarity-common {

      --detail-rarity:
        #bfb49d;
    }


    #cache-detail-panel.rarity-uncommon {

      --detail-rarity:
        #8d7ca8;
    }


    #cache-detail-panel.rarity-rare {

      --detail-rarity:
        #b8986d;
    }


    #cache-detail-panel.rarity-legendary {

      --detail-rarity:
        #b88cff;
    }


    /* ===============================================
       CLOSE BUTTON
       =============================================== */

    #cache-detail-close {

      position:
        absolute;

      top:
        14px;

      right:
        14px;

      z-index:
        5;

      width:
        38px;

      height:
        38px;

      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      padding:
        0;

      border:
        1px solid
        rgba(154, 116, 70, 0.42);

      border-radius:
        50%;

      background:
        rgba(13, 14, 15, 0.82);

      color:
        #e7ddc8;

      font-size:
        24px;

      line-height:
        1;

      cursor:
        pointer;

      transition:

        background
        0.18s
        ease,

        border-color
        0.18s
        ease,

        transform
        0.18s
        ease;
    }


    #cache-detail-close:hover {

      transform:
        scale(1.06);

      border-color:
        rgba(184, 140, 255, 0.65);

      background:
        rgba(57, 49, 69, 0.88);
    }


    /* ===============================================
       HEADER
       =============================================== */

    #cache-detail-kicker {

      position:
        relative;

      z-index:
        2;

      margin-top:
        3px;

      color:
        #9a7446;

      font-size:
        9px;

      font-weight:
        800;

      letter-spacing:
        3px;
    }


    #cache-detail-rarity {

      position:
        relative;

      z-index:
        2;

      margin-top:
        7px;

      color:
        var(--detail-rarity);

      font-family:
        "Cinzel",
        serif;

      font-size:
        13px;

      font-weight:
        800;

      letter-spacing:
        3px;

      text-shadow:
        0 0 12px
        color-mix(
          in srgb,
          var(--detail-rarity) 35%,
          transparent
        );
    }


    /* ===============================================
       ARTWORK
       =============================================== */

    #cache-detail-art-stage {

      position:
        relative;

      width:
        100%;

      min-height:
        320px;

      display:
        flex;

      align-items:
        center;

      justify-content:
        center;

      margin-top:
        8px;

      overflow:
        hidden;
    }


    #cache-detail-art-stage::before {

      content:
        "";

      position:
        absolute;

      width:
        280px;

      height:
        280px;

      border-radius:
        50%;

      background:

        radial-gradient(
          circle,
          color-mix(
            in srgb,
            var(--detail-rarity) 18%,
            transparent
          ),
          transparent 68%
        );

      filter:
        blur(3px);

      pointer-events:
        none;
    }


    #cache-detail-image {

      position:
        relative;

      z-index:
        2;

      display:
        block;

      width:
        min(
          320px,
          82vw
        );

      height:
        320px;

      object-fit:
        contain;

      object-position:
        center;

      filter:

        drop-shadow(
          0 18px 18px
          rgba(0, 0, 0, 0.62)
        )

        drop-shadow(
          0 0 10px
          color-mix(
            in srgb,
            var(--detail-rarity) 18%,
            transparent
          )
        );
    }


    #cache-detail-panel.rarity-legendary
    #cache-detail-image {

      filter:

        drop-shadow(
          0 18px 18px
          rgba(0, 0, 0, 0.65)
        )

        drop-shadow(
          0 0 17px
          rgba(184, 140, 255, 0.26)
        );
    }


    /* ===============================================
       COPY
       =============================================== */

    #cache-detail-name {

      position:
        relative;

      z-index:
        2;

      margin-top:
        3px;

      color:
        #e7ddc8;

      font-family:
        "Cinzel",
        serif;

      font-size:
        24px;

      font-weight:
        800;

      line-height:
        1.16;

      letter-spacing:
        0.6px;

      text-shadow:

        0 3px 5px
        rgba(0, 0, 0, 0.72);
    }


    #cache-detail-owned {

      position:
        relative;

      z-index:
        2;

      display:
        inline-flex;

      align-items:
        center;

      justify-content:
        center;

      min-width:
        88px;

      margin-top:
        13px;

      padding:
        7px 12px;

      border:
        1px solid
        color-mix(
          in srgb,
          var(--detail-rarity) 55%,
          transparent
        );

      border-radius:
        999px;

      background:
        rgba(13, 14, 15, 0.72);

      color:
        var(--detail-rarity);

      font-size:
        10px;

      font-weight:
        800;

      letter-spacing:
        1.6px;
    }


    #cache-detail-footer {

      position:
        relative;

      z-index:
        2;

      margin-top:
        15px;

      padding-top:
        13px;

      border-top:
        1px solid
        rgba(154, 116, 70, 0.20);

      color:
        rgba(191, 180, 157, 0.72);

      font-size:
        8px;

      font-weight:
        700;

      letter-spacing:
        2px;
    }


    /* ===============================================
       MOBILE
       =============================================== */

    @media (
      max-width: 600px
    ) {

      #cache-detail-modal {

        padding:
          13px;
      }


      #cache-detail-panel {

        width:
          100%;

        padding:
          24px 18px 21px;
      }


      #cache-detail-art-stage {

        min-height:
          270px;
      }


      #cache-detail-image {

        width:
          min(
            280px,
            78vw
          );

        height:
          270px;
      }


      #cache-detail-name {

        font-size:
          20px;
      }
    }

  `;


  document.head.appendChild(
    style
  );
}


/* =====================================================
   CREATE MODAL
   ===================================================== */

function createCacheDetailModal() {

  if (
    cacheDetailModal
  ) {

    return;
  }


  injectCacheDetailStyles();


  cacheDetailModal =
    document.createElement(
      "div"
    );


  cacheDetailModal.id =
    "cache-detail-modal";


  cacheDetailModal.setAttribute(
    "aria-hidden",
    "true"
  );


  cacheDetailModal.innerHTML = `

    <div
      id="cache-detail-backdrop"
    >
    </div>


    <section
      id="cache-detail-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cache-detail-name"
    >

      <button
        id="cache-detail-close"
        type="button"
        aria-label="Close collectible"
      >
        ×
      </button>


      <div id="cache-detail-kicker">
        SHEPHERD'S CACHE RELIC
      </div>


      <div id="cache-detail-rarity">
        COMMON
      </div>


      <div id="cache-detail-art-stage">

        <img
          id="cache-detail-image"
          src=""
          alt=""
        >

      </div>


      <div id="cache-detail-name">
        Collectible
      </div>


      <div id="cache-detail-owned">
        OWNED ×1
      </div>


      <div id="cache-detail-footer">
        THE PATCHWORK PASTURE · THE FLOCK'S RECORD
      </div>

    </section>

  `;


  document.body.appendChild(
    cacheDetailModal
  );


  cacheDetailPanel =
    document.getElementById(
      "cache-detail-panel"
    );


  cacheDetailImage =
    document.getElementById(
      "cache-detail-image"
    );


  cacheDetailRarity =
    document.getElementById(
      "cache-detail-rarity"
    );


  cacheDetailName =
    document.getElementById(
      "cache-detail-name"
    );


  cacheDetailOwned =
    document.getElementById(
      "cache-detail-owned"
    );


  cacheDetailClose =
    document.getElementById(
      "cache-detail-close"
    );


  const backdrop =
    document.getElementById(
      "cache-detail-backdrop"
    );


  cacheDetailClose.addEventListener(
    "click",
    closeCacheDetail
  );


  backdrop.addEventListener(
    "click",
    closeCacheDetail
  );
}


/* =====================================================
   READ CARD DATA
   ===================================================== */

function getCacheCardDetails(
  card
) {

  if (
    !card
    ||
    !card.classList.contains(
      "owned"
    )
  ) {

    return null;
  }


  const nameElement =
    card.querySelector(
      ".collection-item-name"
    );


  const image =
    card.querySelector(
      ".collection-item-image-wrap img"
    );


  const ownedElement =
    card.querySelector(
      ".collection-item-owned-count"
    );


  const name =
    nameElement

      ? String(
          nameElement.textContent || ""
        ).trim()

      : "";


  const imageSource =
    image

      ? image.currentSrc
        ||
        image.src
        ||
        ""

      : "";


  const rarity =
    String(
      card.dataset.rarity || ""
    )
      .trim()
      .toLowerCase();


  let ownedCount =
    1;


  if (
    ownedElement
  ) {

    const match =
      String(
        ownedElement.textContent || ""
      )
        .match(
          /(\d+)/
        );


    if (
      match
      &&
      match[1]
    ) {

      ownedCount =
        Math.max(
          1,
          Number(
            match[1]
          ) || 1
        );
    }
  }


  if (
    !name
    ||
    !imageSource
  ) {

    return null;
  }


  return {

    name:
      name,

    image:
      imageSource,

    rarity:
      rarity,

    ownedCount:
      ownedCount
  };
}


/* =====================================================
   OPEN DETAIL
   ===================================================== */

function openCacheDetail(
  card
) {

  createCacheDetailModal();


  const details =
    getCacheCardDetails(
      card
    );


  if (
    !details
  ) {

    return;
  }


  cacheDetailPanel.classList.remove(
    "rarity-common",
    "rarity-uncommon",
    "rarity-rare",
    "rarity-legendary"
  );


  const rarityClass =
    CACHE_DETAIL_RARITY_NAMES[
      details.rarity
    ]

      ? details.rarity

      : "common";


  cacheDetailPanel.classList.add(
    "rarity-"
    +
    rarityClass
  );


  cacheDetailRarity.textContent =
    CACHE_DETAIL_RARITY_NAMES[
      rarityClass
    ]
    ||
    rarityClass.toUpperCase();


  cacheDetailName.textContent =
    details.name;


  cacheDetailImage.src =
    details.image;


  cacheDetailImage.alt =
    details.name;


  cacheDetailOwned.textContent =
    "OWNED ×"
    +
    details.ownedCount;


  cacheDetailModal.classList.add(
    "is-open"
  );


  cacheDetailModal.setAttribute(
    "aria-hidden",
    "false"
  );


  previousBodyOverflow =
    document.body.style.overflow;


  document.body.style.overflow =
    "hidden";


  window.setTimeout(
    function() {

      if (
        cacheDetailClose
      ) {

        cacheDetailClose.focus();
      }

    },
    50
  );
}


/* =====================================================
   CLOSE DETAIL
   ===================================================== */

function closeCacheDetail() {

  if (
    !cacheDetailModal
    ||
    !cacheDetailModal.classList.contains(
      "is-open"
    )
  ) {

    return;
  }


  cacheDetailModal.classList.remove(
    "is-open"
  );


  cacheDetailModal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    previousBodyOverflow;


  window.setTimeout(
    function() {

      if (
        cacheDetailImage
      ) {

        cacheDetailImage.src =
          "";


        cacheDetailImage.alt =
          "";
      }

    },
    250
  );
}


/* =====================================================
   DECORATE DYNAMIC CARDS
   ===================================================== */

function decorateCacheCards() {

  const ownedCards =
    document.querySelectorAll(
      ".collection-item.owned"
    );


  for (
    const card
    of ownedCards
  ) {

    if (
      card.dataset.detailReady ===
      "true"
    ) {

      continue;
    }


    card.dataset.detailReady =
      "true";


    card.setAttribute(
      "role",
      "button"
    );


    card.setAttribute(
      "tabindex",
      "0"
    );


    const nameElement =
      card.querySelector(
        ".collection-item-name"
      );


    const name =
      nameElement

        ? String(
            nameElement.textContent || ""
          ).trim()

        : "collectible";


    card.setAttribute(
      "aria-label",
      "Inspect "
      +
      name
    );


    card.setAttribute(
      "title",
      "Inspect "
      +
      name
    );
  }
}


/* =====================================================
   CLICK HANDLING
   ===================================================== */

document.addEventListener(
  "click",
  function(
    event
  ) {

    const card =
      event.target.closest(
        ".collection-item.owned"
      );


    if (
      !card
    ) {

      return;
    }


    openCacheDetail(
      card
    );
  }
);


/* =====================================================
   KEYBOARD HANDLING
   ===================================================== */

document.addEventListener(
  "keydown",
  function(
    event
  ) {

    if (
      event.key ===
      "Escape"
    ) {

      closeCacheDetail();

      return;
    }


    if (
      event.key !==
        "Enter"

      &&

      event.key !==
        " "
    ) {

      return;
    }


    const card =
      event.target.closest(
        ".collection-item.owned"
      );


    if (
      !card
    ) {

      return;
    }


    event.preventDefault();


    openCacheDetail(
      card
    );
  }
);


/* =====================================================
   WATCH FOR COLLECTION RE-RENDERS
   ===================================================== */

const cacheDetailObserver =
  new MutationObserver(
    function() {

      decorateCacheCards();
    }
  );


const collectionSections =
  document.getElementById(
    "collection-sections"
  );


if (
  collectionSections
) {

  cacheDetailObserver.observe(
    collectionSections,
    {

      childList:
        true,

      subtree:
        true
    }
  );
}


/* =====================================================
   CLOSE IF A DIFFERENT VIEWER IS SEARCHED
   ===================================================== */

const viewerSearchForm =
  document.getElementById(
    "viewer-search-form"
  );


if (
  viewerSearchForm
) {

  viewerSearchForm.addEventListener(
    "submit",
    function() {

      closeCacheDetail();
    }
  );
}


/* =====================================================
   START
   ===================================================== */

createCacheDetailModal();

decorateCacheCards();