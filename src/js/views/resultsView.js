import View from "./view";

class ResultsView extends View {
    _parentEl = document.querySelector('.results');
    _errorMessage = "No recipes were found for your query, please try again!";
    _successMessage = "";

    _generateMarkup() {
        return `${this._data.map(el => {
            return `
            <li class="preview">
                <a class="preview__link" href="#${el.id}">
                    <figure class="preview__fig">
                    <img src="${el.image}" alt="${el.title}" />
                    </figure>
                    <div class="preview__data">
                        <h4 class="preview__title">${el.title}</h4>
                        <p class="preview__publisher">${el.publisher}</p>
                    </div>
                </a>
            </li>`;
        })}
        `;
    }
}

export default new ResultsView();


// id: "5ed6604591c37cdc054bcd09"
// image: "http://forkify-api.herokuapp.com/images/BBQChickenPizzawithCauliflowerCrust5004699695624ce.jpg"
// publisher: "Closet Cooking"
// sourceUrl: undefined
// title: "Cauliflower Pizza Crust (with BBQ Chicken Pizza)"