import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {
    elements,
    renderLoader,
    clearLoader,
    recipe
} from './views/base';

/** global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list Object
 * - Liked recipes Object
 */
const state = {};

/** 
 * Controler for search
 */
const controlSearch = async () => {
    // 1. get query from the view
    const query = searchView.getInput();

    if (query.trim().length > 0) {
        // 2. create a new search object and add to the state
        state.search = new Search(query);

        // 3. clear the input field &
        //    clear the previous results &
        //    render the loader while loading
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. search for recipes
            await state.search.getRes();

            // 5. remove the loader and render the results to the UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(error);
            alert(error.message);
            clearLoader();
        }

    }
};


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPageButtons.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        searchView.clearResults();
        renderLoader(elements.searchRes);
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.renderResults(state.search.result, gotoPage);
        clearLoader();
    }
});


/**
 * Controler for recipe
 */
const showRecipe = async () => {
    const recipeID = window.location.hash.replace('#', '');
    if (recipeID) {
        // prepare for the UI of recipe
        renderLoader(elements.recipe);

        // highlight the selected recipe
        if (state.search) {
            searchView.highlightSelected(recipeID);
        }

        // create a new recipe object
        state.recipe = new Recipe(recipeID);

        try {

            // get the recipe data and parse it before next step
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate the serving and cooking time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render all the data to the UI
            clearLoader();
            recipeView.clearRecipe();
            recipeView.renderRecipe(state.recipe, state.likes.isliked(recipeID));
            // console.log(state.recipe);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }



    }
};

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
['hashchange', 'load'].forEach(e => {
    window.addEventListener(e, showRecipe);
});


/** 
 * List controller
 */
const listController = () => {
    if (!state.list) {
        state.list = new List();
    }
    state.recipe.ingredients.forEach(item => {
        const addedItem = state.list.addItem(item.count, item.unit, item.ingredient);
        listView.renderItem(addedItem);
    });
}

// update the data in the shoppingList or delete it
elements.shoppingList.addEventListener('click', e => {
    const itemId = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(itemId);

        // delete from UI
        listView.deleteItem(itemId);
    } else if (e.target.matches('.shopping__count-value')) {
        const currentVal = parseFloat(e.target.value, 10);
        state.list.updateCount(itemId, currentVal);
    }
});

/** 
 * Like controller
 */
const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;

    // current recipe is not liked
    if (!state.likes.isliked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        );
        // toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to the UI list
        likesView.renderLike(newLike);
        // console.log(state.likes);

        // current recipe is liked
    } else {
        // remove like to the state
        state.likes.deleteLike(currentID);
        // toggle the like button
        likesView.toggleLikeBtn(false);

        // remove like to the UI list
        likesView.deleteLike(currentID);
        // console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumOfLikedDish());
}

// when click on serving add or decrease button
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServing('des');
            recipeView.updateRecipeUI(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        if (state.recipe.servings < 15) {
            state.recipe.updateServing('add');
            recipeView.updateRecipeUI(state.recipe);
        }
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        listController();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});

window.addEventListener('load', () => {
    state.likes = new Likes();

    // retrive the liked dish data
    state.likes.getLocalStorage();

    // get the heart icon back if there is any liked dish
    likesView.toggleLikeMenu(state.likes.getNumOfLikedDish());

    if (state.likes.getNumOfLikedDish() > 0) {
        state.likes.likes.forEach(el => {
            likesView.renderLike(el);
        });
    }

});