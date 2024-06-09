const express = require("express");
const {registerTech, loginTech}=require("../Controllers/technicalController");

const router = express.Router();

router.post("/auth/registerTech",registerTech);
router.post("/auth/loginTech",loginTech);

module.exports=router;