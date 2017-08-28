const MongoClient = require('mongodb').MongoClient;
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./app.ini');

let connection = null;

let url = properties.get('db.mongo.url');

module.exports.connect = () => new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
        if (err) { reject(err); return; };
        resolve(db);
        connection = db;
    });
});

module.exports.get = () => {
    if(!connection) {
        throw new Error('Call connect first!');
    }

    return connection;
};