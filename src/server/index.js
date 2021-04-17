const http = require('http')
let path = require('path')

//const port = process.env.PORT //not working?
const port = process.env.PORT || 3000;

// use createReadStream instead to save memory
const fs = require('fs');
const index = fs.readFileSync('../client/index.html');
const java = fs.readFileSync('../client/js/index.js');
const layout = fs.readFileSync('../client/js/layout.js');
const style = fs.readFileSync('../client/css/style.css');
const faviconPng = fs.readFileSync(path.join(__dirname, 'favicon', 'favicon2.png'));

const server = http.createServer((req, res) => {
    console.log("New http request with url: " + req.url);
    res.statusCode = 200
    if (req.url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.write(index);
        res.end();
    }
    if (req.url === "/js/index.js") {
        res.setHeader("Content-Type", "text/javascript");
        res.write(java);
        res.end();
    }
    if (req.url === "/js/layout.js") {
        res.setHeader("Content-Type", "text/javascript");
        res.write(layout);
        res.end();
    }
    if (req.url === "/css/style.css") {
        res.setHeader("Content-Type", "text/css");
        res.write(style);
        res.end();
    }
    if (req.url === "/favicon.ico") {
        res.setHeader("Content-Type", "image/png");
        res.write(faviconPng);
        res.end();
    }
    if (req.url === "/test") {
        res.setHeader("Content-Type", "application/json");
        let data = {
            name: 'walti',
            score: 2
        }
        console.log(JSON.stringify(data));
        res.write(JSON.stringify(data));
        res.end();
    }
    if(req.url === "/newUser"){
        req.on('data', function (data){
            console.log('new user and dataJSONparese.name is:',JSON.parse(data).name);
            let newUsersName = JSON.parse(data).name;
            let newUser = addUserToDB(newUsersName);
            res.write(JSON.stringify(newUser));
            res.end();
        })
    }
    if( req.url === "/login"){
        req.on('data', function (data){
            let objectData = JSON.parse(data);
            let userName = objectData.name;
            let user = getUserFromDB(userName);
            res.write(JSON.stringify(user));
            res.end();
        })
    }
    if( req.url === "/addPoints"){
        req.on('data', function (data){
            let objectData = JSON.parse(data);
            let updatedUser = addPoints(objectData);
            res.write(JSON.stringify(updatedUser));
            res.end();
        })
    }
    if( req.url === "/highScore"){
        req.on('data', function (data){
            res.write(JSON.stringify(currentUsersInDB));
            res.end();
        })
    }
})

server.listen(port, () => {
    console.log(`Server running at port ${port}`)

})