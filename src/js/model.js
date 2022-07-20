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
    }
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

        console.log(state.recipe);
    } catch (error) {
        throw `${error} 💥💥💥`;
    }
}

export const loadSearchResults = async function (query) {
    try {
        
        const data = await getJSON(`${API_URL}/?search=${query}`);
        console.log(data);

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
