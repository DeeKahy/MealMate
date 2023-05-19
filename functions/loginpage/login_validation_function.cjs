const crypto = require('crypto');
const jwt = require('jsonwebtoken');
    
function login_validation_function(users44) {
    return function(req, res) { //console.log("hes")
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


        return res.status(200).json({ success: 'User logged in successfully' });
    }
    else {
        return res.status(401).json({ error: 'Authentication failed wrong password' });
    }
    }
}


module.exports= login_validation_function;