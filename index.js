var express = require('express');
var React = require('react');
const fs = require('fs');
//mongod --dbpath="G:\Frank\data\db"
var app = express()
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'webappbb'
let db

function generateCollectionList(collInfos) {
    listOfCollections = "";
    for (let step = 0; step < collInfos.length; step++) {
        temp = "<li class=fancy-box><a class=fancy-heading href=\"http://localhost:8081/record?name=todo\">todo</a></li> ";
        temp = temp.split("todo").join(collInfos[step].name);
        listOfCollections += temp;
    }
    return listOfCollections;
}

app.get('/', function(req, res) {
    fs.readFile('G:/Frank/Website Project/templates/home.html', 'utf8', function(err, data){
        if (err) {
            return console.log(err);
        } else {
            res.send(data);
        }
    })
})

app.get('/collections', function(req, res) {
    fs.readFile('G:/Frank/Website Project/templates/collections.html', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        } else {
            MongoClient.connect(url, {useNewUrlParser: true}, (error, client) => {
                if (error) {
                    return console.log(error);
                } else {
                    db = client.db(dbName);
                    db.listCollections().toArray(function(error2, collInfos) {
                        res.send(data.replace("<todo></todo>", generateCollectionList(collInfos)));
                    });
                }
            });
        }
    })
})

app.get('/record', function(req, res){
    nameOfCollection = req.query.name;
    fs.readFile('G:/Frank/Website Project/templates/record.html', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        } else {
            
        }
    })
})

var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

console.log('Server has started');

// function onRequest(request, response) {
// 	MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
//     if (err) {
//         return console.log(err)
//     } else {
//         db = client.db(dbName)
//         console.log('Connected MongoDB: ' + url)
//         console.log('Database: ' + dbName)
//         response.writeHead(200);
//     //response.write('<html><head></head><body>' + list + '</body>');
//     response.write(ReactDOMServer.renderToString(<Hello />))
// 		response.end();
//     }
// })
// }