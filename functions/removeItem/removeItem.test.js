import removeItem from "./removeItem.js"

import httpMocks from 'node-mocks-http';
import fs from "fs"
import mockFs from 'mock-fs';



describe("testing removeItem", () => {

    beforeEach(() => { // this runs before the test
        const itemlist = [
            {
                "location": "fridge",
                "name": "Weight",
                "expirationDate": "2023-04-27",
                "weight": "123"

            },
            {
                "location": "fridge",
                "name": "Weight",
                "expirationDate": "2023-04-27",
                "weight": "123"

            },
            {
                "location": "fridge",
                "name": "Weight",
                "expirationDate": "2023-04-27",
                "weight": "123"

            },
            {
                "location": "fridge",
                "name": "Weight",
                "expirationDate": "2023-04-27",
                "weight": "123"

            }
            ,
            {
                "location": "fridge",
                "name": "moveme",
                "expirationDate": "2023-04-27",
                "weight": "500"

            },
            {
                "location": "fridge",
                "name": "Weight",
                "expirationDate": "2023-04-27",
                "weight": "500"

            },
            {
                "location": "fridge",
                "name": "Weight",
                "expirationDate": "2023-04-27",
                "weight": "500"

            },
            {
                "location": "fridge",
                "name": "Weight",
                "expirationDate": "2023-04-27",
                "weight": "500"

            }
        ];
        let wasteditemslist = [];

        mockFs({// this create a fake file system/ simulation of a file system, with the fake data 
            './username/items.json': JSON.stringify(itemlist),
            './username/wastedItems.json': JSON.stringify(wasteditemslist)
        });
    });

    // Clean up the fake file system, and fake file
    afterEach(() => {
        mockFs.restore();
    });

    test('it should move an item and add 2 new key value pairs', async () => {
        const items = './username/items.json';
        const wasteItems = './username/wastedItems.json';

        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/API/wasteditem',
            body: { index: 4, eaten: "50" }
        });

        const res = httpMocks.createResponse();

        await removeItem.wasteItem(req, res, items, wasteItems);

        // NEw stuff
        const updatedData2 = JSON.parse(fs.readFileSync(wasteItems, 'utf8')); //new
        expect(res.statusCode).toBe(200)

        expect(updatedData2[0].eaten).toBe(250);// new

        //Here we check if the updated date is correct
    });
    it('rejects the promise with an error message', async () => {
        const items = './username/items.json';
        const wasteItems = './username/wastedItems.json';

        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/API/wasteditem',
            body: { index: 50, eaten: "50" }
        });
        const res = httpMocks.createResponse();
        try {
            await removeItem.wasteItem(req, res, items, wasteItems);
        }
        catch(error){
            expect(error).toBe("index out of bounds");
        }
    });
});
