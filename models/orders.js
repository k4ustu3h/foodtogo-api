const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrderSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	order_data: {
		type: Array,
		required: true,
	},
	razorpayDetails: {
		orderId: String,
		paymentId: String,
		signature: String,
	},
});

module.exports = mongoose.model("orders", OrderSchema);
