import express from 'express';
const router = express.Router();
import path from "path";
import fs from "fs"
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
router.use(cookieParser());
import crypto from 'crypto';


import recipies from './recipe.js'
router.post('/API/search', (req, res) => {
    const name = req.body.nameOfRecipe;
    res.json(recipies(name));
})











//New Page for forgot password This is the Current tasting page For Tokens login System. Dont touch it is hurting nobody.
router.get("/forgot", verifyToken, (req, res) => {

    res.sendFile(path.resolve() + "/public/login/forgot.html");
})
router.post("/forgot", (req, res) => {
    console.log(req);
    res.redirect("/");
})


import users from './loginfeature.js';// Here we import our read passord files.
const users44 = users();


console.log(users44) //console.logs to prove we are into the system, and shows off every username and password.

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
        console.log(req.user)
        console.log(token)
        console.log(req.user.username);
        console.log(decoded.exp)

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

    console.log(`${usernametest} tried to login`)// THis will log who tried to loged in or logged in

    let user = users44.find(function (user) {    // here we test if the user exist in the system, and if the password is correct
        return user.username === usernametest && user.password === passwordtest;
    });
    console.log(user)
    if (user) {// if the correct information is typed in the user will be given a token

        const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });// Generate an authentication token with experation day, 1 hour i milisecounds

        console.log(user.username);

        res.cookie('token', token, { httpOnly: true });// Set the token as a cookie on the client's browser
        //the { httpOnly: true }  option means that the cookie can only be accessed via HTTP/S and not via JavaScript, which helps to prevent cross-site scripting (XSS) attacks.


        return res.status(200).json({ success: 'User created successfully' });
    }
    else {
        res.redirect("/login");
    }
})


router.get("/API/getUserName", verifyToken, (req, res) => {
    res.json({ "username": req.user.username })

})



import removeItem from "./removeItem.js"

router.post("/API/consumeditem", verifyToken, (req, res) => {
    removeItem.consumeItem(req, res);
})


router.post("/API/waisteditem", verifyToken, (req, res) => {
    removeItem.waisteItem(req, res)
})

import helpers from "./helpers.js"

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

router.get("/API/gettopexp", verifyToken, (req, res) => {
    const filePath = path.resolve() + `/data/USERS/${req.user.username}/items.json`;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            const jsonData = data.toString("utf8");
            helpers.findSmallest(jsonData,res);
            // res.json(JSON.parse(jsonData));
        }
    });
    
});

// write list to file (still neds to be modified for real login system)
router.post("/API/postlist", verifyToken, (req, res) => {
        console.log(req.body);

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

        // Add the new data to the array
        data.users.push(newUser);

        // Write the updated data back to the JSON file
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        fs.mkdir(`data/USERS/${newUser.username}`, (err) => {
            if (err) throw err;
        });

        const itemsStandard = '[{"location": "Pantry","name": "Test (delete this)","expirationDate": "2023-05-04"}]';

        console.log(`${newUser.username} directory created.`);

        fs.writeFile(`data/USERS/${newUser.username}/consumedItems.json`, '', (err) => {
            if (err) throw err;
            console.log(`consumedItems.json created in ${newUser.username}`);
        });

        fs.writeFile(`data/USERS/${newUser.username}/items.json`, itemsStandard, (err) => {
            if (err) throw err;
            console.log(`items.json created in ${newUser.username}`);
        });

        fs.writeFile(`data/USERS/${newUser.username}/wastedItems.json`, '', (err) => {
            if (err) throw err;
            console.log(`wastedItems.json created in ${newUser.username}`);
        });

        // Return a response to the client
        return res.status(200).json({ success: 'User created successfully' });
        //res.redirect("/login");
    });



    export default router