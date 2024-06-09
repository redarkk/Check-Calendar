const express = require("express");
const verifyToken = require("../Middleware/auth")
const {createBooking,bookingsByEmail,deleteBooking,patchBooking}=require("../Controllers/bookingController");

const router = express.Router();

router.post("/booking",verifyToken,createBooking);
router.post("/bookingsByEmail",verifyToken,bookingsByEmail);
router.delete("/Dltbooking",verifyToken,deleteBooking);
router.patch("/patchBooking",patchBooking)
module.exports = router;