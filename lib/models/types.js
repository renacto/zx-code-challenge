const graphql = require('graphql');
const graphqlgeojson = require('graphql-geojson');

const types = {
	
	graphql: graphql,
	graphqlgeojson: graphqlgeojson,

	GeoObjectInput: new graphql.GraphQLInputObjectType({
		name: 'GeoObjectInput',
		fields: {
			type: { type: new graphql.GraphQLNonNull(graphqlgeojson.TypeEnum) },
			coordinates: { type: graphqlgeojson.CoordinatesScalar }
		},
	}),

	PdvInputType: new graphql.GraphQLInputObjectType({
	  name: 'PdvInput',
	  fields: () => ({
		tradingName: { type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
		ownerName: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
		document: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
		coverageArea: { type: new graphql.GraphQLNonNull(types.GeoObjectInput) },
		address: { type: new graphql.GraphQLNonNull(types.GeoObjectInput) }
	  })
	}),


	PdvType: new graphql.GraphQLObjectType({
		name: 'pdv',
		fields: () => ({
			id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
			tradingName: { type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
			ownerName: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
			document: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
			coverageArea: { type: new graphql.GraphQLNonNull(graphqlgeojson.PolygonObject) },
			address: { type: new graphql.GraphQLNonNull(graphqlgeojson.PointObject) }
		})
	})
}

module.exports = types