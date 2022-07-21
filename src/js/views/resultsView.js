import View from "./view";
import previewView from "./previewView";

class ResultsView extends View {
    _parentEl = document.querySelector('.results');
    _errorMessage = "No recipes were found for your query, please try again!";
    _successMessage = "";

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join("");
    }
}

export default new ResultsView();


// id: "5ed6604591c37cdc054bcd09"
// image: "http://forkify-api.herokuapp.com/images/BBQChickenPizzawithCauliflowerCrust5004699695624ce.jpg"
// publisher: "Closet Cooking"
// sourceUrl: undefined
// title: "Cauliflower Pizza Crust (with BBQ Chicken Pizza)"