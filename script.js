const search = document.getElementById("search");

const cards = [
  ...document.querySelectorAll(".movie-card")
];

const chips = [
  ...document.querySelectorAll(".chip")
];

const noResults =
  document.getElementById("noResults");

const menuBtn =
  document.getElementById("menuBtn");

const nav =
  document.getElementById("nav");

let selectedCategory = "all";


/* SEARCH + FILTER */

function filterMovies() {

  const query =
    search.value
      .toLowerCase()
      .trim();

  let visible = 0;

  cards.forEach(card => {

    const title =
      card.dataset.title.toLowerCase();

    const category =
      card.dataset.category;

    const categoryMatch =
      selectedCategory === "all" ||
      category === selectedCategory;

    const searchMatch =
      title.includes(query);

    if (categoryMatch && searchMatch) {

      card.style.display = "";

      visible++;

    } else {

      card.style.display = "none";

    }

  });


  if (visible === 0) {

    noResults.style.display = "block";

  } else {

    noResults.style.display = "none";

  }

}


/* SEARCH */

search.addEventListener(
  "input",
  filterMovies
);


/* CATEGORY BUTTONS */

chips.forEach(chip => {

  chip.addEventListener(
    "click",
    () => {

      chips.forEach(c =>
        c.classList.remove("active")
      );

      chip.classList.add("active");

      selectedCategory =
        chip.dataset.filter;

      filterMovies();

    }
  );

});


/* WATCH BUTTON */

document
  .querySelectorAll(".watch-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .getElementById("player")
          .scrollIntoView({
            behavior: "smooth"
          });

      }
    );

  });


/* MOBILE MENU */

menuBtn.addEventListener(
  "click",
  () => {

    nav.classList.toggle("show");

  }
);


/* CLOSE MOBILE MENU */

document
  .querySelectorAll("nav a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        nav.classList.remove("show");

      }
    );

  });


/* PHASE 2 BUTTON */

document
  .getElementById("phaseBtn")
  .addEventListener(
    "click",
    () => {

      alert(
        "Phase 2 में Mobile Upload, Login, Database, Cloud Storage और Admin System आएगा."
      );

    }
  );
