global.foodData = require("./db")(function call(err, data, CatData) {
	// console.log(data)
	if (err) console.log(err);
	global.foodData = data;
	global.foodCategory = CatData;
});

const express = require("express");
const connectDB = require("./db");
const app = express();
const port = 5000;

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept",
	);
	next();
});
app.use(express.json());

app.use("/api", require("./api"));

connectDB((err) => {
	if (err) {
		console.error(err);
	} else {
		console.log("Connected to database successfully");

		if (process.env.NODE_ENV !== "production") {
			app.listen(port, () => {
				console.log("listening for requests on port", port);
			});
		}
	}
});

module.exports = app;
