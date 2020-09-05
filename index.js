var express = require('express');
var React = require('react');
const fs = require('fs');
const bodyParser = require('body-parser');
//mongod --dbpath="G:\Frank\data\db"
var app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'webappbb';
let db;
app.use(bodyParser.urlencoded({extended: true}));

function generateCollectionList(collInfos) {
    let listOfCollections = "";
    for (let step = 0; step < collInfos.length; step++) {
        let temp = "<li class=fancy-box><a class=fancy-heading href=\"http://localhost:8081/record?name=todo\">todo</a></li> ";
        temp = temp.split("todo").join(collInfos[step].name);
        listOfCollections += temp;
    }
    return listOfCollections;
}

function generateStoryList(recordInfo, collectionName) {
	let listOfRecords = "<a class=fancy-heading href=\"http://localhost:8081/addrecord?coll=" + collectionName + "\">Add to Record</a> ";
	let id = "id=todo&";
	let coll = "coll=" + collectionName;
	for (let step = 0; step < recordInfo.length; step++) {
        let recordName = recordInfo[step].name;
        let recordID = recordInfo[step]._id.toString();
        listOfRecords += "<li class=fancy-box><a class=fancy-heading href=\"http://localhost:8081/story?" + id.replace("todo", recordID) + coll + "\">" + recordName + "</a></li> ";
	}
	return listOfRecords;
}

function generateStoryPage(body, storyName) {
    return "<h1>" + storyName + "</h1><br><p>" + body + "</p>";
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
    fs.readFile('G:/Frank/Website Project/templates/record.html', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        } else {
            MongoClient.connect(url, {useNewUrlParser: true}, (error, client) => {
            	if (error) {
            		return console.log(error);
            	} else {
            		db = client.db(dbName);
            		db.collection(req.query.name).find({}).toArray(function(error2, recordInfo){
            			if (error2) {
            				return console.log(error2)
            			} else {
            				res.send(data.replace("<todo></todo>", generateStoryList(recordInfo, req.query.name)));
            			}
            		})
            	}
            });
        }
    });
})

app.get('/addrecord', function(req, res) {
    console.log(req.query.coll);
    fs.readFile('G:/Frank/Website Project/templates/addtorecord.html', 'utf8', function(err, data) {
        if (err) {
            return console.log(err)
        } else {
            res.send(data.replace("todo", req.query.coll))
        }
    })
})

app.get('/save', function(req, res) {
    fs.readFile("G:/Frank/Website Project/templates/home.html", 'utf8', function(err, data){
        if (err) {
            return console.log(err);
        } else {
            body = {name: req.query.recordName, body: req.query.recordText};
            MongoClient.connect(url, {useNewUrlParser: true}, (error, client) => {
                if (error) {
                    return console.log(error);
                } else {
                    db = client.db(dbName);
                    db.collection(req.query.coll).insertOne(body, function(insErr, doc) {
                        if (insErr) {
                            console.log(insErr);
                        } else {
                            console.log("1 document inserted");
                            res.send(data);
                        }
                    })
                }
            });
        }
    });
})

app.get('/story', function(req, res){
    var id = req.query.id;
    var coll = req.query.coll;
    console.log(id);
    console.log(coll);
    fs.readFile("G:/Frank/Website Project/templates/record.html", 'utf8', function(err, data){
        if (err) {
            return console.log(err);
        } else {
            MongoClient.connect(url, {useNewUrlParser: true}, (error, client) => {
                if (error) {
                    console.log(error);
                } else {
                    db = client.db(dbName);
                    db.collection(coll).findOne({_id: ObjectID.createFromHexString(id)}, function(err2, result) {
                        if (err2) {
                            console.log(err2);
                        } else {
                            console.log(result);
                            res.send(data.replace("<todo></todo>", generateStoryPage(result.body, result.name)));
                        }
                    });
                }
            });
        }
    });
})

app.get('/about', function(req, res){

});

var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

console.log('Server has started');