const express = require('express')
const graphqlHTTP = require('express-graphql')
const db = require('./mongodbmodule.js');
const pdv = require('./schema')

db.connect()
    .then(() => console.log('Database connected'))
    .then(() => bootApp())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });

function bootApp() {

	const app = express();
	app.use('/graphql', graphqlHTTP({
	  schema: pdv,
	  graphiql: true,
	  pretty: true
	}));

	app.listen(3000);
}
