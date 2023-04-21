import path from 'path';
import fs from 'fs';

const recipies = JSON.parse(fs.readFileSync(path.resolve() + '/data/listofrecipes.json'));

export function listRecipies(items, itemsWant) {
    try {
        const recipies1 = JSON.parse(JSON.stringify(recipies));
        let sorted = recipies1.map(recipe => {
            recipe.score = 0;
            recipe.ingredients.forEach(element => {
                items.forEach(item => {
                    if (element.ingredient.toLowerCase() === item.name.toLowerCase()) {
                        recipe.score++;
                    }
                });
                itemsWant.forEach(want => {
                    if (element.ingredient.toLowerCase().includes(want.toLowerCase())) {
                        recipe.score++;
                    }
                });
            });
            // recipies1.forEach(el => {
            //     if (el.score != undefined) {
            //         recipiesSaved.push(el);
            //     }
            // })
            return recipe;
        }).sort((a, b) => (b.score / b.ingredients.length) - (a.score / a.ingredients.length));
        return sorted;
    } catch (error) {
        console.log(error);
    }
}

export function topRecipiesForUsers(userItems) {
    try {
        const recipies2 = JSON.parse(JSON.stringify(recipies));
        let recipiesSaved = [];
        recipies2.forEach(recipe => {
            recipe.ingredients.forEach(element => {
                userItems.forEach(item => {
                    //Specific when it comes to items? should we have .includes()?
                    if (element.ingredient.toLowerCase() === item.name.toLowerCase()) {
                        if (recipe.score != undefined) {
                            recipe.score++;
                        }
                        else {
                            recipe.score = 1;
                        }
                    }
                })
            })
        })
        for (let i = 0; i < recipies.length; i++) {
            if (recipies2[i].score != undefined) {
                recipiesSaved.push(recipies2[i]);
            }
            if (recipiesSaved.length >= 5) {
                break;
            }
        }
        let sorted = recipiesSaved.sort((a, b) => (b.score / b.ingredients.length) - (a.score / a.ingredients.length));
        return sorted;
    } catch (error) {
        console.log(error);
    }
}