import {
    elements
} from './base';

export const renderItem = item => {
    const ingredientTemplate = `
    <li class="shopping__item" data-itemid="${item.id}">
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;
    elements.shoppingList.insertAdjacentHTML('beforeend', ingredientTemplate);
}

export const deleteItem = id => {
    const itemToBeDeleted = document.querySelector(`[data-itemID="${id}"]`);
    if (itemToBeDeleted) {
        itemToBeDeleted.parentElement.removeChild(itemToBeDeleted);
    }
}