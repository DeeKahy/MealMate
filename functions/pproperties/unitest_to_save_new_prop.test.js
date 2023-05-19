import save_single_prop from './save_new_single_property.js'
import httpMocks from 'node-mocks-http';
import fs from "fs"
import mockFs from 'mock-fs';


// det der sker i denne her, er at vi laver en fake fil, og et fake filsystem, det sender vi til vores function som så kører det og sender svar
//bagefter tester vi om vores fake fil er blevet updateret
describe("Test save_single_prop function", () => {

    beforeEach(() => { // this runs before the test
        const fakedata = [
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
            './username/Private_item_property_list.json': JSON.stringify(fakedata)
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
            url: '/API/ppsavenewproperties',
            body: { nameofitem: "thispartwetest", property: "properti", value: "right" }
        });

        const res = httpMocks.createResponse();

        const middleware = save_single_prop(filePath);// here we the filepath,  the function will then find the file in the fake file system, and run that
        await middleware(req, res);

        expect(res.statusCode).toBe(200);// it will do it corectly and therefore send status 200


        const updatedData = JSON.parse(fs.readFileSync(filePath, 'utf8')); // this reads in the fake file system
        //console.log(updatedData)
        expect(updatedData[5].properti).toBe("right");// Here we check if the updated date is correct
    });
});
