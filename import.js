const MongoClient = require('mongodb').MongoClient;
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./app.ini');
const fs = require('fs');
const JSONStream = require('JSONStream');
const test = require('assert');

var url = properties.get('db.mongo.url');

MongoClient.connect(url, function(err, db) {

	var stream = fs.createReadStream('./pdvs.json', {flags: 'r', encoding: 'utf-8'});
	var parser = JSONStream.parse();

	stream.pipe(parser);

	parser.on('data', function (obj) {

		obj.pdvs.forEach(function(elem){
			elem.id = +elem.id
			elem.address = JSON.parse(elem.address);			
			elem.coverageArea = JSON.parse(elem.coverageArea);			
		});

		var col = db.collection('pdvs');

		col.createIndex({"address": "2dsphere"});
		col.insertMany(obj.pdvs, function(err, r) {
   	 		test.equal(null, err);
    		test.equal(obj.pdvs.length, r.insertedCount);			
	    	console.log("Collection criada com sucesso!");

			var counters = db.collection('counters');
			var maxPdv = db.collection('pdvs').find().sort({id:-1}).limit(1);
			maxPdv.next().then(function(val){
				counters.insert(
			 	    {
			      		_id: "pdvid",
			      		seq: (val.id+1)
			   		}
				).then(function(val){
					console.log('Sequence criada com sucesso!')
					db.close();		
				})
			})
  		});
	});
});



