const mongoose = require('mongoose')

const TechSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
    },
    mobileNumber:{
        type: String,
        required : true,
        unique:true
    },
    email:{
        type:String,
        required : true,
        unique: true
    },
    specialty:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true
    }
});

const Technical= mongoose.model("Technical",TechSchema);

module.exports = Technical;