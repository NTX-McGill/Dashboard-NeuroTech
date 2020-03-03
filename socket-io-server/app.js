const osc = require('node-osc');
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = 5000;
// const index = require("./routes/index");

const app = express();
// app.use(index);

const server = http.createServer(app);

const io = socketIo(server); 

const OSC_PORT = 12345;
this.oscServer = new osc.Server(OSC_PORT, '127.0.0.1');



const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/e485e8977609bdb6a9690f8a0d5230db/43.7695,11.2558"
    ); // Getting the data from DarkSky
    socket.emit("FromAPI", Date.now()); // Emitting a new message. It will be consumed by the client
    console.log("Update Temperature");
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

io.on("connection", socket => {
  console.log("New client connected");

  this.oscServer.on('message', data => socket.emit("FromAPI", data));

  socket.on("disconnect", () => console.log("Client disconnected"));
});

let interval;

io.on("connection", socket => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
