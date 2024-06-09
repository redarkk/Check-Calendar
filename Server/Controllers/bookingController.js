const Customer = require("../Models/Customer");
const Booking = require("../Models/Booking.js");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const StatusCodes = require("../Constants/statusCode");

dotenv.config();
//create the booking data for storing in database
const createBooking = async (req, res) => {
  try {
    //get the encrypted data
    const { encryptedData } = req.body;
    //decrypt the data
    const decryptedData = CryptoJS.AES.decrypt(encryptedData,process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    //parsing the data to json
    const {product, description, startTime, endTime, dateOfBooking, customerEmail}= JSON.parse(decryptedData);
    //finding the details of the customer
    const customer = await Customer.findOne({ email: customerEmail });
    if (!customer) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Customer Does Not Exist!" });
    }
    //creating new booking instance
    const booking = new Booking({product, description, startTime, endTime, dateOfBooking, customer: customer._id});
    //saving the new booking instance to the database
    await booking.save();
    res.status(StatusCodes.SUCCESS).json({ message: "Booking created successfully" });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const bookingsByEmail = async (req, res) => {
  try {
      const { encryptedEmail } = req.body;
      const decryptedEmail = CryptoJS.AES.decrypt(
        encryptedEmail,
        process.env.CRYPTO_KEY
      ).toString(CryptoJS.enc.Utf8);
  
      const customer = await Customer.findOne({ email: decryptedEmail });
      if (!customer) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Customer Does Not Exist!" });
      }
  
      const bookings = await Booking.find({ customer: customer._id });
      const encryptedBookings = CryptoJS.AES.encrypt(JSON.stringify(bookings),process.env.CRYPTO_KEY).toString();
      res.status(StatusCodes.SUCCESS).json({ encryptedBookings });
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  };


const deleteBooking = async (req, res) => {
  try {
    const { encryptedId } = req.body;
    const decryptedId = CryptoJS.AES.decrypt(
      encryptedId,
      process.env.CRYPTO_KEY
    ).toString(CryptoJS.enc.Utf8);

    const booking = await Booking.deleteOne({ _id: decryptedId });
    if (booking.deletedCount > 0) {
      return res
        .status(StatusCodes.SUCCESS)
        .json({ message: "Booking deleted successfully" });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Booking not found" });
    }
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const patchBooking = async (req, res) => {
  try {
    const { encryptedData } = req.body;
    // Decrypt the encrypted data
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    // Parse the decrypted data as JSON
    const decryptedBookingData = JSON.parse(decryptedData);
    // Retrieve the individual properties from the decrypted data
    const { product, description, startTime, endTime, dateOfBooking, id } = decryptedBookingData;
    // Find the booking by ID and update its properties
    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        product,
        description,
        startTime,
        endTime,
        dateOfBooking,
      },
      { new: true }
    );
    if (!booking) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Booking not found" });
    }
    res.status(StatusCodes.SUCCESS).json({ message: "Booking updated successfully" });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};
module.exports = {createBooking, bookingsByEmail, deleteBooking, patchBooking};
