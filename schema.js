const mongoimplementation = require('./mongoimplementation.js');
const model = require('./model.js');

let cnpjregex = "[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}";

let schema = new model.graphql.GraphQLSchema({
	query: new model.graphql.GraphQLObjectType({
    	name: 'query',
    	fields: {
			pdv: {
				type: model.PdvType,
				args: {
				  id:{
				    type: model.graphql.GraphQLInt
				  }
				},
				resolve: function (_ , args) {
					return mongoimplementation.getById(args);
				}
			},
			nearest: {
				type: model.PdvType,
				args: {
				  coordinates:{
				    type: model.graphqlgeojson.CoordinatesScalar
				  }
				},
				resolve: function (_ , args) {
					return mongoimplementation.getNearest(args);
				}
			}
		}
	}),
	mutation: new model.graphql.GraphQLObjectType({
	    	name: 'createPdv',
	    	fields: {
				pdv: {
					type: model.PdvType,
					args: {
					  pdv:{
					    type: model.PdvInputType
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