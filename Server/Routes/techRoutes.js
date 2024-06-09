const express = require("express");
const {postTechnician,getTechnicianByID,getTechnicianByEmail}=require("../Controllers/techController");

const router = express.Router();

router.post("/technician",postTechnician);
router.get("/technician/:_id",getTechnicianByID);
router.get("/technicianbyMail/:email",getTechnicianByEmail);
module.exports = router;
