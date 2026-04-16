const express = require("express");
const User = require("./models/user");
const Order = require("./models/orders");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const fetch = require("./middleware/fetchdetails");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const ensureDbConnected = async () => {
	if (mongoose.connection.readyState !== 1) {
		await mongoose.connect(process.env.MONGODB_URI);
	}
};

router.post(
	"/createuser",
	[
		body("firstName").isLength({ min: 2 }),
		body("lastName").isLength({ min: 2 }),
		body("email").isEmail(),
		body("password").isLength({ min: 5 }),
	],
	async (req, res) => {
		let success = false;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ success, errors: errors.array() });
		}

		const salt = await bcrypt.genSalt(10);
		let securePass = await bcrypt.hash(req.body.password, salt);
		try {
			const user = await User.create({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				password: securePass,
				email: req.body.email,
				location: req.body.location,
			});

			const data = { user: { id: user.id } };
			const authToken = jwt.sign(data, jwtSecret);
			success = true;
			res.json({ success, authToken });
		} catch (error) {
			console.error(error.message);
			res.status(500).json({
				success: false,
				error: "Please enter a unique value.",
			});
		}
	},
);

router.post(
	"/login",
	[
		body("email", "Enter a Valid Email").isEmail(),
		body("password", "Password cannot be blank").exists(),
	],
	async (req, res) => {
		let success = false;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ success, error: "Invalid Credentials" });
			}

			const pwdCompare = await bcrypt.compare(password, user.password);
			if (!pwdCompare) {
				return res
					.status(400)
					.json({ success, error: "Invalid Credentials" });
			}

			const data = { user: { id: user.id } };
			success = true;
			const authToken = jwt.sign(data, jwtSecret);
			res.json({ success, authToken });
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server Error");
		}
	},
);

router.post("/getuser", fetch, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.send(user);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

router.post("/getlocation", async (req, res) => {
	try {
		let { lat, long } = req.body.latlong;
		const geoRes = await axios.get(
			`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`,
		);
		let response = geoRes.data.results[0].components;
		let { village, county, state_district, state, postcode } = response;
		let location = `${village || ""}, ${county || ""}, ${
			state_district || ""
		}, ${state || ""}\n${postcode || ""}`;
		res.send({ location });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

router.post("/foodData", async (req, res) => {
	try {
		await ensureDbConnected();

		const foodItemsCollection =
			mongoose.connection.db.collection("food_items");
		const foodItems = await foodItemsCollection.find({}).toArray();

		const foodCategoryCollection =
			mongoose.connection.db.collection("foodCategory");
		const foodCategory = await foodCategoryCollection.find({}).toArray();

		res.status(200).send([foodItems, foodCategory]);
	} catch (error) {
		console.error("Error fetching food data:", error.message);
		res.status(500).send("Server Error");
	}
});

router.post("/orders", async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_SECRET,
		});

		const options = {
			amount: 50000,
			currency: "INR",
			receipt: `receipt_${Date.now()}`,
		};

		const order = await instance.orders.create(options);
		res.json(order);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post("/orderData", async (req, res) => {
	const {
		razorpayPaymentId,
		razorpayOrderId,
		razorpaySignature,
		order_data,
		email,
		order_date,
		order_time,
	} = req.body;

	let data = [...order_data];
	data.splice(0, 0, {
		Order_date: order_date,
		Order_time: order_time,
		razorpayDetails: {
			orderId: razorpayOrderId,
			paymentId: razorpayPaymentId,
			signature: razorpaySignature,
		},
	});

	try {
		let eId = await Order.findOne({ email });
		if (eId === null) {
			await Order.create({ email, order_data: [data] });
		} else {
			await Order.findOneAndUpdate(
				{ email },
				{ $push: { order_data: data } },
			);
		}
		res.json({ success: true });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post("/myOrderData", async (req, res) => {
	try {
		let eId = await Order.findOne({ email: req.body.email });
		res.json({ orderData: eId });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

module.exports = router;
