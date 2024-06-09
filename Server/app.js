const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const apicache = require("apicache");
const connection = require("./Database/dbConnect");
const customerRoutes = require("./Routes/customerRoutes")
const bookingRoutes = require("./Routes/bookingRoutes")
const wifiRoutes = require("./Routes/wifiRouter")
const technicalRoutes = require("./Routes/technicalRoutes")
const rBookingRoutes = require("./Routes/rBookingRoutes")
const techRoutes = require("./Routes/techRoutes")
const chatRoutes = require("./Routes/chatRoutes")
const path = require('path');
//configuring .env file for using
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,"/uploads")))

// //using cache to store a few things for faster data retrieval
// let cache = apicache.middleware;
// //setting time to cache
// app.use(cache("5 minutes"));
//starting server

//starting connection
connection();
//*******************************Common Login/Register API**************************************//
app.use('/api/customer', customerRoutes);
//*******************************Priyanka's APIs for booking schema**************************************//
app.use('/api/booking', bookingRoutes);
//*******************************Vinod's APIs for wifi schema**************************************//
app.use('/api/wifi', wifiRoutes);
//*******************************Yogesh's APIs for technical schema**************************************//
app.use('/api/technical', technicalRoutes)
//*******************************Rahul's APIs for technical schema**************************************//
app.use('/api/rbooking', rBookingRoutes);
//*******************************Technician schema(yet to implement in FE)**************************************//
app.use('/api/tech', techRoutes);
//*******************************Socket IO code from YOGESH**************************************//
app.use('/api/chat', chatRoutes)
//*******************************Server**************************************//
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
//import io from specific server
const io = require("socket.io")(server);
//Creating a connection event from io
io.on('connection', socket => {
  //Handling the socket event "send-message" emitted from frontend 
  socket.on("send-message", (data) => {
    //Handling the socket event "receive-message" emitted from frontend 
    io.emit("receive-message", data)
  })
  //Handling the socket event "disconnect" emitted from frontend;
  socket.on('disconnect', () => {
  });

  //Handling the socket event "file" emitted from frontend.
  socket.on('file', (fileData) => {
    //Decrypting File Data and file Name
    const originalNameOfFile = fileData.name
    let originalFileData = fileData.data
    //Make a unique file name by appending timestamp.
    const fileName = `${Date.now()}_${originalNameOfFile}`;

    //Creating a static url for the images to render on frontend
    const fileUrl = `http://${process.env.BASE_URL}:5000/${fileName}`;


    // Emitting the event "file" from backend that will contain fileData required at frontend.
    io.emit('file', { name:fileData.name,fileName: originalNameOfFile, url: fileUrl, specialtyOfPerson: fileData.specialtyOfPerson });

    //Storing the image in "uploads" folder
    originalFileData = originalFileData.replace(/^data:image\/\w+;base64,/, '');
    require('fs').writeFile(`uploads/${fileName}`, originalFileData, 'base64', (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
})