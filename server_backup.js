require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const os = require("os");
const platform = os.platform();
const type = os.type();
const release = os.release();
const arch = os.arch();

const totalMemory = os.totalmem();
const freeMemory = os.freemem();
const cpuInfo = os.cpus();
const hostname = os.hostname();
const uptime = os.uptime();
const loadAverage = os.loadavg();
const cpuUsage = os.loadavg()[0] / os.cpus().length; // Approximate CPU usage based on load average and number of CPUs
const getNetworkInterfaces = os.networkInterfaces();

console.log(`Platform: ${platform}`);
console.log(`OS Type: ${type}`);
console.log(`OS Release: ${release}`);
console.log(`CPU Architecture: ${arch}`);
console.log(
  `Total Memory: ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
);
console.log(`Free Memory: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log(`Hostname: ${hostname}`);
console.log(`Uptime: ${uptime} seconds`);
console.log(`Load Average: ${loadAverage}`);
console.log(`CPU Info: ${JSON.stringify(cpuInfo[0]["model"])}`);
// console.log(`Network Interfaces: ${JSON.stringify(getNetworkInterfaces)}`);

// middlewares //handle routing - decide which code run when a user visits
app.use(cors());
// CORS - CROSS ORIGIN RESOURCE SHARING - security feature implemented by browsers to restrict web pages from making requests to a different domain than the one that served the web page.
// //It's okay I trust this server, so I allow it to access my resources.

app.use(express.json()); // to understand JSON data sent in request body

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongoose connected!"))
  .catch((error) => console.log(error));

//API endpoint
app.get("/", (req, res) => {
  res.send("API TEST RUNNING");
});

// start server
app.listen(process.env.PORT, () => {
  console.log("server running on port" + process.env.PORT);
});

function getCPUUsage() {
  const startMeasure = os.cpus();
  // console.log("start measure", startMeasure);
  // Wait for 1 second to calculate the average usage over that time
  setTimeout(() => {
    const endMeasure = os.cpus();

    let idleDifference = 0;
    let totalDifference = 0;

    for (let i = 0; i < startMeasure.length; i++) {
      const startIdle = startMeasure[i].times.idle;
      const endIdle = endMeasure[i].times.idle;

      const startTotal =
        startMeasure[i].times.user +
        startMeasure[i].times.nice +
        startMeasure[i].times.sys +
        startMeasure[i].times.idle +
        startMeasure[i].times.irq;
      const endTotal =
        endMeasure[i].times.user +
        endMeasure[i].times.nice +
        endMeasure[i].times.sys +
        endMeasure[i].times.idle +
        endMeasure[i].times.irq;

      idleDifference += endIdle - startIdle;
      totalDifference += endTotal - startTotal;
    }

    const percentage = 100 - (100 * idleDifference) / totalDifference;
    console.log(`Approximate CPU Usage: ${percentage.toFixed(2)} %`);
  }, 1000);
}
let liveCPU;
setInterval(() => {
  liveCPU= getCPUUsage();
  // stressCPU();
}, 2000);
// function stressCPU() {
//   while (true) {
//     console.log('stress cpu')
//     Math.sqrt(Math.random());
//   }
// }
// getCPUUsage();

//METRICS ENDPOINT - to provide data for the dashboard
app.get("/metrics", (req, res) => {
  res.json([
    {
      cpuUsage: liveCPU,
      totalMemory: totalMemory,
      freeMemory: freeMemory,
      loadAverage: loadAverage,
      uptime: uptime,
      hostname: hostname,
      platform: platform,
      type: type,
      release: release,
      arch: arch,
      cpuInfo: cpuInfo[0]["model"],
      networkInterfaces: getNetworkInterfaces,
    },
  ]);
});

console.log(os.platform());

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});
