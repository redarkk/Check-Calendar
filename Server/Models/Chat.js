const mongoose = require('mongoose');
const chatsSchema = new mongoose.Schema({
    name: String,
    message: String,
    specialtyOfPerson:String,
    fileUrl:String
})

const Chat = mongoose.model("Chat",chatsSchema);
module.exports = Chat;