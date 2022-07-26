import icons from "url:../../img/icons.svg";

export default class View {
    _data;
    _clear() {
        this._parentEl.innerHTML = "";
    }

    update(data) {
        // Check retrieved data
        // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll("*"));
        const curElements = Array.from(this._parentEl.querySelectorAll("*"));

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            // Update changed TEXT
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
                curEl.textContent = newEl.textContent;
            }

            // Update changed ATTRIBUTES
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => {
                    curEl.setAttribute(attr.name, attr.value);
                });
            }
        });
    }

    // https://jsdoc.app/
    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [render=true] If false create markup string instead of rendering to the DOM
     * @returns {undefined | string}
     * @this {Object} View instance
     * @author emadunan
     * @todo Refactor and test
     */
    render(data, render = true) {
        // Check retrieved data
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

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