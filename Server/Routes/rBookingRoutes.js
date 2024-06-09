const express = require("express");
const verifyToken = require("../Middleware/auth")
const {createBookingss, bookingssByyEmail,deleteBookingss}=require("../Controllers/rBookingController");

const router = express.Router();

router.post("/bookingss",createBookingss)
router.post("/bookingssByyEmail",bookingssByyEmail)
router.delete("/dltBookingss/:_id",deleteBookingss)


module.exports = router;
