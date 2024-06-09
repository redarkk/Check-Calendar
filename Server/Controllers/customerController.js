const Customer = require("../Models/Customer");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const StatusCodes = require("../Constants/statusCode");

dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { encryptedData } = req.body;
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    const { name, email, password, mobileNumber } = JSON.parse(decryptedData);
    // Check if customer already exists with the email entered
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Customer already exists with the provided email" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new customer
    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
    });
    // Save the customer to the database
    await newCustomer.save();
    res.status(StatusCodes.SUCCESS).json({ message: "Customer created successfully" });
  } catch (err) {
    res.status(StatusCodes.SERVER_ERROR).json({ message: err.message });
  }
};

const authUser = async (req, res) => {
  try {
    console.log("here");
    const { encryptedData } = req.body;
    // Decrypt the encrypted data
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    // Parse the decrypted data to retrieve email and password
    const { email, password } = JSON.parse(decryptedData);
    // Find the customer based on the entered email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User Does Not Exist!" });
    }
    // Compare the entered plain password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Credential" });
    }
    // Generate an access token for the customer
    const accessToken = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: "25m" });
    // Generate a refresh token for the customer
    const refreshToken = jwt.sign({ id: customer._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    // Remove the password field from the customer object
    delete customer.password;
    const cipherUserObj = CryptoJS.AES.encrypt(JSON.stringify(customer), process.env.CRYPTO_KEY).toString();
    res.status(StatusCodes.SUCCESS).json({ accessToken, refreshToken,customer:cipherUserObj });
  } catch (err) {
    console.log(err)
    res.status(StatusCodes.SERVER_ERROR).json({ message: err.message });
  }
};


module.exports = { registerUser, authUser };



