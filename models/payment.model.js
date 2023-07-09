const mongoose = require('mongoose')
const paymentSchema =  mongoose.Schema({
    paymentType:String //TODO should be created
});

const Payment = mongoose.model("Payment",paymentSchema);
module.exports = Payment;