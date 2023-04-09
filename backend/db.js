const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const mongoURI = process.env.MONGODB_CONNECTION_STRING;
module.exports = function (callback) {
	mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
		// mongoDbClient.connect(mongoURI, { useNewUrlParser: true }, async(err, result) => {
		if (err) console.log("---" + err);
		else {
			// var database =
			console.log("Connected to MongoDB!");
			const foodCollection = await mongoose.connection.db.collection(
				"food_items"
			);
			foodCollection.find({}).toArray(async function (err, data) {
				const categoryCollection = await mongoose.connection.db.collection(
					"Categories"
				);
				categoryCollection.find({}).toArray(async function (err, Catdata) {
					callback(err, data, Catdata);
				});
			});
			// listCollections({name: 'food_items'}).toArray(function (err, database) {
			// });
			//     module.exports.Collection = database;
			// });
		}
	});
};
