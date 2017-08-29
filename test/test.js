let expect = require("chai").expect;
let request = require("request");
let url = "http://localhost:3000/graphql"
let getById = "?query={ pdv(id: $1) { id tradingName ownerName address { coordinates } coverageArea { coordinates } } }"
let getNearest = "?query={ nearest(coordinates: $1) { id tradingName ownerName address { coordinates } coverageArea { coordinates } } }"
let createPdv = "?query=mutation { pdv(pdv: {tradingName: \"nome de troca 2\", ownerName: \"nome do dono 2\", document: $1, coverageArea: {type: MultiPolygon, coordinates: \"[[[[-43.36556,-22.99669],[-43.36539,-23.01928],[-43.26583,-23.01802],[-43.25724,-23.00649],[-43.23355,-23.00127],[-43.2381,-22.99716],[-43.23866,-22.99649],[-43.24063,-22.99756],[-43.24634,-22.99736],[-43.24677,-22.99606],[-43.24067,-22.99381],[-43.24886,-22.99121],[-43.25617,-22.99456],[-43.25625,-22.99203],[-43.25346,-22.99065],[-43.29599,-22.98283],[-43.3262,-22.96481],[-43.33427,-22.96402],[-43.33616,-22.96829],[-43.342,-22.98157],[-43.34817,-22.97967],[-43.35142,-22.98062],[-43.3573,-22.98084],[-43.36522,-22.98032],[-43.36696,-22.98422],[-43.36717,-22.98855],[-43.36636,-22.99351],[-43.36556,-22.99669]]]]\"}, address: {type: Point, coordinates: \"[-43.297335,-23.013539]\"}}) { id tradingName document ownerName address { coordinates } coverageArea { coordinates } } }"

describe("Codechallenge test suite", function() {
  describe("GetById tests", function() {
    it("non existant id", function(done) {
    	nonExistantId = getById.replace("$1", 999)
		request(url + nonExistantId, function(error, response, body) {
			let result = JSON.parse(body);
			expect(result.data.pdv).to.equal(null);
			expect(response.statusCode).to.equal(200);
			done();
      });	  
	});
    it("existing id", function(done) {
    	existingId = getById.replace("$1", 1)
		request(url + existingId, function(error, response, body) {
			let result = JSON.parse(body);
			expect(result.data.pdv).to.not.equal(null);
			expect(response.statusCode).to.equal(200);
			done();
      	});	  
    });
    it("invalid id type", function(done) {
    	invalidIdType = getById.replace("$1", "a")
		request(url + invalidIdType, function(error, response, body) {
			let result = JSON.parse(body);
			expect(Object.keys(result)[0]).to.equal("errors");
			expect(response.statusCode).to.equal(400);
			done();
      	});	  
    });
  });
  describe("GetNearest tests", function() {
  	it("valid coordinates", function(done) {
    	validCoordinates = getNearest.replace("$1", '\"[-44.009649,-19.948064]\"')
		request(url + validCoordinates, function(error, response, body) {
			let result = JSON.parse(body);
			expect(result.data.nearest).to.not.equal(null);
			expect(response.statusCode).to.equal(200);
			done();
      	});	  
    });
    it("invalid coordinates", function(done) {
    	invalidCoordinates = getNearest.replace("$1", '\"[-1000,400]\"')
		request(url + invalidCoordinates, function(error, response, body) {
			let result = JSON.parse(body);
			expect(Object.keys(result)[0]).to.equal("errors");
			expect(result.data.nearest).to.equal(null);
			expect(response.statusCode).to.equal(200);
			done();
      	});	  
    });
    it("invalid coordinates type", function(done) {
    	invalidCoordinatesType = getNearest.replace("$1", '\"abc\"')
		request(url + invalidCoordinates, function(error, response, body) {
			let result = JSON.parse(body);
			expect(Object.keys(result)[0]).to.equal("errors");
			expect(result.data.nearest).to.equal(null);
			expect(response.statusCode).to.equal(200);
			done();
      	});	  
    });
  });
  describe("CreatePdv tests", function() {
    it("invalid document format", function(done) {
    	invalidDocumentFormat = createPdv.replace("$1", '\"00\"')
		request.post({url: url + invalidDocumentFormat, form: invalidDocumentFormat}, function(error, response, body) {
			let result = JSON.parse(body);
			expect(Object.keys(result)[0]).to.equal("errors");
			expect(result.data.pdv).to.equal(null);
			expect(response.statusCode).to.equal(200);
			done();
      });	  
	});
	it("missing document", function(done) {
    	missingDocument = createPdv.replace("$1", '')
		request.post({url: url + missingDocument, form: missingDocument}, function(error, response, body) {
			let result = JSON.parse(body);
			expect(Object.keys(result)[0]).to.equal("errors");
			expect(response.statusCode).to.equal(400);
			done();
      });	  
	});	
	it("existing document", function(done) {
    	existingDocument = createPdv.replace("$1", '\"02.453.716/000170\"')
		request.post({url: url + existingDocument, form: existingDocument}, function(error, response, body) {
			let result = JSON.parse(body);
			expect(Object.keys(result)[0]).to.equal("errors");
			expect(result.data.pdv).to.equal(null);
			expect(response.statusCode).to.equal(200);
			done();
      });	  
	});	
  });
});