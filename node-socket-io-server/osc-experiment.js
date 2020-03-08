const osc = require("node-osc");

const OSC_PORT = 12345;
this.oscServer = new osc.Server(OSC_PORT, "127.0.0.1");

setTimeout(function() {
  console.log(counter);
  return process.exit(22);
}, 5000);

let counter = 0;
this.oscServer.on("message", data => {
  counter++;
  console.log(counter);
});
