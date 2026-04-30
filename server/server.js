require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const si = require("systeminformation");
const os = require("os");

app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoose conencted"))
  .catch((error) => console.log(error));
//API endpoint
app.get("/", (req, res) => {
  res.send("API TEST RUNNING");
});

function getCPUUsage() {
  return new Promise((resolve) => {
    const startMeasure = os.cpus();
    setTimeout(() => {
      const endMeasure = os.cpus();

      let idleDiff = 0;
      let totalDiff = 0;

      for (let i = 0; i < startMeasure.length; i++) {
        const start = startMeasure[i].times;
        const end = endMeasure[i].times;

        const startTotal =
          start.user + start.nice + start.sys + start.idle + start.irq;

        const endTotal = end.user + end.nice + end.sys + end.idle + end.irq;

        idleDiff += end.idle - start.idle;
        totalDiff += endTotal - startTotal;
      }

      const percentage = 100 - (100 * idleDiff) / totalDiff;
      resolve(percentage.toFixed(2));
    }, 100);
  });
}
// create server + socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  methods: ["GET", "POST"],
});

async function getNetworkSpeed() {
    const stats = await si.networkStats();
  const initialStats = await si.networkStats();

  await new Promise((resolve) => setTimeout(resolve, 500));

  const finalStats = await si.networkStats();
  const downloadSpeed =
    (finalStats[0].rx_bytes - initialStats[0].rx_bytes) / 1024; // KB/s
  const uploadSpeed =
    (finalStats[0].tx_bytes - initialStats[0].tx_bytes) / 1024; // KB/s

  return {
    downloadSpeed: downloadSpeed.toFixed(2),
    uploadSpeed: uploadSpeed.toFixed(2),
  };
}
// socket streaming
// io.on("connection", (socket) => {
//   console.log("client connected", socket.id);
//     let isRunning = false;
//   const interval = setInterval(async () => {
//     if(isRunning) return;
//     isRunning = true;
//     const cpu = await getCPUUsage();

//     try {
//       socket.emit("metrics", {
//         cpu: cpu,
//         totalMemory: os.totalmem(),
//         freeMemory: os.freemem(),
//       });
//       console.log("Emitted metrics:", {
//         cpu: cpu,
//         totalMemory: os.totalmem(),
//         freeMemory: os.freemem(),
//         usedMemory: os.totalmem() - os.freemem(),
//         memoryUsage: (
//           ((os.totalmem() - os.freemem()) / os.totalmem()) *
//           100
//         ).toFixed(2)
//       });
//     } catch (err) {
//       console.log("Error emitting metrics:", err);
//     }
//     isRunning = false;
//   }, 5000);

//     socket.on("disconnect", () => {
//       clearInterval(interval);
//       console.log("client disconnected", socket.id);
//     });
// });

io.on("connection", (socket) => {
  // console.log("client connected", socket.id);

  let isActive = true;

  socket.on("disconnect", () => {
    isActive = false;
    console.log("client disconnected", socket.id);
  });

  async function streamMetrics() {
    while (isActive) {
      const [cpu, network] = await Promise.all([
        getCPUUsage(),
        getNetworkSpeed(),
      ]);

      socket.emit("metrics", {
        cpu: cpu,
        totalMemory: Number((os.totalmem() / 1024 / 1024 / 1024).toFixed(2)), // Convert to GB
        freeMemory: Number((os.freemem() / 1024 / 1024 / 1024).toFixed(2)),
        usedMemory: Number(
          ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2),
        ),
        memoryUsage: (
          ((os.totalmem() - os.freemem()) / os.totalmem()) *
          100
        ).toFixed(2),
        downloadSpeed: network.downloadSpeed,
        uploadSpeed: network.uploadSpeed,
      });

      console.log("Emitted metrics");

      // wait 1 sec before next loop
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  streamMetrics();
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.get("/details", async (req, res) => {
  res.json([
    {
      type: os.type(),
      hostname: os.hostname(),
      arch: os.arch(),
      uptime: os.uptime(),
      cpus: os.cpus(),
      loadavg: os.loadavg(),
      networkInterfaces: os.networkInterfaces(),
      userInfo: os.userInfo(),
      release: os.release(),
      platform: os.platform(),
      type: os.type(),
      hostname: os.hostname(),
      arch: os.arch(),
      uptime: os.uptime(),
      cpus: os.cpus(),
      loadavg: os.loadavg(),
      networkInterfaces: os.networkInterfaces(),
      userInfo: os.userInfo(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  ]);
});
