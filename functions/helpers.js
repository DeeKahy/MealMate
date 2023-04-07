import path from "path";
import fs from "fs";
let helpers = {
    findSmallest: (myArray, res) => {
        let json = JSON.parse(myArray);
        json.sort(helpers.sortingExp);
        let count = 0;
        let array = [];
        for (const item of json) {
            if (count < 5) {
                count++;
                array.push(item);
            }
            else {
                break;
            }
        }
        res.json(array);
    },
    sortingExp: (a, b) => {
        if (a.expirationDate > b.expirationDate) {
            return 1;
        } else if (a.expirationDate < b.expirationDate) {
            return -1;
        } else {
            return 0;
        }
    }
}



export default helpers;