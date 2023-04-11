const express = require("express");
const User = require("../models/User");
const Order = require("../models/Orders");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const axios = require("axios");
const fetch = require("../middleware/fetchdetails");
const Razorpay = require("razorpay");
require("dotenv").config({ path: "../.env" });

const jwtSecret = process.env.JWT_SECRET;

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
			await User.create({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				password: securePass,
				email: req.body.email,
				location: req.body.location,
			})
				.then((user) => {
					const data = {
						user: {
							id: user.id,
						},
					};
					const authToken = jwt.sign(data, jwtSecret);
					success = true;
					res.json({ success, authToken });
				})
				.catch((err) => {
					console.log(err);
					res.json({ error: "Please enter a unique value." });
				});
		} catch (error) {
			console.error(error.message);
		}
	}
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
					.json({ success, error: "Try Logging in with correct the email" });
			}

			const pwdCompare = await bcrypt.compare(password, user.password);
			if (!pwdCompare) {
				return res
					.status(400)
					.json({ success, error: "Try Logging in with correct the password" });
			}
			const data = {
				user: {
					id: user.id,
				},
			};
			success = true;
			const authToken = jwt.sign(data, jwtSecret);
			res.json({ success, authToken });
		} catch (error) {
			console.error(error.message);
			res.send("Server Error");
		}
	}
);

router.post("/getuser", fetch, async (req, res) => {
	try {
		const userId = req.user.id;
		const user = await User.findById(userId).select("-password");
		res.send(user);
	} catch (error) {
		console.error(error.message);
		res.send("Server Error");
	}
});

router.post("/getlocation", async (req, res) => {
	try {
		let lat = req.body.latlong.lat;
		let long = req.body.latlong.long;
		console.log(lat, long);
		let location = await axios
			.get(
				"https://api.opencagedata.com/geocode/v1/json?q=" +
					lat +
					"+" +
					long +
					"&key=74c89b3be64946ac96d777d08b878d43"
			)
			.then(async (res) => {
				console.log(res.data.results);
				let response = res.data.results[0].components;
				console.log(response);
				let { village, county, state_district, state, postcode } = response;
				return String(
					village +
						"," +
						county +
						"," +
						state_district +
						"," +
						state +
						"\n" +
						postcode
				);
			})
			.catch((error) => {
				console.error(error);
			});
		res.send({ location });
	} catch (error) {
		console.error(error.message);
		res.send("Server Error");
	}
});
router.post("/foodData", async (req, res) => {
	try {
		res.send([global.foodData, global.foodCategory]);
	} catch (error) {
		console.error(error.message);
		res.send("Server Error");
	}
});

router.post("/orders", async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID, // YOUR RAZORPAY KEY
			key_secret: process.env.RAZORPAY_SECRET, // YOUR RAZORPAY SECRET
		});

		const options = {
			amount: 50000,
			currency: "INR",
			receipt: "receipt_order_74394",
		};

		const order = await instance.orders.create(options);

		if (!order) return res.status(500).send("Some error occured");

		res.json(order);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.post("/orderData", async (req, res) => {
	const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
	let data = req.body.order_data;
	await data.splice(0, 0, {
		Order_date: req.body.order_date,
		Order_time: req.body.order_time,
		razorpayDetails: {
			orderId: razorpayOrderId,
			paymentId: razorpayPaymentId,
			signature: razorpaySignature,
		},
	});
	console.log(req.body.email);
	let eId = await Order.findOne({ email: req.body.email });
	console.log(eId);
	if (eId === null) {
		try {
			console.log(data);
			console.log("1231242343242354", req.body.email);
			await Order.create({
				email: req.body.email,
				order_data: [data],
			}).then(() => {
				res.json({
					success: true,
				});
			});
		} catch (error) {
			console.log(error.message);
			res.send("Server Error", error.message);
		}
	} else {
		try {
			await Order.findOneAndUpdate(
				{ email: req.body.email },
				{ $push: { order_data: data } }
			).then(() => {
				res.json({ success: true });
			});
		} catch (error) {
			console.log(error.message);
			res.send("Server Error", error.message);
		}
	}
});

router.post("/myOrderData", async (req, res) => {
	try {
		console.log(req.body.email);
		let eId = await Order.findOne({ email: req.body.email });
		res.json({ orderData: eId });
	} catch (error) {
		res.send("Error", error.message);
	}
});

module.exports = router;
