import { API_KEY, API_URL, RESULTS_PER_PAGE } from "./config.js";
import { AJAX } from "./helpers.js";

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

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        // Nice trick to add a property conditionaly using short circuit
        ...(recipe.key && {key: recipe.key})
    }
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);

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

        const data = await AJAX(`${API_URL}/?search=${query}&key=${API_KEY}`);

        state.search.query = query;
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                sourceUrl: recipe.source_url,
                image: recipe.image_url,
                ...(recipe.key && {key: recipe.key})
            }
        });

        state.search.page = 1
    } catch (error) {
        throw `${error} 💥💥💥`;
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;   // 0
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

const persistBookmarks = function () {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
}

export const removeBookmark = function (id) {
    // Delete bookmark
    const idx = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(idx, 1);

    // Mark current recipe as not bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
}

const init = function () {
    const storage = localStorage.getItem("bookmarks");
    if (storage) state.bookmarks = JSON.parse(storage);
}
init();

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object
            .entries(newRecipe)
            .filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
            .map(ing => {
                // const ingArr = ing[1].replaceAll(" ", "").split(",");
                const ingArr = ing[1].split(",").map(el => el.trim());
                if (ingArr.length !== 3) {
                    throw new Error("Wrong ingredient format!");
                }

                [quantity, unit, description] = ingArr;

                return { quantity: quantity ? +quantity : null, unit, description }
            });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: newRecipe.cookingTime,
            servings: newRecipe.servings,
            ingredients,
        }

        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
        console.log(data);
    } catch (error) {
        throw error;
    }
}