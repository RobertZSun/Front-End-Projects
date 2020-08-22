import {
    elements
} from './base';

export const getInput = () => elements.searchInput.value.trim();

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPageButtons.innerHTML = ''

};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

export const makeTileOneLine = (title, maxChars = 17) => {
    const shortenTitle = [];
    if (title.length > maxChars) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= maxChars) {
                shortenTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${shortenTitle.join(' ')} ...`;
    }
    return title;
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
        </svg>
    </button>`;

const renderButtons = (page, numResults, resPerPage) => {
    const actualPages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && actualPages > 1) {
        // only next page button shows
        button = createButton(page, 'next');
    } else if (page < actualPages) {
        // both page buttons show
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === actualPages && actualPages > 1) {
        // only previous page button shows
        button = createButton(page, 'prev');
    }

    elements.searchResPageButtons.insertAdjacentHTML('afterbegin', button);
};

const renderRecipe = recipe => {
    var htmlStr = ` 
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class = "results__data">
                    <h4 class="results__name">${makeTileOneLine(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;

    elements.searchResList.insertAdjacentHTML('beforeend', htmlStr);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // render the content
    recipes.slice(start, end).forEach(renderRecipe);

    // render the buttons
    renderButtons(page, recipes.length, resPerPage);

};