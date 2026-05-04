import { useEffect, useState } from "react";
// import axios from "axios";
import "./App.css";
import io from "socket.io-client";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Components/Layout/Layout";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  interval: 2000,
});

function App() {
  const [setMetrics] = useState({
    cpuUsage: 0,
    totalMemory: 0,
    freeMemory: 0,
    loadAverage: [0, 0, 0],
    hostname: "",
    platform: "",
    release: "",
    type: "",
    arch: "",
    cpuInfo: [],
  });

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("Connected:", socket.id);
    });
    setInterval(() => {
      socket.on("cpu", (data) => {
        // console.log("Connected:", socket.id);
        // console.log("current data", data);
        setMetrics(data);
      });
    }, 5000);

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      socket.off("cpu");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <>
      <Layout>
        <Dashboard />
      </Layout>

      {/* <h2>CPU USAGE : {metrics.cpu}</h2> */}
      {/* <h2>Free Memory USAGE : {metrics.freeMemory} MB</h2>
      <h2>Total Memory USAGE : {metrics.totalMemory} MB</h2>
      <h2>Hostname : {metrics.hostname} </h2>
      <h2>Platform: {metrics.platform}</h2>
      <h2>Release : {metrics.release}</h2>
      <h2>Architecture : {metrics.arch}</h2> */}
    </>
  );
}

export default App;
