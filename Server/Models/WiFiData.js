const mongoose = require('mongoose');

const wifiDataSchema = new mongoose.Schema({
    index: {
       type: String, required: true 
      },
    item: {
      BSSID: { 
        type: String, required: true
       },
      SSID: { 
        type: String, required: true 
      },
      capabilities: {
         type: String 
        },
      frequency: { 
        type: Number
       },
      level: { 
        type: Number 
      },
      timestamp: {
         type: Number 
        },
      password:{
        type: String
      }
    },
});
const WifiData = mongoose.model('WifiData', wifiDataSchema);
module.exports = WifiData;
