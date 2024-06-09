const mongoose = require('mongoose');

const BookingRSchema = new mongoose.Schema({
    technician: {
        type: String,
        required: true,
    },
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

const Bookingss = mongoose.model('Bookingss', BookingRSchema);

module.exports = Bookingss;

