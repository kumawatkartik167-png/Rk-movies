/* =========================================================
   RK MOVIES — PHASE 2
   Corrected Responsive JavaScript
   Search • Filter • Favorites • Video Player • Upload Preview
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     HELPERS
     ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const safeText = (value) =>
    String(value || "").toLowerCase().trim();


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  const menuBtn = $("#menuBtn");
  const nav = $(".topbar nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("open");

      const isOpen = nav.classList.contains("open");

      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menuBtn.textContent = isOpen ? "✕" : "☰";
    });

    $$("#topbar nav a, .topbar nav a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.textContent = "☰";
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* =========================================================
     SEARCH + MOVIE FILTER
     ========================================================= */

  const searchInput =
    $("#search") ||
    $("#movieSearch") ||
    $("#searchInput");

  const filterButtons = $$(".chip, .filter-btn");

  const movieCards = $$(".card, .movie-card, [data-movie]");

  let currentFilter = "all";

  function getCardTitle(card) {
    return safeText(
      card.dataset.title ||
      $(".card-title, .movie-title, h3, h2", card)?.textContent ||
      ""
    );
  }

  function getCardCategory(card) {
    return safeText(
      card.dataset.cat ||
      card.dataset.category ||
      ""
    );
  }

  function filterMovies() {

    const query = searchInput
      ? safeText(searchInput.value)
      : "";

    let visibleCount = 0;

    movieCards.forEach(card => {

      const title = getCardTitle(card);
      const category = getCardCategory(card);

      const matchesSearch =
        !query || title.includes(query);

      const matchesCategory =
        currentFilter === "all" ||
        category === currentFilter;

      const show =
        matchesSearch && matchesCategory;

      card.style.display = show ? "" : "none";

      if (show) {
        visibleCount++;
      }
    });

    const emptyMessage =
      $("#empty") ||
      $("#noResults");

    if (emptyMessage) {
      emptyMessage.style.display =
        visibleCount === 0 ? "block" : "none";
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterMovies);
  }

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      filterButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      currentFilter =
        safeText(
          button.dataset.filter ||
          button.dataset.category ||
          "all"
        );

      filterMovies();
    });

  });


  /* =========================================================
     VIDEO PLAYER
     ========================================================= */

  const videoPlayer =
    $("#videoPlayer") ||
    $("video");

  const playerMessage =
    $("#playerMessage") ||
    $(".player-message");

  function showPlayerMessage(message) {
    if (playerMessage) {
      playerMessage.textContent = message;
    }
  }

  function playMovie(card) {

    if (!videoPlayer) {
      return;
    }

    const videoURL =
      card.dataset.video ||
      card.dataset.src ||
      card.dataset.videoUrl ||
      $("source", card)?.getAttribute("src");

    const title =
      card.dataset.title ||
      $(".card-title, .movie-title, h3", card)?.textContent ||
      "Movie";

    if (!videoURL) {
      showPlayerMessage(
        `${title} का video अभी उपलब्ध नहीं है।`
      );

      const playerSection =
        $("#player") ||
        $(".player-section");

      if (playerSection) {
        playerSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      return;
    }

    videoPlayer.pause();

    videoPlayer.src = videoURL;
    videoPlayer.load();

    const playerSection =
      $("#player") ||
      $(".player-section");

    if (playerSection) {
      playerSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    showPlayerMessage(`Now playing: ${title}`);

    videoPlayer.play().catch(() => {
      // Browser may block automatic playback.
      // User can press Play manually.
    });
  }


  /* =========================================================
     WATCH BUTTONS
     ========================================================= */

  const watchButtons = $$(
    ".watch, .watch-btn, [data-action='watch']"
  );

  watchButtons.forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      const card =
        button.closest(
          ".card, .movie-card, [data-movie]"
        );

      if (card) {
        playMovie(card);
      }

    });

  });


  /* =========================================================
     FAVORITES
     ========================================================= */

  const FAVORITES_KEY = "rkMoviesFavorites";

  function getFavorites() {
    try {
      return JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]"
      );
    } catch {
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }

  function getMovieId(card) {

    return (
      card.dataset.id ||
      card.dataset.title ||
      $(".card-title, .movie-title, h3", card)?.textContent ||
      `movie-${movieCards.indexOf(card)}`
    ).trim();
  }

  function updateFavoriteButton(button, active) {

    button.classList.toggle("active", active);

    button.setAttribute(
      "aria-pressed",
      active ? "true" : "false"
    );

    if (button.dataset.label === "true") {
      button.textContent =
        active ? "♥ Saved" : "♡ Favorite";
    } else {
      button.textContent =
        active ? "♥" : "♡";
    }
  }

  function refreshFavoriteButtons() {

    const favorites = getFavorites();

    $$(".favorite, .fav-btn, [data-favorite]").forEach(button => {

      const card =
        button.closest(
          ".card, .movie-card, [data-movie]"
        );

      if (!card) return;

      const id = getMovieId(card);

      updateFavoriteButton(
        button,
        favorites.includes(id)
      );
    });
  }

  $$(".favorite, .fav-btn, [data-favorite]")
    .forEach(button => {

      button.addEventListener("click", event => {

        event.preventDefault();
        event.stopPropagation();

        const card =
          button.closest(
            ".card, .movie-card, [data-movie]"
          );

        if (!card) return;

        const id = getMovieId(card);

        let favorites = getFavorites();

        if (favorites.includes(id)) {

          favorites =
            favorites.filter(item => item !== id);

          updateFavoriteButton(button, false);

        } else {

          favorites.push(id);

          updateFavoriteButton(button, true);
        }

        saveFavorites(favorites);
      });

    });

  refreshFavoriteButtons();


  /* =========================================================
     MY LIBRARY BUTTON
     ========================================================= */

  const libraryLinks = $$(
    "a[href='#library'], a[href='#favorites'], #libraryBtn"
  );

  libraryLinks.forEach(link => {

    link.addEventListener("click", event => {

      const target =
        $("#library") ||
        $("#favorites");

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });

  });


  /* =========================================================
     UPLOAD UI — FRONTEND PREVIEW
     ========================================================= */

  const uploadInput =
    $("#videoUpload") ||
    $("#videoInput") ||
    $("#uploadVideo") ||
    $("input[type='file']");

  const uploadButton =
    $("#uploadBtn") ||
    $("#uploadButton");

  const uploadPreview =
    $("#uploadPreview") ||
    $("#videoPreview");

  const uploadName =
    $("#uploadName") ||
    $("#fileName");

  const uploadSize =
    $("#uploadSize") ||
    $("#fileSize");

  function formatFileSize(bytes) {

    if (!bytes) return "0 KB";

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB"
    ];

    const index =
      Math.floor(
        Math.log(bytes) / Math.log(1024)
      );

    return (
      (bytes / Math.pow(1024, index)).toFixed(2) +
      " " +
      units[index]
    );
  }

  function previewUpload(file) {

    if (!file) return;

    if (!file.type.startsWith("video/")) {

      alert("कृपया केवल video file चुनें।");

      if (uploadInput) {
        uploadInput.value = "";
      }

      return;
    }

    if (uploadName) {
      uploadName.textContent =
        file.name;
    }

    if (uploadSize) {
      uploadSize.textContent =
        formatFileSize(file.size);
    }

    if (uploadPreview) {

      const oldURL =
        uploadPreview.dataset.objectUrl;

      if (oldURL) {
        URL.revokeObjectURL(oldURL);
      }

      const url =
        URL.createObjectURL(file);

      uploadPreview.dataset.objectUrl = url;

      if (uploadPreview.tagName === "VIDEO") {

        uploadPreview.src = url;
        uploadPreview.load();

      } else {

        uploadPreview.innerHTML = "";

        const video =
          document.createElement("video");

        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.src = url;

        uploadPreview.appendChild(video);
      }

      uploadPreview.style.display = "block";
    }
  }

  if (uploadInput) {

    uploadInput.addEventListener(
      "change",
      () => {

        const file =
          uploadInput.files?.[0];

        previewUpload(file);
      }
    );
  }

  if (uploadButton && uploadInput) {

    uploadButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        uploadInput.click();
      }
    );
  }


  /* =========================================================
     UPLOAD BUTTONS WITHOUT INPUT
     ========================================================= */

  $$(".upload-trigger, [data-upload]").forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      if (uploadInput) {
        uploadInput.click();
      } else {
        alert(
          "Upload input अभी HTML में उपलब्ध नहीं है।"
        );
      }

    });

  });


  /* =========================================================
     LOGIN UI
     ========================================================= */

  const loginButtons = $$(
    "#loginBtn, .login-btn, [data-login]"
  );

  loginButtons.forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      const loginBox =
        $("#loginModal") ||
        $(".login-modal");

      if (loginBox) {

        loginBox.classList.add("show");

        loginBox.setAttribute(
          "aria-hidden",
          "false"
        );

      } else {

        alert(
          "Login system Phase 2 frontend में तैयार है।\n" +
          "Real user accounts के लिए backend/database चाहिए।"
        );

      }

    });

  });


  /* =========================================================
     CLOSE LOGIN MODAL
     ========================================================= */

  $$(".modal-close, [data-close-login]").forEach(button => {

    button.addEventListener("click", () => {

      const loginBox =
        $("#loginModal") ||
        $(".login-modal");

      if (loginBox) {

        loginBox.classList.remove("show");

        loginBox.setAttribute(
          "aria-hidden",
          "true"
        );
      }

    });

  });


  /* =========================================================
     EXPLORE MOVIES
     ========================================================= */

  $$(
    "a[href='#movies'], [data-scroll='movies']"
  ).forEach(button => {

    button.addEventListener("click", event => {

      const movies =
        $("#movies") ||
        $(".movies-section");

      if (movies) {

        event.preventDefault();

        movies.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  });


  /* =========================================================
     UPLOAD HERO BUTTON
     ========================================================= */

  $$(
    "a[href='#upload'], [data-scroll='upload']"
  ).forEach(button => {

    button.addEventListener("click", event => {

      const uploadSection =
        $("#upload") ||
        $(".upload-section");

      if (uploadSection) {

        event.preventDefault();

        uploadSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  });


  /* =========================================================
     KEYBOARD SUPPORT
     ========================================================= */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      if (nav) {
        nav.classList.remove("open");
      }

      if (menuBtn) {
        menuBtn.textContent = "☰";
        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );
      }

      const loginBox =
        $("#loginModal") ||
        $(".login-modal");

      if (loginBox) {
        loginBox.classList.remove("show");
      }
    }

  });


  /* =========================================================
     INITIAL FILTER
     ========================================================= */

  filterMovies();

  console.log(
    "RK Movies Phase 2 JavaScript loaded successfully."
  );

});
