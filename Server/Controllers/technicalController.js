const Technical = require("../Models/Technical");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const StatusCodes = require("../Constants/statusCode");

dotenv.config();

const registerTech = async (req, res) => {
  try {
    const { encryptedData } = req.body;
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.CRYPTO_KEY
    ).toString(CryptoJS.enc.Utf8);

    const { name, email, password, mobileNumber, specialty } = JSON.parse(decryptedData);

    // Check if any technician already exists with the entered email
    const existingTech = await Technical.findOne({ email });
    if (existingTech) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create a new technician instance
    const newTech = new Technical({
      name,
      email,
      password: hashPassword,
      specialty,
      mobileNumber,
    });

    await newTech.save();

    return res.status(StatusCodes.SUCCESS).json({ res: "Technician successfully signed up" });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.SERVER_ERROR).json({ error: "Error inserting technician" });
  }
};

const loginTech = async (req, res) => {
  try {
    const { encryptedData } = req.body;
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    const { email, password } = JSON.parse(decryptedData);

    const technical = await Technical.findOne({ email });
    if (!technical) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Technician Does Not Exist!" });
    }

    const isMatch = await bcrypt.compare(password, technical.password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Credentials" });
    }

    const accessToken = jwt.sign({ id: technical._id }, process.env.JWT_SECRET, { expiresIn: "25m" });
    const refreshToken = jwt.sign({ id: technical._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "45m" });

    delete technical.password;
    //Encrypting the technician details
    const cipherTechObj = CryptoJS.AES.encrypt(JSON.stringify(technical), process.env.CRYPTO_KEY).toString();
    res.status(StatusCodes.SUCCESS).json({ accessToken, refreshToken, technical:cipherTechObj });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

module.exports = { registerTech, loginTech };