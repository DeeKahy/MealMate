import save_single_prop_real from './save_existing_propperties'

import httpMocks from 'node-mocks-http';
import fs from "fs"
import mockFs from 'mock-fs';



describe("Test save_single_prop function", () => {

    beforeEach(() => { // this runs before the test
        const fakedata2 = [
            {
                "name": "hej",
                "": "2",
                "test2": "2"
            },
            {
                "name": "hey"
            },
            {
                "name": ""
            },
            {
                "name": "cake"
            },
            {
                "name": "ddd",
                "dd": "ddddd"
            },
            {
                "name": "thispartwetest",
                "properti": "wrong"
            }
        ];


        mockFs({// this create a fake file system/ simulation of a file system, with the fake data 
            './username/Private_item_property_list.json': JSON.stringify(fakedata2)
        });
    });

    // Clean up the fake file system, and fake file
    afterEach(() => {
        mockFs.restore();
    });

    test('it should update the property of the item', async () => {
        const filePath = './username/Private_item_property_list.json';

        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/API/ppsaveproperties',
            body: { nameofitem: "thispartwetest", value: "2", formerprop:"properti", property: "betterpropname" }
        });
9
        const res = httpMocks.createResponse();

        const middleware = save_single_prop_real(filePath);// here we the filepath,  the function will then find the file in the fake file system, and run that
        await middleware(req, res);

       // expect(res.statusCode).toBe(200);// it will do it corectly and therefore send status 200


        const updatedData = JSON.parse(fs.readFileSync(filePath, 'utf8')); // this reads in the fake file system
    //    console.log(updatedData)
        expect(updatedData[5].betterpropname).toBe("2");// Here we check if the updated date is correct
    });
});