const Customer = require("../Models/Customer");
const Bookingss = require("../Models/BookingRa");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const StatusCodes = require("../Constants/statusCode");

dotenv.config();

const createBookingss = async (req, res) => {
  try {
    const { encryptedData } = req.body;
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.CRYPTO_KEY
    ).toString(CryptoJS.enc.Utf8);
    const {
      technician,
      product,
      description,
      startTime,
      endTime,
      dateOfBooking,
      customerEmail,
    } = JSON.parse(decryptedData);
    // Finding the customer details with respect to the email entered
    const customer = await Customer.findOne({ email: customerEmail });
    if (!customer) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Customer Does Not Exist!" });
    }
    const booking = new Bookingss({
      technician,
      product,
      description,
      startTime,
      endTime,
      dateOfBooking,
      customer: customer._id,
    });
    // Save the booking to the database
    await booking.save();

    res.status(StatusCodes.SUCCESS).json({ message: "Booking created successfully" });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const bookingssByyEmail = async (req, res) => {
    try {
        const { email } = req.body;
    
        const customer = await Customer.findOne({ email });
        if (!customer) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Customer Does Not Exist!" });
        }
    
        const bookings = await Bookingss.find({ customer: customer._id });
        const encryptedBookings = CryptoJS.AES.encrypt(
          JSON.stringify(bookings),
          process.env.CRYPTO_KEY
        ).toString();
        res.status(StatusCodes.SUCCESS).json({ encryptedBookings });
      } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
      }
    };

    const deleteBookingss = async (req, res) => {
      try {
        const _id = req.params._id;
        const booking = await Bookingss.deleteOne({_id: _id });
        if (booking.deletedCount > 0) {
          return res.status(StatusCodes.SUCCESS).json({ message: "Booking deleted successfully" });
        } else {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Booking not found" });
        }
      } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
      }
    };
module.exports = {createBookingss, bookingssByyEmail,deleteBookingss};

