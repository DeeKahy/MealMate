import getWeeklyWaste from './get_weekly_waste_statistics.js'
import httpMocks from 'node-mocks-http';
import fs from "fs"
import mockFs from 'mock-fs';

describe("Test getweeklyWaste function", () => {
    beforeEach(() => {
        const fakedata = [
            {
                "location": "fridge",
                "name": "Pepper, hot chili, raw",
                "expirationDate": "2023-04-27",
                "weight": "1000",
                "wastedDate": "2023-05-13",
                "eaten": 750
              },
              {
                "location": "fridge",
                "name": "Chicken, breast, boiled, sliced",
                "expirationDate": "2023-04-27",
                "weight": "350",
                "wastedDate": "2023-05-11",
                "eaten": 125
              },
              {
                "location": "fridge",
                "name": "Chicken, sausage",
                "expirationDate": "2023-04-27",
                "weight": "350",
                "wastedDate": "2023-05-02",
                "eaten": 200
              },
              {
                "location": "fridge",
                "name": "Tomato, dried",
                "expirationDate": "2023-04-27",
                "weight": "350",
                "wastedDate": "2023-05-12",
                "eaten": 300
              },
              {
                "location": "fridge",
                "name": "Sausage, salami",
                "expirationDate": "2023-04-27",
                "weight": "350",
                "wastedDate": "2023-05-05",
                "eaten": 200
              }
        ];

        mockFs({
            "./username/wastedItems.json": JSON.stringify(fakedata)
        });
    });


afterEach(() => {
    mockFs.restore();
});

test("It should get wasted items from the last 7 days", async () => {
    const filePath = "./username/wastedItems.json";

    const date = {
      year: 2023,
      month: 4, // 0-11
      day: 17
  };

    const req = httpMocks.createRequest();


    const res = httpMocks.createResponse();

    const middleware = getWeeklyWaste(filePath, date);
    await middleware(req, res);

    expect(res.statusCode).toBe(200);
 
    const updatedData = JSON.parse(res._getData());

    expect(updatedData).toEqual([
      {
        "location": "fridge",
        "name": "Pepper, hot chili, raw",
        "expirationDate": "2023-04-27",
        "weight": "1000",
        "wastedDate": "2023-05-13",
        "eaten": 750
      },
      {
        "location": "fridge",
        "name": "Chicken, breast, boiled, sliced",
        "expirationDate": "2023-04-27",
        "weight": "350",
        "wastedDate": "2023-05-11",
        "eaten": 125
      },
      {
        "location": "fridge",
        "name": "Tomato, dried",
        "expirationDate": "2023-04-27",
        "weight": "350",
        "wastedDate": "2023-05-12",
        "eaten": 300
      }
  ]);
});
});