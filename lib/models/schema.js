const mongoimplementation = require('./../mongo/mongoimplementation.js');
const types = require('./types.js');

let cnpjregex = "[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}";

let schema = new types.graphql.GraphQLSchema({
	query: new types.graphql.GraphQLObjectType({
    	name: 'query',
    	fields: {
			pdv: {
				type: types.PdvType,
				args: {
				  id:{
				    type: types.graphql.GraphQLInt
				  }
				},
				resolve: function (_ , args) {
					return mongoimplementation.getById(args);
				}
			},
			nearest: {
				type: types.PdvType,
				args: {
				  coordinates:{
				    type: types.graphqlgeojson.CoordinatesScalar
				  }
				},
				resolve: function (_ , args) {
					return mongoimplementation.getNearest(args);
				}
			}
		}
	}),
	mutation: new types.graphql.GraphQLObjectType({
	    	name: 'createPdv',
	    	fields: {
				pdv: {
					type: types.PdvType,
					args: {
					  pdv:{
					    type: types.PdvInputType
					  }
					},
					resolve: function (_ , args) {
						if (args.pdv.document.match(cnpjregex)) {	
							return mongoimplementation.createPdv(args);
						}  else {
							throw new Error('"document" must follow the 00.000.000/00000 format.');
						}
					}
				}
			}
	})
})

module.exports = schema