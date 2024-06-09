const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    dateOfBooking: {
        type: Date,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;

