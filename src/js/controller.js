import * as model from "./model";

// ES6 Polyfills
import "regenerator-runtime/runtime"    // For polyfilling asyn/await
import "core-js/stable";                // For polyfilling everything else

import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";

// Parcel Configuration -- To avoid unrequired render during development
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    // Get recipe id
    const recipeId = window.location.hash.slice(1);
    if (!recipeId) return;

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Loading a recipe
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(recipeId);

    // Rendering a recipe
    recipeView.render(model.state.recipe)

  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Loading spinner
    resultsView.renderSpinner();

    // Get user params and check its validation
    const query = searchView.getQuery();
    if (!query) return;

    // Load results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage(1));

    // Render Pagination
    paginationView.render(model.state.search);

  } catch (error) {
    throw error;
  }
}

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new Pagination
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // Update the UI
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function init() {
  recipeView.addRenderRecipeHandlers(controlRecipe);
  recipeView.addUpdateServingsHandler(controlServings);
  recipeView.addAddBookmarkHandler(controlAddBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addClickHandler(controlPagination);
}
init();
