const express = require("express");
 const {registerUser,authUser}=require("../Controllers/customerController.js");

 const router = express.Router();

 router.post("/auth/register",registerUser);
 router.post("/auth/login",authUser);
 
 module.exports = router;