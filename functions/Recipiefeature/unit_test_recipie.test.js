import { listRecipies } from './recipe.js';

describe('Test recipie function', () => {
    test('It should return an array of recipies if the ingredients are found', () => {

        const items = [{name: 'beef'}, {name: 'mushroom'}, {name: 'salad'}]; 
        const itemsWant = ['tomato']; 


        const returnRecipies = listRecipies(items, itemsWant);

        expect(returnRecipies[0].score).toBeGreaterThan(0);
        expect(returnRecipies).toHaveLength(30);

        
    });
    test('It should return an empty array of recipies if there is no ingredient', () => {

        const items = [];

        const itemsWant = [];

        const returnRecipies = listRecipies(items, itemsWant);

        expect(returnRecipies).toHaveLength(30);
        expect(returnRecipies[0].score).toBe(0);
    })
    test('It should return nothing if the ingredients makes no sense', () => {
        
        const items = [{name: 'stock'}, {name: '5454'}, {name: Symbol('hashbrowns')}]; 
        const itemsWant = [112, false, { prop: 'name' }]; 

        expect(Error);
    })
})