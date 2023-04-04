import express from 'express';
const app = express();
const http = express();
import router from './routes.js';
import https from "https";
import fs from "fs";

const privateKey = fs.readFileSync("/etc/letsencrypt/live/mealmate.otterhosting.net/privkey.pem");
const certificate = fs.readFileSync("/etc/letsencrypt/live/mealmate.otterhosting.net/cert.pem");

app.use(express.static("public"));
app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);


http.get('*', function (req, res) {
    res.redirect('https://' + req.headers.host + req.url);
})


http.listen(app.get('port'), function () {
    console.log('app listening at: ' + "http://localhost:" + app.get('port') + "/");
});

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen("443", function () {
    console.log(`port 443 at ` + "mealmate.otterhosting.net");
});