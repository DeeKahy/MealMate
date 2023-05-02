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

// This Function Is the one witch confirms the users identety, and help us send the right data to the rigth user.

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

        const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '24h' });// Generate an authentication token with experation day, 1 hour i milisecounds

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
        "username": req.user.username
    })
})


//Use this API to get settings from the user: Username, email, and date of birth are available.
router.get("/API/getSettings", verifyToken, (req, res) => {
    const filePath = path.join(path.resolve() + "/data/Passwords/users.json");

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const user = data.users.find(user => user.username === req.user.username);

    res.json({
        "username": user.username,
        "email": user.email,
        "birthday": user.birthday,
        "household": user.household
    })
})

router.post("/API/saveSettings", verifyToken, (req, res) => {
    const filePath = path.join(path.resolve() + "/data/Passwords/users.json");

    const userDetails = {
        household: req.body.household
    };

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const user = data.users.find(user => user.username === req.user.username);

    if (user) {
        user.household = userDetails.household;

        fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error updating user's household value");
            } else {
                res.status(200).send("User's household value updated successfully");
            }
        });
    } else {
        res.status(404).send("User not found");
    }
})


router.post("/API/Private_properties", verifyToken, (req, res)=>{
const userdatanewproperties =[]

const ppropertydata = {
    "name": req.body["name"],
    "calories per 100gram": req.body["calories per 100gram"],
    "co2 per 1kg": req.body["co2 per 1kg"],
    "protein pr 100 gram": req.body["protein pr 100 gram"],
    "carbohydrate pr 100 gram": req.body["carbohydrate pr 100 gram"],
    "fat pr 100 gram": req.body["fat pr 100 gram"]
  };
  userdatanewproperties.push(ppropertydata);
  console.log(userdatanewproperties);

  const dataPath = path.join(path.resolve() + `/data/USERS/${req.user.username}/Private_item_property_list.json`);
  let data = [];
  try {
      data = JSON.parse(fs.readFileSync(dataPath));
  } catch (error) { }

  // Add the new data to the array
  data.push(req.body);

  // Write the updated data back to the JSON file
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));


res.json({ message: "Data received" });
})



router.post("/API/consumeditem", verifyToken, (req, res) => {
    removeItem.consumeItem(req, res);
})


router.post("/API/wasteditem", verifyToken, (req, res) => {
    removeItem.wasteItem(req, res)
})

import helpers from "./functions/helpers.js"

// getting a list route (still neds to be modified for real login system) <------This Comment sucks Please Igonore it Carl


//This is our API, that one can fecht from, It will return The items.json file from the given user that is trying to acces the data. <------ Carl Note
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


//This funtion is used as an api for the users to fethc the Global-Item.json file. <------ Carl Note
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

//Carls Thingy Start Here DOnt YOU DARE TOUCH IT, ITS MY NONO ZONE
// Carls Api for fethcing private item  property list 
router.get("/API/GetPrivateProtertyList", verifyToken, async (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/Private_item_property_list.json`;

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

router.get("/API/getweeklyWaste", verifyToken, async (req, res) => {
    const data = await getWeeklyWaste(req, res);
    res.json(data);
});
router.get("/API/prevous7days", verifyToken, async (req, res) => {
    const data = await prevous7days(req, res);
    res.json(data);
});
router.get("/API/getmonthlyWaste", verifyToken, async (req, res) => {
    const data = await getmonthlyWaste(req, res);
    res.json(data);
});


async function prevous7days(req, res) {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/wastedItems.json`;

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                reject("Internal Server Error");
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
    
                resolve(filteredData);
            }
        });
    });
}


async function getmonthlyWaste(req, res) {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/wastedItems.json`;

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                reject("Internal Server Error");
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
    
                resolve(filteredData);
            }
        });
    });
}
async function getWeeklyWaste(req, res) {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/wastedItems.json`;

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                reject("Internal Server Error");
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
                resolve(filteredData);
            }
        });
    });
}

// router.get("/API/getWeeklyForRoundCO2", verifyToken, async (req, res) => {
//     const wasted = await getmonthlyWaste(req, res);
//     const dataPath = path.join(path.resolve() + "/data/Global-Items/Global-Items.json");

//     let data = {};
//     try {
//         data = JSON.parse(fs.readFileSync(dataPath));
//     } catch (error) { }

//     let co2 = 0;
//     wasted.forEach(item => {
//         const dataItem = data.find(itemData => itemData.name === item.name);
//         if (dataItem) {
//             const amountWasted = (item.weight - item.eaten) * (dataItem.co2_per_1kg / 1000);
//             co2 += amountWasted;
//         }
//     });
//     res.json(co2);
// });





router.get("/API/getWeeklyCO2", verifyToken, async (req, res) => {
    const wasted = await getWeeklyWaste(req, res);
    const dataPath = path.join(path.resolve() + "/data/Global-Items/Global-Items.json");

    let data = {};
    try {
        data = JSON.parse(fs.readFileSync(dataPath));
    } catch (error) { }

    let co2 = 0;
    wasted.forEach(item => {
        const dataItem = data.find(itemData => itemData.name === item.name);
        if (dataItem) {
            const amountWasted = (item.weight - item.eaten) * (dataItem.co2_per_1kg / 1000);
            co2 += amountWasted;
        }
    });

    res.json({ co2 });
});


router.get("/API/prevous7daysCO2", verifyToken, async (req, res) => {
    const wasted = await prevous7days(req, res);
    const dataPath = path.join(path.resolve() + "/data/Global-Items/Global-Items.json");

    let data = {};
    try {
        data = JSON.parse(fs.readFileSync(dataPath));
    } catch (error) { }

    let co2 = 0;
    wasted.forEach(item => {
        const dataItem = data.find(itemData => itemData.name === item.name);
        if (dataItem) {
            const amountWasted = (item.weight - item.eaten) * (dataItem.co2_per_1kg / 1000);
            co2 += amountWasted;
        }
    });

    res.json({ co2 });
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





//This is where The register Function start, This is the code that creates the users files. 
router.post('/newuser', async (req, res) => {
    // Extract the new user data from the request body
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        birthday: req.body.birthday,
        password: crypto.createHash('sha256').update(req.body.password).digest('hex'), //Requests the password from the frontend and encrypts it using the security standard AES256-bit encryption method.
        household: 1
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
    users44.push(newUser);
    // Write the updated data back to the JSON file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    await fs.promises.mkdir(`data/USERS/${newUser.username}`, (err) => {
        if (err) throw err;
    });

    const itemsStandard = '[]';

    //Creating the 3 standard data files for the user
    await fs.promises.writeFile(`data/USERS/${newUser.username}/consumedItems.json`, itemsStandard, (err) => {
        if (err) throw err;
    });

    await fs.promises.writeFile(`data/USERS/${newUser.username}/items.json`, itemsStandard, (err) => {
        if (err) throw err;
    });

    await fs.promises.writeFile(`data/USERS/${newUser.username}/wastedItems.json`, itemsStandard, (err) => {
        if (err) throw err;
    });

    await fs.promises.writeFile(`data/USERS/${newUser.username}/Private_item_property_list.json`, itemsStandard, (err) => {
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
        price: req.body.price,
        bought: false
      };

    shoppingList.push(newItem);
    saveShoppingList(filePath, shoppingList);
    res.send('Item added to shopping list: ' + JSON.stringify(newItem));
  });
  
  // Get all items in the shopping list
  router.get("/api/shoppingList", verifyToken, (req, res) =>
 {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/shoppinglist.json`;
    const shoppingList = getShoppingList(filePath);
    res.send(shoppingList);
  });

  router.post("/api/shoppingListCheck/:id", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/shoppinglist.json`;
    const itemId = req.params.id;
    const shoppingList = getShoppingList(filePath);

    // Get the item from the shoppingList array with the matching itemId
    const itemToUpdate = shoppingList.find(item => item.id === itemId);

    // Get the current value of the "bought" parameter of the item
    let currentValue = itemToUpdate.bought;

    // Update the value to the opposite of its current value
    let updatedValue = !currentValue;

    // Update the "bought" parameter of the item in the shoppingList array
    itemToUpdate.bought = updatedValue;

    // Save the updated shopping list JSON file
    saveShoppingList(filePath, shoppingList);

    // Send a response indicating that the item has been updated
    res.send(`Item with id ${itemId} has been updated`);
    })
  
  // Remove an item from the shopping list
  router.delete("/api/shoppingList/:id", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/shoppinglist.json`;
    const itemId = req.params.id;
    const shoppingList = getShoppingList(filePath);
    const updatedShoppingList = shoppingList.filter(function(item) {
      return item.id !== itemId;
    });
    saveShoppingList(filePath, updatedShoppingList);
    res.send('Item removed from shopping list: ' + itemId);
  });

  // Get price of product using Sallinggroups API
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
    res.json({ suggestions: [{title: undefined, price: 0}] });
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



// This adds the abilty to delete individual properties of objects
  router.post('/API/ppDeleteProperti', verifyToken, (req, res) => {

    let name_of_object =req.body.name
    let name_of_properti=req.body.properties
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/Private_item_property_list.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = JSON.parse(data.toString("utf8"));
            const itemIndex = jsonData.findIndex(item => item.name === name_of_object);
            delete jsonData[itemIndex][name_of_properti];
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), err => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.json({ message: 'Property deleted successfully' });
                }
            });
        }
    });
    res.json({ message: 'Property deleted successfully' });
  })




 router.post('/API/ppDeleteitem', verifyToken, (req, res) => {

let name_of_object =req.body.name;

const filePath = path.resolve() + `/data/USERS/${req.user.username}/Private_item_property_list.json`;


fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    } else {
        const jsonData = JSON.parse(data.toString("utf8"));
        const itemIndex = jsonData.findIndex(item => item.name === name_of_object);
        jsonData.splice(itemIndex, 1);
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), err => {
           
            if (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
            } else {
                
                 res.json({ message: 'Item deleted successfully' });
            }
        });
    }
});


  });


  router.post('/API/ppsaveproperties', verifyToken, (req, res) => {

    const filePath = path.resolve() + `/data/USERS/${req.user.username}/Private_item_property_list.json`;


    let name_of_object =req.body.nameofitem;
    let newpropname_of_item=req.body.property;
    let newvalue=req.body.value
    let formerprop=req.body.formerprop
   


    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = JSON.parse(data.toString("utf8"));
            const itemIndex = jsonData.findIndex(item => item.name === name_of_object);
            delete jsonData[itemIndex][formerprop];
            jsonData[itemIndex][newpropname_of_item] = newvalue;
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), err => {
               
                if (err) {
                    console.error(err);
                    res.status(500).send("Internal Server Error");
                } else {
                    
                     res.json({ message: 'Item updated successfully' });
                }
            });
        }
    });


  });





  router.post('/API/ppsavenewproperties', verifyToken, (req, res) => {
    let name_of_object =req.body.nameofitem;
    let newpropname_of_item=req.body.property;
    let newvalue=req.body.value
    
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/Private_item_property_list.json`;
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = JSON.parse(data.toString("utf8"));
            const itemIndex = jsonData.findIndex(item => item.name === name_of_object);
            
            jsonData[itemIndex][newpropname_of_item] = newvalue;
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), err => {
               
                if (err) {
                    console.error(err);
                    res.status(500).send("Internal Server Error");
                } else {
                    
                     res.json({ message: 'Prop/value added successfully' });
                }
            });
        }
    });

  });


  router.post("/API/pp_new_item", verifyToken, (req, res)=>{
    const userdatanewproperties =[]
    
    const ppropertydata = {
        "name": req.body["name"],
      };
      userdatanewproperties.push(ppropertydata);
      console.log(userdatanewproperties);
    
      const dataPath = path.join(path.resolve() + `/data/USERS/${req.user.username}/Private_item_property_list.json`);
      let data = [];
      try {
          data = JSON.parse(fs.readFileSync(dataPath));
      } catch (error) { }
    
      // Add the new data to the array
      data.push(req.body);
    
      // Write the updated data back to the JSON file
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    
    
    res.json({ message: "Data received" });
    })









export default router