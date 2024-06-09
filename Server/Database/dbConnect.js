const mongoose = require("mongoose");
const express=require("express")
const app=express()
app.use(express.json());
//create connection with mongodb
async function connectToDatabase() {
    try {
      await mongoose.connect(
        "mongodb+srv://mollymukherjee:molly123@cluster0.60adhaq.mongodb.net/",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log("Connected to mongodb");
    } catch (error) {
      console.error("Error connecting to mongodb", error);
      return;
    }
  }
  module.exports=connectToDatabase;