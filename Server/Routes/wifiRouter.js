const express = require("express");
const {createWifi, getAllWifi, getByBSSID, deleteAllWifi}=require("../Controllers/wifiController");

const router = express.Router();

router.post("/WifiDataInsert",createWifi)
router.get("/WifiData",getAllWifi)
router.get("/WifiData/:bssid",getByBSSID)
router.delete("/DltAllWifiData",deleteAllWifi)

module.exports = router;
