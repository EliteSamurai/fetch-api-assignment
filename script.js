"use strict";

const API_KEY = "a690f76e51944e0b933a135a20c495c0";
const recipeResults = document.getElementById("recipe-results");
const favoritesResults = document.getElementById("favorites-results");
const homePage = document.getElementById("page-section");
const favoritesPage = document.getElementById("favorites-page");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const searchBar = document.getElementById("search-bar");

// Event Listeners for Navigation
document
  .getElementById("home-link")
  .addEventListener("click", () => showPage("home"));
document
  .getElementById("favorites-link")
  .addEventListener("click", () => showPage("favorites"));

// Event Listener for Search Button
document.getElementById("search-button").addEventListener("click", () => {
  const query = searchBar.value.trim();
  if (query) {
    searchRecipes(query);
  }
});

// Function to show the appropriate page
function showPage(page) {
  if (page === "home") {
    homePage.classList.remove("hidden");
    recipeResults.classList.add("hidden");
    favoritesPage.classList.add("hidden");
  } else if (page === "favorites") {
    homePage.classList.add("hidden");
    recipeResults.classList.add("hidden");
    favoritesPage.classList.remove("hidden");
    displayFavorites(); 
  } else {
    homePage.classList.add("hidden");
    favoritesPage.classList.add("hidden");
    recipeResults.classList.remove("hidden");
  }
}

// Function to search for recipes
async function searchRecipes(query) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`
    );
    const data = await response.json();
    displayResults(data.results);
    searchBar.value = "";
  } catch (error) {
    console.error("Error fetching the recipes:", error);
  }
}

// Function to display search results
function displayResults(recipes) {
  const newButton = document.createElement("button");
  newButton.type = "button";
  newButton.textContent = "Go back";
  newButton.addEventListener("click", () => showPage("home"));

  // Show the recipe results page
  showPage("results");

  // Clear previous results
  recipeResults.innerHTML = "";
  recipeResults.appendChild(newButton);

  // If no recipes found, show a message
  if (!recipes.length) {
    recipeResults.innerHTML +=
      "<p>No recipes found. Please try another search.</p>";
    return;
  }

  // Display each recipe as a card
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" />
      <button class="favorite-button" data-id="${recipe.id}" data-title="${recipe.title}" data-image="${recipe.image}">Add to Favorites</button>
    `;
    recipeResults.appendChild(recipeCard);
  });

  // Add event listeners to favorite buttons
  document.querySelectorAll(".favorite-button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const title = button.getAttribute("data-title");
      const image = button.getAttribute("data-image");
      addToFavorites({ id, title, image });
    });
  });
}

// Function to add a recipe to favorites
function addToFavorites(recipe) {
  if (!favorites.some((fav) => fav.id === recipe.id)) {
    favorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${recipe.title} has been added to your favorites!`);
  } else {
    alert(`${recipe.title} is already in your favorites!`);
  }
}

// Function to display favorite recipes
function displayFavorites() {
  favoritesResults.innerHTML = "";
  if (!favorites.length) {
    favoritesResults.innerHTML = "<p>No favorite recipes yet.</p>";
    return;
  }

  favorites.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" />
      <button class="remove-button" data-id="${recipe.id}">Remove from Favorites</button>
    `;
    favoritesResults.appendChild(recipeCard);
  });
}

favoritesResults.addEventListener("click", (event) => {
  // Check if the clicked element is a 'remove-button'
  if (event.target.classList.contains("remove-button")) {
    const recipeId = event.target.getAttribute("data-id");
    removeFromFavorites(recipeId);
  }
});

function removeFromFavorites(recipeId) {
  favorites = favorites.filter((fav) => fav.id !== recipeId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Recipe removed from favorites!");
  displayFavorites();
}

// Initial load: display favorites if any
displayFavorites();
