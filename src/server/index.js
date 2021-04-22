const http = require('http')
let path = require('path')

//const port = process.env.PORT //not working?
const port = process.env.PORT || 3000;

// use createReadStream instead to save memory
const fs = require('fs');
const klantHTML = fs.readFileSync('src/client/klant/klant.html');
const orderDetailsHTML = fs.readFileSync('src/client/klant/orderDetails.html')
const klantJS = fs.readFileSync('src/client/js/klant.js');
const style = fs.readFileSync('src/client/css/style.css');
const faviconPng = fs.readFileSync('src/client/img/logo.png');

const server = http.createServer((req, res) => {
    console.log("New http request with url: " + req.url);
    res.statusCode = 200
    if (req.url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.write(klantHTML);
        res.end();
    }
    if (req.url === "/js/klant.js") {
        res.setHeader("Content-Type", "text/javascript");
        res.write(klantJS);
        res.end();
    }
    if (req.url === "/css/style.css") {
        res.setHeader("Content-Type", "text/css");
        res.write(style);
        res.end();
    }
    if (req.url === "/favicon.ico" || req.url === "/img/logo.png") {
        res.setHeader("Content-Type", "image/png");
        res.write(faviconPng);
        res.end();
    }
    if (req.url === "/html/orderDetails") {
        res.setHeader("Content-Type", "text/html");
        res.write(orderDetailsHTML);
        res.end();
    }
    if (req.url === "/placeOrder") {
        req.on('data', function (data){
            console.log('new order:',JSON.parse(data));
            addOrderToOrderList(JSON.parse(data));
            res.write(JSON.stringify(orders));
            res.end();
        })
    }
    if (req.url === "/getMenu") {
        req.on('data', function (data){
            res.write(JSON.stringify(menu));
            res.end();
        })
    }
})

server.listen(port, () => {
    console.log(`Server running at port ${port}`)
})

//////////FIREBASE SETUP////////////
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
let firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDgfUqtFkS8SiuoIWyzPTQhsR9LlKllnhU",
    authDomain: "online-toog.firebaseapp.com",
    databaseURL: "https://online-toog-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "online-toog",
    storageBucket: "online-toog.appspot.com",
    messagingSenderId: "702294666952",
    appId: "1:702294666952:web:e75e1de246283972aebffd",
    measurementId: "G-YC8H52WHY2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

const firestoreDatabase = firebase.firestore();
const realtimeDatabase = firebase.database();

let orders = [];

realtimeDatabase.ref("orders").on("value", function(snapshot) {
    console.log(snapshot.val());
    orders = snapshot.val();
}, function (errorObject) {
    console.log("The read failed: " + errorObject);
});

let menu = [];
realtimeDatabase.ref("menu").on("value", function(snapshot) {
    console.log(snapshot.val());
    menu = snapshot.val();
}, function (errorObject) {
    console.log("The read failed: " + errorObject);
});



function addOrderToOrderList(order){
    realtimeDatabase.ref("orders/" + Date.now()).set(order).then(r  => console.log('data successfully set'));
}
