import express from 'express';
const router = express.Router();
import path from "path";
import fs from "fs"
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
router.use(cookieParser());
import crypto from 'crypto';
import removeItem from "./functions/removeItem.js"

const userDirectoryPath = "/data/USERS/";

import { listRecipies, topRecipiesForUsers } from './functions/recipe.js'
router.post('/API/search', verifyToken, (req, res) => {
    fs.promises.readFile(`${path.resolve()}/data/USERS/${req.user.username}/items.json`)
        .then((result) => JSON.parse(result))
        .then((data) => {
            let response = listRecipies(data, req.body.itemsSaved);
            res.json(response);
        })

})


router.get('/API/userItem', verifyToken, (req, res) => {
    fs.promises.readFile(`${path.resolve()}/data/USERS/${req.user.username}/items.json`)
        .then((result) => JSON.parse(result))
        .then((data) => {
            let response = topRecipiesForUsers(data);
            res.json(response);
        })
})

//New Page for forgot password This is the Current tasting page For Tokens login System. Dont touch it is hurting nobody.
router.get("/forgot", verifyToken, (req, res) => {

    res.sendFile(path.resolve() + "/public/login/forgot.html");
})
router.post("/forgot", (req, res) => {
    res.redirect("/");
})


import users from './functions/loginfeature.js';// Here we import our read passord files.
const users44 = users();


// console.log(users44) //console.logs to prove we are into the system, and shows off every username and password.

function verifyToken(req, res, next) {
    const token = req.cookies.token;// Here we request the cookie from the user
    // console.log(token)
    if (!token) {// here we say if the token is undefined, it will redirect the user the login page.
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, 'secret');// Here we decode our token
        //console.log(decoded)
        req.user = decoded;// here we acces the user
        // console.log(req.user)
        // console.log(token)
        // console.log(req.user.username);
        // console.log(decoded.exp)

        if (decoded.exp * 1000 <= Date.now()) { // Check if the token has expired the  it must be multiplied by 1000, beacuse it has to be in secounds. because the start time is from 1970
            return res.redirect('/login');
        }

        next();//If next() is not called, the request will hang and will not proceed to the next middleware function or route handler.
    } catch (err) { // if an error is meat, the program will redirect user to login page.
        res.redirect('/login');
    }
}


router.post("/login", (req, res) => {  // post action declared, will wait for post from front end                                
    let usernametest = req.body.username; //gets username from front end
    let passwordtest = crypto.createHash('sha256').update(req.body.password).digest('hex'); //gets password from front end

    // console.log(`${usernametest} tried to login`)// THis will log who tried to loged in or logged in

    let user = users44.find(function (user) {    // here we test if the user exist in the system, and if the password is correct
        return user.username === usernametest && user.password === passwordtest;
    });
    if (user) {// if the correct information is typed in the user will be given a token

        const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });// Generate an authentication token with experation day, 1 hour i milisecounds


        res.cookie('token', token, { httpOnly: true });// Set the token as a cookie on the client's browser
        //the { httpOnly: true }  option means that the cookie can only be accessed via HTTP/S and not via JavaScript, which helps to prevent cross-site scripting (XSS) attacks.


        return res.status(200).json({ success: 'User created successfully' });
    }
    else {
        res.redirect("/login");
    }
})


router.get("/API/getUserName", verifyToken, (req, res) => {
    res.json({
        "username": req.user.username,
    })
})





router.post("/API/consumeditem", verifyToken, (req, res) => {
    removeItem.consumeItem(req, res);
})


router.post("/API/waisteditem", verifyToken, (req, res) => {
    removeItem.waisteItem(req, res)
})

import helpers from "./functions/helpers.js"

// getting a list route (still neds to be modified for real login system)
router.get("/API/getList", verifyToken, async (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/items.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = data.toString("utf8");
            res.json(JSON.parse(jsonData));
        }
    });
});

// getting a list route (still neds to be modified for real login system)
// router.get("/API/userItemsRecipies", verifyToken, async (req, res) => {
//     const filePath = path.resolve() + `/data/USERS/${req.user.username}/items.json`;

//     fs.readFile(filePath, (err, data) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send("Internal Server Error");
//         } else {
//             const jsonData = data.toString("utf8");
//             const userItems = JSON.parse(jsonData);
//         }
//     });
// });

//!!TO READ!!
router.get("/API/getListGlobalItems", async (req, res) => {
    const filePath = path.resolve() + `/data/Global-Items/Global-Items.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = data.toString("utf8");
            res.json(JSON.parse(jsonData));
        }
    });
});

router.get("/API/gettopexp", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/items.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = data.toString("utf8");
            helpers.findSmallest(jsonData, res);
            // res.json(JSON.parse(jsonData));
        }
    });

});

// getting a list route (still neds to be modified for real login system)
router.get("/API/getConsumedItems", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/consumedItems.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = data.toString("utf8");
            res.json(JSON.parse(jsonData));
        }
    });
});

// getting a list route (still neds to be modified for real login system)
router.get("/API/getWastedItems", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/wastedItems.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = data.toString("utf8");
            res.json(JSON.parse(jsonData));
        }
    });
});

router.get("/API/getweeklyWaste", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/wastedItems.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = JSON.parse(data.toString("utf8"));

            // Get the date from one week ago
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            // Filter the data based on the wastedDate attribute
            const filteredData = jsonData.filter(item => {
                const itemDate = new Date(item.wastedDate);
                return itemDate >= oneWeekAgo;
            });

            res.json(filteredData);
        }
    });
});


router.get("/API/prevous7days", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/wastedItems.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = JSON.parse(data.toString("utf8"));

            // Get the date from 14 days ago
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

            // Get the date from 7 days ago
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            // Filter the data based on the wastedDate attribute
            const filteredData = jsonData.filter(item => {
                const itemDate = new Date(item.wastedDate);
                return itemDate >= twoWeeksAgo && itemDate < oneWeekAgo;
            });

            res.json(filteredData);
        }
    });
});



router.get("/API/getmonthlyWaste", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/wastedItems.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = JSON.parse(data.toString("utf8"));

            // Get the date from one week ago
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 30);

            // Filter the data based on the wastedDate attribute
            const filteredData = jsonData.filter(item => {
                const itemDate = new Date(item.wastedDate);
                return itemDate >= oneWeekAgo;
            });

            res.json(filteredData);
        }
    });
});

// write list to file (still neds to be modified for real login system)
router.post("/API/postlist", verifyToken, (req, res) => {

    // Read the existing data from the JSON file
    const dataPath = path.join(path.resolve() + `/data/USERS/${req.user.username}/items.json`);
    let data = [];
    try {
        data = JSON.parse(fs.readFileSync(dataPath));
    } catch (error) { }

    // Add the new data to the array
    data.push(req.body);

    // Write the updated data back to the JSON file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.redirect("/itemtracking");
});

router.post("/API/edititem", verifyToken, (req, res) => {

    // Read the existing data from the JSON file
    const dataPath = path.join(path.resolve() + `/data/USERS/${req.user.username}/items.json`);
    let data = [];
    try {
        data = JSON.parse(fs.readFileSync(dataPath));
    } catch (error) { }
    let modifiedjsson = { "location": req.body.location, "name": req.body.name, "expirationDate": req.body.expirationDate, }
    // Add the new data to the array
    data[req.body.index] = modifiedjsson;

    // Write the updated data back to the JSON file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.redirect("/itemtracking");
});

router.post('/newuser', (req, res) => {
    // Extract the new user data from the request body
    const newUser = {
        username: req.body.username,
        password: crypto.createHash('sha256').update(req.body.password).digest('hex')
    };

    const dataPath = path.join(path.resolve() + "/data/Passwords/users.json");
    let data = {};
    try {
        data = JSON.parse(fs.readFileSync(dataPath));
    } catch (error) { }

    // Check for duplicate usernames
    const duplicate = data.users.find(user => user.username === newUser.username);
    if (duplicate) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    if (fs.existsSync(`data/USERS/${newUser.username}/`)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Add the new data to the array
    data.users.push(newUser);

    // Write the updated data back to the JSON file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    fs.mkdir(`data/USERS/${newUser.username}`, (err) => {
        if (err) throw err;
    });

    const itemsStandard = '[]';


    fs.writeFile(`data/USERS/${newUser.username}/consumedItems.json`, itemsStandard, (err) => {
        if (err) throw err;
    });

    fs.writeFile(`data/USERS/${newUser.username}/items.json`, itemsStandard, (err) => {
        if (err) throw err;
    });

    fs.writeFile(`data/USERS/${newUser.username}/wastedItems.json`, itemsStandard, (err) => {
        if (err) throw err;
    });

    // Return a response to the client
    return res.status(200).json({ success: 'User created successfully' });
    //res.redirect("/login");
});

import { v4 as uuidv4 } from 'uuid';

function getShoppingList(path) {
    const shoppingListFilePath = path;
    if (!fs.existsSync(shoppingListFilePath)) {
        fs.writeFileSync(shoppingListFilePath, '[]');
    }
    const shoppingListData = fs.readFileSync(shoppingListFilePath, 'utf8');
    return JSON.parse(shoppingListData);
}

// Write the shopping list to the JSON file
function saveShoppingList(path, shoppingList) {
    const shoppingListFilePath = path;
    fs.writeFileSync(shoppingListFilePath, JSON.stringify(shoppingList));
}

router.post("/api/shoppingList", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/shoppinglist.json`;
    const shoppingList = getShoppingList(filePath);

    const newItem = {
        id: uuidv4(),
        name: req.body.name,
        price: req.body.price
    };

    shoppingList.push(newItem);
    saveShoppingList(filePath, shoppingList);
    res.send('Item added to shopping list: ' + JSON.stringify(newItem));
});

// Get all items in the shopping list
router.get("/api/shoppingList", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/shoppinglist.json`;
    const shoppingList = getShoppingList(filePath);
    res.send(shoppingList);
});

// Remove an item from the shopping list
router.delete("/api/shoppingList/:id", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/shoppinglist.json`;
    const itemId = req.params.id;
    const shoppingList = getShoppingList(filePath);
    const updatedShoppingList = shoppingList.filter(function (item) {
        return item.id !== itemId;
    });
    saveShoppingList(filePath, updatedShoppingList);
    res.send('Item removed from shopping list: ' + itemId);
});

router.get("/api/productPrice", async (req, res) => {
    const { query } = req.query;

    const response = await fetch(`https://api.sallinggroup.com/v1-beta/product-suggestions/relevant-products?query=${query}`, {
        headers: {
            "Authorization": "Bearer 3dac909e-0081-464f-aeac-f9a2efe5cf1a",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const data = await response.json();

    // Check if the response is empty
    if (!data || !data.suggestions || data.suggestions.length === 0) {
        res.json({ suggestions: [{ title: undefined, price: 0 }] });
        return;
    }

    res.json(data);
});

router.post("/API/changePassword", verifyToken, (req, res) => {

    const userDetails = {
        username: req.user.username,
        oldPassword: crypto.createHash('sha256').update(req.body.oldPassword).digest('hex'),
        newPassword1: crypto.createHash('sha256').update(req.body.newPassword1).digest('hex'),
        newPassword2: crypto.createHash('sha256').update(req.body.newPassword2).digest('hex')
    };

    const filePath = path.join(path.resolve() + "/data/Passwords/users.json");

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const user = data.users.find(user => user.username === userDetails.username);

    // Check if the old password matches with the user's password
    if (user.password !== userDetails.oldPassword) {
        return res.status(400).json({ error: 'Old password is incorrect!' });
    }

    // Check if the new password and confirm password match
    if (userDetails.newPassword1 !== userDetails.newPassword2) {
        return res.status(400).json({ error: 'The new password doesnt match!' });
    }

    // Update the user's password
    user.password = userDetails.newPassword1;

    // Save the updated data to file
    fs.writeFileSync(filePath, JSON.stringify(data));

    res.json({ success: true });


});
router.post("/API/getListGlobalItems", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/Global-Items/Global-Items.json`;
    fs.promises.readFile(filePath)                                            //.promises treat data from filePath as a promise
        .then((data) => JSON.parse(data))                                       //Converts read data to json format
        .then((json) => {
            console.log("barcode is " + req.body.barcode);                        //req.body.barcode = payload as defined in the fetch from html5.js
            //Takes read data as input 
            let found = [];
            for (let i = 0; i < json.length; i++) {
                if (json[i].barcodes != undefined) {
                    console.log("item has barocode " + json[i].name);
                    for (let j = 0; j < json[i].barcodes.length; j++) {
                        if (json[i].barcodes[j] == req.body.barcode) {
                            found.push(json[i]);
                        }
                    }
                }
            }
            if (found === []) {
                res.json({ msg: "not found" })
                // fs.promises.readFile(path.resolve() + `/data/USERS/${req.user.username}/Barcodes.json`)
                //     .then((data) => JSON.parse(data))
                //     .then((json) => {
                //         for (let i = 0; i < json.length; i++) {
                //             if (json[i].barcode != undefined && json[i].barcode == req.body.barcode) {
                //                 found = json[i].barcode;
                //                 break;
                //             }
                //         }
                //         if (!found) {
                //             res.json({ msg: "create new" })
                //         }
                //         else {
                //             res.json({ msg: "adding found" })
                //         }
                //     })
                //     .catch((err) => {
                //         console.log(err)
                //         res.json({ msg: "something went wrong" });
                //     })

            }
            else {
                res.json({ msg: `adding found`, array: found })
            }
        })
        .catch((error) => {
            console.log(error);
            res.json({ msg: "something went wrong" });
        });
});
export default router

