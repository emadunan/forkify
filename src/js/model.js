import { API_URL, RESULTS_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

// Application State
export const state = {
    recipe: {},
    search: {
        query: "",
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE
    },
    bookmarks: [],
}

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`); // 5ed6604591c37cdc054bcc13
        const { recipe } = data.data;

        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        }

        if (state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }

    } catch (error) {
        throw `${error} 💥💥💥`;
    }
}

export const loadSearchResults = async function (query) {
    try {
        
        const data = await getJSON(`${API_URL}/?search=${query}`);

        state.search.query = query;
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                sourceUrl: recipe.source_url,
                image: recipe.image_url,
            }
        });

        state.search.page = 1
    } catch (error) {
        throw `${error} 💥💥💥`;
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page -1) * state.search.resultsPerPage;   // 0
    const end = page * state.search.resultsPerPage;          // 10

    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        // Formula: newQT = oldQT * newServings / oldServings
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}


export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
}

export const removeBookmark = function (id) {
    // Delete bookmark
    const idx = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(idx, 1);

    // Mark current recipe as not bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;
}