import * as model from "./model";

// ES6 Polyfills
import "regenerator-runtime/runtime"    // For polyfilling asyn/await
import "core-js/stable";                // For polyfilling everything else

import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";

// Parcel Configuration -- To avoid unrequired render during development
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {

    // Loading a recipe
    recipeView.renderSpinner();

    // Get recipe id
    const recipeId = window.location.hash.slice(1);
    console.log(recipeId);

    if (!recipeId) return;

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

function init() {
  recipeView.addRenderRecipeHandlers(controlRecipe);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addClickHandler(controlPagination);
}
init();
