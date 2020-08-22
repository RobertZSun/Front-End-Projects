import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    calcTime() {
        // let say each three ingredients will take up 15 mins to cook
        const numIngredients = this.ingredients.length;
        this.time = 15 * Math.ceil(numIngredients / 3);
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const standardizedIngredients = this.ingredients.map(ingredient => {
            // make all units be the same unit
            let standardizedIngredient = ingredient.toLowerCase();
            unitsLong.forEach((unit, i) => {
                standardizedIngredient = standardizedIngredient.replace(unit, unitsShort[i]);
            });
            // remove '()' items
            standardizedIngredient = standardizedIngredient.replace(/ *\([^)]*\) */g, ' ');

            // parse ingredients into count, unit and ingredient
            const arrIng = standardizedIngredient.split(' ');
            const unitIndex = arrIng.findIndex(el => units.includes(el));


            let finalIngredient;
            if (unitIndex > -1) {
                const arrCounter = arrIng.slice(0, unitIndex);
                let count;
                if (arrCounter.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                finalIngredient = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            } else if (parseInt(arrIng[0], 10)) {
                finalIngredient = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                finalIngredient = {
                    count: 1,
                    unit: '',
                    ingredient: ''
                };
            }
            return finalIngredient;
        });
        this.ingredients = standardizedIngredients;
    }

    updateServing(type) {
        // update serving
        const newOne = type === 'des' ? this.servings - 1 : this.servings + 1;

        // update ingredients amount

        this.ingredients.forEach(ingredient => {
            ingredient.count = (ingredient.count / this.servings) * newOne;
        });

        this.servings = newOne;
    }
};