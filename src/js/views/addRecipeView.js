import View from "./view.js";

class AddRecipeView extends View {
    _parentEl = document.querySelector(".upload");
    _successMessage = "Recipe was successfully uploaded!";

    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = document.querySelector(".btn--close-modal");

    constructor() {
        super();
        this._addShowModalHandler();
        this._addHideModalHandler();
    }

    _toggleWindow() {
        this._overlay.classList.toggle("hidden");
        this._window.classList.toggle("hidden");
    }

    _addShowModalHandler() {
        this._btnOpen.addEventListener("click", this._toggleWindow.bind(this));
    }

    _addHideModalHandler() {
        this._btnClose.addEventListener("click", this._toggleWindow.bind(this));
        this._overlay.addEventListener("click", this._toggleWindow.bind(this));
    }

    addUploadHandler(handler) {
        this._parentEl.addEventListener("submit", function (e) {
            e.preventDefault();

            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        })
    }

    _generateMarkup() {

    }
}

export default new AddRecipeView();