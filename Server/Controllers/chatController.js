const Chat = require("../Models/Chat");
const dotenv = require("dotenv");
const StatusCodes = require("../Constants/statusCode");
const CryptoJS = require("crypto-js");

dotenv.config();
const registerChat = async (req, res) => {
  try {
    const chats = req.body.messages;
    const decryptedChats = CryptoJS.AES.decrypt(chats, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    const chatsToSaved = JSON.parse(decryptedChats)
    await Chat.create(chatsToSaved);
    res.status(StatusCodes.SUCCESS).send({ message: "Chats Saved Successfully !!!" })
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.SERVER_ERROR).json({ message: "Internal Server Error !!!" });
  }
}
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ _id: 1 });
    if (chats.length == 0) {
      res.status(StatusCodes.SUCCESS).send({ message: "No Chats Saved !!!" })
    } else {
      const cipherChats = CryptoJS.AES.encrypt(JSON.stringify({ chats }), process.env.CRYPTO_KEY).toString();
      res.status(StatusCodes.SUCCESS).send(cipherChats);
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.SERVER_ERROR).json({ message: "Internal Server Error !!!" });
  }
}
module.exports = { registerChat, getAllChats }