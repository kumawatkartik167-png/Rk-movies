/* =========================================
   RK MOVIES - PHASE 2
   Main JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     MOBILE MENU
  ========================= */

  const menuBtn = document.getElementById("menuBtn");
  const nav = document.querySelector(".topbar nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("mobile-open");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("mobile-open");
      });
    });
  }


  /* =========================
     MOVIE SEARCH
  ========================= */

  const searchInput = document.getElementById("search");
  const cards = Array.from(document.querySelectorAll(".card"));
  const chips = Array.from(document.querySelectorAll(".chip"));
  const emptyMessage = document.getElementById("empty");

  let activeFilter = "all";

  function filterMovies() {

    const searchText = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    let visibleMovies = 0;

    cards.forEach(card => {

      const title =
        (card.dataset.title || card.textContent)
        .toLowerCase();

      const category =
        (card.dataset.cat || "all")
        .toLowerCase();

      const filterMatch =
        activeFilter === "all" ||
        category === activeFilter;

      const searchMatch =
        title.includes(searchText);

      if (filterMatch && searchMatch) {
        card.style.display = "";
        visibleMovies++;
      } else {
        card.style.display = "none";
      }

    });

    if (emptyMessage) {
      emptyMessage.style.display =
        visibleMovies === 0 ? "block" : "none";
    }
  }


  if (searchInput) {
    searchInput.addEventListener("input", filterMovies);
  }


  /* =========================
     MOVIE CATEGORY FILTER
  ========================= */

  chips.forEach(chip => {

    chip.addEventListener("click", () => {

      chips.forEach(item => {
        item.classList.remove("active");
      });

      chip.classList.add("active");

      activeFilter =
        (chip.dataset.filter || "all").toLowerCase();

      filterMovies();
    });

  });


  /* =========================
     WATCH BUTTONS
  ========================= */

  const watchButtons =
    document.querySelectorAll(".watch");

  const playerSection =
    document.getElementById("player");

  watchButtons.forEach(button => {

    button.addEventListener("click", () => {

      if (playerSection) {

        playerSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  /* =========================
     VIDEO PLAYER
  ========================= */

  const video =
    document.querySelector(".player video");

  if (video) {

    video.addEventListener("play", () => {
      console.log("RK Movies video started");
    });

    video.addEventListener("pause", () => {
      console.log("RK Movies video paused");
    });

    video.addEventListener("ended", () => {
      console.log("RK Movies video ended");
    });

  }


  /* =========================
     VIDEO DOUBLE TAP / DOUBLE CLICK
     Skip 10 seconds
  ========================= */

  if (video) {

    let lastTap = 0;

    video.addEventListener("click", event => {

      const currentTime =
        new Date().getTime();

      const tapLength =
        currentTime - lastTap;

      if (tapLength < 350 && tapLength > 0) {

        const rect =
          video.getBoundingClientRect();

        const clickX =
          event.clientX - rect.left;

        if (clickX < rect.width / 2) {

          video.currentTime =
            Math.max(0, video.currentTime - 10);

        } else {

          video.currentTime =
            Math.min(
              video.duration || Infinity,
              video.currentTime + 10
            );

        }

      }

      lastTap = currentTime;

    });

  }


  /* =========================
     UPLOAD UI
  ========================= */

  const uploadInput =
    document.getElementById("movieUpload");

  const uploadButton =
    document.getElementById("uploadBtn");

  const progressBar =
    document.querySelector(".progress span");

  const uploadStatus =
    document.getElementById("uploadStatus");

  if (uploadButton && uploadInput) {

    uploadButton.addEventListener("click", () => {

      if (!uploadInput.files.length) {

        if (uploadStatus) {
          uploadStatus.textContent =
            "Please select a video first.";
        }

        return;
      }

      const file =
        uploadInput.files[0];

      const allowedTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/quicktime"
      ];

      if (!allowedTypes.includes(file.type)) {

        if (uploadStatus) {
          uploadStatus.textContent =
            "Please select a supported video file.";
        }

        return;
      }

      if (uploadStatus) {
        uploadStatus.textContent =
          "Video selected: " + file.name;
      }

      /*
        Phase 2 frontend demo only.

        Real upload requires:
        - Backend
        - Cloud storage
        - Database
        - Authentication
        - Upload API
      */

      let progress = 0;

      if (progressBar) {
        progressBar.style.width = "0%";
      }

      const timer =
        setInterval(() => {

          progress += 10;

          if (progressBar) {
            progressBar.style.width =
              progress + "%";
          }

          if (progress >= 100) {

            clearInterval(timer);

            if (
