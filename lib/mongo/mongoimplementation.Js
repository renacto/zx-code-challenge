const mongodbmodule = require('./mongodbmodule.js')



module.exports.getById = (args) => {
	let name = "id"
	let value = args.id;
	let query = {};
	query[name] = value;
	return mongodbmodule.get().collection('pdvs').findOne(query);
};

module.exports.getNearest = (args) => {
	let parameter = JSON.parse(args.coordinates)
	let aggregation = mongodbmodule.get().collection('pdvs').aggregate([{
	 $geoNear: {
		near: { type: "Point", coordinates: parameter},
		distanceField: "dist",
		num: 1,
		query: { 
			"coverageArea": {
			   $geoIntersects: {
				  $geometry: {
					"type":"Point",
					"coordinates":
						parameter									
				  }
			   }
			}
		},
		spherical: true
	 }
   }]);
   return aggregation.next();
}

module.exports.createPdv = (args) => {											
	return mongodbmodule.get().collection('pdvs').find({document: args.pdv.document}).next().then(function(val){
		if (val == null) {
			return mongodbmodule.get().collection('counters').findAndModify(
				{_id: "pdvid" },
				[],
				{ $inc: { seq: 1 } },
				{ new: true } 
			).then(function(val){
				args.pdv.id = val.value.seq;
				args.pdv.address.coordinates = JSON.parse(args.pdv.address.coordinates);
				args.pdv.coverageArea.coordinates = JSON.parse(args.pdv.coverageArea.coordinates);
				return mongodbmodule.get().collection('pdvs').insertOne(args.pdv).then(function(val){
					return args.pdv;
				});
		})
		} else {
			throw new Error('"document" already exists.');
		}
	});
}