import icons from "url:../../img/icons.svg";

export default class View {
    _data;
    _clear() {
        this._parentEl.innerHTML = "";
    }

    render(data) {
        // Check retrieved data
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin", markup);
    }

    renderSpinner() {
        const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;

        this._clear()
        this._parentEl.insertAdjacentHTML("afterbegin", markup);
    }

    renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
        
            <div>
                <svg>
                    <use href="${icons}.svg#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}!</p>
        </div>
        `;

        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin", markup);
    }

    renderSuccess(message = this._successMessage) {
        const markup = `
        <div class="message">
            <div>
                <svg>
                <use href="${icons}.svg#icon-smile"></use>
                </svg>
            </div>
            <p>${message}!</p>
        </div>
        `;

        this._clear();
        this._parentEl.insertAdjacentHTML("afterbegin", markup);
    }
}