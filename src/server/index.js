const http = require('http')
const https = require('https')
const fetch = require("node-fetch");
let path = require('path')
let orders = [];

//const port = process.env.PORT //not working?
const port = process.env.PORT || 3001;

// use createReadStream instead to save memory
const fs = require('fs');
const klantHTML = fs.readFileSync('src/client/klant/klant.html');
const orderDetailsHTML = fs.readFileSync('src/client/klant/orderDetails.html');
const orderReceived = fs.readFileSync('src/client/klant/orderReceived.html');
const payconisPaymentStatusSUCCEEDED = fs.readFileSync('src/client/klant/payconiqPaymentStatusSucceeded.html');
const payconisPaymentStatusERROR = fs.readFileSync('src/client/klant/payconiqPaymentStatusError.html');
const toogHtml = fs.readFileSync('src/client/toog/toog.html');
const klantJS = fs.readFileSync('src/client/js/klant.js');
const toogJs = fs.readFileSync('src/client/js/toog.js');
const style = fs.readFileSync('src/client/css/style.css');
const toogStyle = fs.readFileSync('src/client/css/toog.css');
const faviconPng = fs.readFileSync('src/client/img/logo.png');
const cash = fs.readFileSync('src/client/img/cash.png');
const payconiq = fs.readFileSync('src/client/img/payconiq_by_Bancontact-logo-app-pos.png');


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
    if (req.url === "/js/toog.js") {
        res.setHeader("Content-Type", "text/javascript");
        res.write(toogJs);
        res.end();
    }
    if (req.url === "/css/toog.css") {
        res.setHeader("Content-Type", "text/css");
        res.write(toogStyle);
        res.end();
    }
    if (req.url === "/favicon.ico" || req.url === "/img/logo.png") {
        res.setHeader("Content-Type", "image/png");
        res.write(faviconPng);
        res.end();
    }
    if (req.url === "/img/cash.png") {
        res.setHeader("Content-Type", "image/png");
        res.write(cash);
        res.end();
    }
    if (req.url === "/img/payconiq_by_Bancontact-logo-app-pos.png") {
        res.setHeader("Content-Type", "image/png");
        res.write(payconiq);
        res.end();
    }
    if (req.url === "/getMenu") {
        req.on('data', function (data){
            console.log(data.toString());
            res.write(JSON.stringify(menu));
            res.end();
        })
    }
    if (req.url === "/html/orderDetails") {
        res.setHeader("Content-Type", "text/html");
        res.write(orderDetailsHTML);
        res.end();
    }
    if (req.url === "/orderReceived") {
        res.setHeader("Content-Type", "text/html");
        res.write(orderReceived);
        res.end();
    }
    if (req.url === "/placeOrder/cash") {
        req.on('data', function (data){
            console.log('new order will be payed in cash:',JSON.parse(data));
            addOrderToOrderList(JSON.parse(data));
            res.write(JSON.stringify(orders));
            res.end();
        })
    }
    if (req.url === "/placeOrder/payconiq") {
        req.on('data', function (data){
            console.log('new order payed with payconiq:',JSON.parse(data));
            let order = JSON.parse(data)
            addOrderToOrderList(order);
            let orderDetails = order[order.length-1]
            let payment = {
                reference: orderDetails.timestamp,
                amount: orderDetails.amount*100+6, //Amount is in cents and we add 6 cents transaction costs
                currency: 'EUR',
                description: "Bestelling "+orderDetails.timestamp,
                callbackUrl: 'http://online-toog.jhdebem.be/paymentResponseFromPayconiq',
                returnUrl: "http://online-toog.jhdebem.be/orderReceived",
            }
            console.log('created the payment body: ' + JSON.stringify(payment))
            const userAction = async () => {
                const response = await fetch('https://api.ext.payconiq.com/v3/payments/', {
                    method: 'POST',
                    body: JSON.stringify(payment),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer '+APIkey,
                        'Cache-Control': 'no-cache',
                    }
                });
                const payconiqResponseInJSON = await response.json(); //extract JSON from the http response
                console.log("return : "+JSON.stringify(payconiqResponseInJSON))
                return payconiqResponseInJSON
            }
            userAction().then(payconiqResponseInJSON => {
                console.log('then : '+JSON.stringify(payconiqResponseInJSON))
                res.write(JSON.stringify(payconiqResponseInJSON));
                res.end();
            })
        })
    }
    if (req.url.includes("/lookupOrder")) {
        let paymentReference = req.url.replace("/lookupOrder/",'');
        console.log('server is going to look for payconiq payment with reference: '+ paymentReference)
        const userAction = async () => {
            const response = await fetch('https://api.ext.payconiq.com/v3/payments/'+paymentReference, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer '+APIkey,
                }
            });
            const payconiqResponseInJSON = await response.json(); //extract JSON from the http response
            console.log("Payment details: "+JSON.stringify(payconiqResponseInJSON))
            return payconiqResponseInJSON
        }
        userAction().then(payconiqResponseInJSON => {
            res.setHeader("Content-Type", "text/html");
            if(payconiqResponseInJSON.status === "SUCCEEDED"){
                res.write(payconisPaymentStatusSUCCEEDED);
            }else{
                res.write(payconisPaymentStatusERROR);
                console.error('error, payment not succeeded: '+JSON.stringify(payconiqResponseInJSON))
            }
            res.end();
        })
    }
    if (req.url === "/paymentResponseFromPayconiq") {
        req.on('data', function (data){
            console.log('Order response form payconiq:',JSON.parse(data));
            //TODO update the payment status of the order in the database
            res.end();
        })
    }
    if(req.url === "/toog"){
        res.setHeader("Content-Type", "text/html");
        res.write(toogHtml);
        res.end();
    }
    if (req.url === "/getOrders") {
        const userAction = async () => {

            let body = {
                "paymentStatuses": [ "PENDING", "IDENTIFIED", "AUTHORIZED", "AUTHORIZATION_FAILED", "SUCCEEDED", "FAILED", "CANCELLED", "EXPIRED" ],
            }

            const response = await fetch('https://api.ext.payconiq.com/v3/payments/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + APIkey,
                },
                body: JSON.stringify(body)
            });
            const payconiqResponseInJSON = await response.json(); //extract JSON from the http response
            console.log("List of payments: " + JSON.stringify(payconiqResponseInJSON))
            return payconiqResponseInJSON
        }
        userAction().then(payconiqResponseInJSON => {
            console.log('List of payments: ' + JSON.stringify(payconiqResponseInJSON))
            let payments = payconiqResponseInJSON.details
            for(let orderItemIndex in orders) {
                let currentOrder = orders[orderItemIndex]
                let currentOrderInfo = currentOrder.pop() //details are removed!
                let newCurrentOrderInfo = currentOrderInfo

                if(currentOrderInfo.paymentMethod === "payconiq_by_bancontact" && !(currentOrderInfo.paymentStatus === "SUCCEEDED")){
                    for(let paymentIndex in payments){
                        let currentPayment = payments[paymentIndex]
                        console.log('Comparing order: '+JSON.stringify(currentOrderInfo) +' with payment: '+JSON.stringify(currentPayment))
                        if(currentPayment.reference === currentOrderInfo.timestamp.toString()){
                            console.log('Updating staus of: '+ JSON.stringify(currentOrderInfo))
                            newCurrentOrderInfo.paymentStatus = currentPayment.status
                            break
                        }
                    }
                }
                currentOrder.push(newCurrentOrderInfo)
                addOrderToOrderList(currentOrder)
            }

            console.log('ready, now sending the updated orders')
            res.write(JSON.stringify(orders))
            res.end();
        })
    }
    if(req.url.includes("setPaymentReference")){
        req.on('data',function (data){
            let details = JSON.parse(data)
            console.log('Paymentreference details: '+data)
            //This line of code gets the element with name as the timestamp, then takes the last element of the array and adds paymentId equal to the received paymentReference
            let concernedOrder = orders[details.timestamp]
            let concernedOrderDetails = concernedOrder.pop()
            concernedOrderDetails.paymentId = details.paymentReference
            concernedOrder.push(concernedOrderDetails)
            addOrderToOrderList(concernedOrder)
        })
    }
    if(req.url.includes("orderFinished")){
        let orderTimestamp = req.url.replace('/orderFinished/','')
        let order =orders[orderTimestamp]
        let orderDetails = order.pop()
        let newOrderDetails = orderDetails
        newOrderDetails.finished = true
        order.push(newOrderDetails)
        addOrderToOrderList(order)
        res.end()
    }


})

server.listen(port, () => {
    console.log(`Server running at port ${port}`)
})

////////// FIREBASE SETUP ////////////
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
    let orderTimestamp = order[order.length-1].timestamp
    realtimeDatabase.ref("orders/" + orderTimestamp).set(order).then(r  => console.log('data successfully set'));
}

//// Payconiq by Bancontact credentials ////
const merchantId = '6086a1bd7e59ce00066de954'
const paymentProfileId ='6086a2077e59ce00066de955'
const APIkey = "5c20c8f4-cbd3-4f91-ae1a-9bfc081dfc84"