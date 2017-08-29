# zx-code-challenge
Repository containing a resolution to the back-end challenge.

## Required tools
* [NodeJS](https://nodejs.org/en/download/)
* [MongoDB](https://www.mongodb.com/download-center)
## Installing
Run `npm install` to install all dependencies used in this exercise.

## Providing the service locally
1. Fill the `db.mongo.url` entry of  `etc/server.ini` file with the desired (be it local or cloud) MongoDB instance url to be used.
2. Browse to `lib/config` and run `node import.js` to load the file containing the pdvs into the database.
3. Browse back to the root project directory and run `node server.js` to start the app locally.
4. Browse `http://localhost:3000/graphql` to acess the GraphQL UI.

## Testing

While the app is running, run in the root project directory `npm test` to execute a test suite on the provided service.
