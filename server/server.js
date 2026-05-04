require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const si = require("systeminformation");
const os = require("os");
const Metrics = require("./Models/metrics");

const app = express();
app.use(cors());
app.use(express.json());

/* ===========================
   ✅ MONGODB CONNECTION
=========================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

/* ===========================
   ✅ BASIC API
=========================== */
app.get("/", (req, res) => {
  res.send("API TEST RUNNING");
});

/* ===========================
   ✅ CPU USAGE
=========================== */
function getCPUUsage() {
  return new Promise((resolve) => {
    const start = os.cpus();

    setTimeout(() => {
      const end = os.cpus();

      let idleDiff = 0;
      let totalDiff = 0;

      for (let i = 0; i < start.length; i++) {
        const s = start[i].times;
        const e = end[i].times;

        const startTotal = s.user + s.nice + s.sys + s.idle + s.irq;
        const endTotal = e.user + e.nice + e.sys + e.idle + e.irq;

        idleDiff += e.idle - s.idle;
        totalDiff += endTotal - startTotal;
      }

      const percentage = 100 - (100 * idleDiff) / totalDiff;
      resolve(Number(percentage.toFixed(2)));
    }, 500);
  });
}

/* ===========================
   ✅ NETWORK SPEED (FIXED)
=========================== */
async function getNetworkSpeed() {
  try {
    const start = await si.networkStats();
    await new Promise((r) => setTimeout(r, 2000));
    const end = await si.networkStats();

    let download = 0;
    let upload = 0;

    for (let i = 0; i < start.length; i++) {
      download += end[i].rx_bytes - start[i].rx_bytes;
      upload += end[i].tx_bytes - start[i].tx_bytes;
    }

    return {
      downloadSpeed: Number(((download * 8) / (1024 * 1024)).toFixed(2)), // Mbps
      uploadSpeed: Number(((upload * 8) / (1024 * 1024)).toFixed(2)), // Mbps
    };
  } catch (err) {
    console.error("Network Error:", err);
    return { downloadSpeed: 0, uploadSpeed: 0 };
  }
}

/* ===========================
   ✅ MEMORY (FIXED)
=========================== */
async function getMemory() {
  const mem = await si.mem();

  return {
    totalMemory: Number((mem.total / 1024 ** 3).toFixed(2)),
    usedMemory: Number((mem.used / 1024 ** 3).toFixed(2)),
    freeMemory: Number((mem.available / 1024 ** 3).toFixed(2)),
    usageMemory: Number(((mem.used / mem.total) * 100).toFixed(2)),
  };
}

/* ===========================
   ✅ MEMORY MONITOR (NODE)
=========================== */
let lastHeapUsed = 0;

function monitorMemory() {
  const mem = process.memoryUsage();

  const heapUsedMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
  const heapTotalMB = (mem.heapTotal / 1024 / 1024).toFixed(2);

  console.log(`🧠 Heap: ${heapUsedMB} / ${heapTotalMB} MB`);

  if (lastHeapUsed && mem.heapUsed > lastHeapUsed * 1.2) {
    console.log("⚠️ Possible memory leak detected!");
  }

  lastHeapUsed = mem.heapUsed;
}

/* ===========================
   ✅ SOCKET SERVER
=========================== */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

/* ===========================
   ✅ GLOBAL SAVE CONTROL (FIX)
=========================== */
let lastSaved = 0;

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  let isRunning = false;
  let lastNetwork = { downloadSpeed: 0, uploadSpeed: 0 };

  // ✅ FIX: store interval references
  const netInterval = setInterval(async () => {
    lastNetwork = await getNetworkSpeed();
  }, 5000);

  const mainInterval = setInterval(async () => {
    if (isRunning) return;
    isRunning = true;

    try {
      const cpu = await getCPUUsage();
      // const cpuData = await si.currentLoad();

      // const cpu = Number(cpuData.currentLoad.toFixed(2));
      const memory = await getMemory();

      const data = {
        cpu,
        ...memory,
        downloadSpeed: lastNetwork.downloadSpeed,
        uploadSpeed: lastNetwork.uploadSpeed,
        timestamp: new Date(),
      };

      /* ===== SEND TO CLIENT ===== */
      socket.emit("metrics", data);
      console.log("📡 Sent:", data);

      /* ===== MEMORY MONITOR ===== */
      monitorMemory();

      /* ===== DB SAVE (FIXED) ===== */
      const now = Date.now();

      if (now - lastSaved > 10000) {
        try {
          await Metrics.create(data);
          lastSaved = now;
          console.log("💾 Saved to DB");
        } catch (err) {
          console.error("❌ DB Error:", err);
        }
      }
    } catch (err) {
      console.error(err);
    }

    isRunning = false;
  }, 2000);

  socket.on("disconnect", () => {
    clearInterval(mainInterval);
    clearInterval(netInterval); // ✅ IMPORTANT FIX
    console.log("🔴 Client disconnected:", socket.id);
  });
});

/* ===========================
   ✅ SYSTEM DETAILS API
=========================== */
app.get("/details", (req, res) => {
  res.json({
    type: os.type(),
    hostname: os.hostname(),
    arch: os.arch(),
    uptime: os.uptime(),
    cpus: os.cpus(),
    loadavg: os.loadavg(),
    networkInterfaces: os.networkInterfaces(),
    userInfo: os.userInfo(),
    platform: os.platform(),
    release: os.release(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
});

/* ===========================
   ✅ SERVER START
=========================== */
server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
