const WifiData = require("../Models/WiFiData");
const StatusCodes = require("../Constants/statusCode");

//insert new WifiData
const createWifi = async(req,res)=>{
    try {
        const { index, item } = req.body;
        //creating new WifiData instance
        const wifi = new WifiData({
          index,
          item: {
            BSSID: item.BSSID,
            SSID: item.SSID,
            capabilities: item.capabilities,
            frequency: item.frequency,
            level: item.level,
            timestamp: item.timestamp,
            password: item.password,
          },
        });
        //saving the data
        await wifi.save();
        res
          .status(StatusCodes.INSERTED)
          .json({ message: "WiFi network created successfully" });
        //catching the error
      } catch (error) {
        res
          .status(StatusCodes.SERVER_ERROR)
          .json({ error: "Internal server error" });
      }
    }

const getAllWifi = async(req,res)=>{
    try {
        //using find method to get all the wifi data
        const wifi = await WifiData.find();
        return res.status(StatusCodes.SUCCESS).json(wifi);
        } catch (error) {
         console.error(error);
         return res.status(StatusCodes.SERVER_ERROR).json({ error: "Error retrieving wifi data" });
          }
        } 
const getByBSSID = async(req,res)=>{
    try {
        const bssid = req.params.bssid;
        //passing BSSID as path parameter
        const wifi = await WifiData.findOne({ "item.BSSID": bssid });
        if (wifi) {
          res.status(StatusCodes.SUCCESS).json(wifi);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "WiFi network not found" });
        }
      } catch (error) {
        res
          .status(StatusCodes.SERVER_ERROR)
          .json({ error: "Internal server error" });
      }
    }
const deleteAllWifi = async(req,res)=>{
  //deleting all the wifi data
  WifiData.deleteMany({})
    .then(() => {
      res
        .status(StatusCodes.SUCCESS)
        .json({ message: "All Wi-Fi data deleted successfully" });
    })
    .catch((error) => {
      res
        .status(StatusCodes.SERVER_ERROR)
        .json({ error: "Failed to delete Wi-Fi data" });
    });
}

module.exports = {createWifi, getAllWifi, getByBSSID, deleteAllWifi};
