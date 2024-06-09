const express = require("express");
const verifyToken = require("../Middleware/auth")
const {registerChat,getAllChats} = require("../Controllers/chatController")

const router = express.Router();
router.post("/registerChat",registerChat)
router.get("/allChats",getAllChats)

module.exports = router;