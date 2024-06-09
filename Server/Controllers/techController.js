const Technician = require("../Models/Technician");
const Customer = require("../Models/Customer")
const Booking = require("../Models/Booking")
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const StatusCodes = require("../Constants/statusCode");

dotenv.config();

const postTechnician = async(req,res)=>{
    try {
        const { name, email, specialty, customerEmail, bookingId } = req.body;
        // Finding the customer based on the email
        const customer = await Customer.findOne({ email: customerEmail });
        if (!customer) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Customer not found" });
        }
        // Finding the booking based on the ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Booking not found" });
        }
        // Create a new technician instance
        const technician = new Technician({
          name,
          email,
          specialty,
          customer: customer._id,
          booking: booking._id,
        });
        //saving the technician details to the database
        await technician.save();
        return res
          .status(StatusCodes.SUCCESS)
          .json({ message: "Technician created successfully" });
      } catch (error) {
        console.error(error);
        return res
          .status(StatusCodes.SERVER_ERROR)
          .json({ error: "Error creating technician" });
      }
    }
const getTechnicianByID = async(req,res)=>{
    try {
        //storing booking id we got as a path parameter
        const { _id } = req.params;
        //finding booking details with findById function
        const booking = await Booking.findById({ _id: _id });
        if (!booking) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Booking not found" });
        }
        //finding the technician based on the booking ID
        const technician = await Technician.findOne({ booking: booking._id });
        if (!technician) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Technician not found for the booking" });
        }
        res.status(StatusCodes.SUCCESS).json({ technician });
      } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
      }
    }
const getTechnicianByEmail = async(req,res)=>{
    try {
        const { email } = req.params;
        //fetch details of customer based on the email provided
        const customer = await Customer.findOne({ email });
        //finding technician details using the customer parameter
        const technician = await Technician.findOne({ customer: customer._id });
        //checking the availability of technician
        if (!technician) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Technician not found for the customer" });
        }
        res.status(StatusCodes.SUCCESS).json({ technician });
      } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
      }
    }
    
module.exports={postTechnician,getTechnicianByID,getTechnicianByEmail}