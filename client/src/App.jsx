import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  let localURL = "http://localhost:3000";
  const [metrics, setMetrics] = useState([
    {
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

    },
  ]);
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${localURL}/metrics`);
        setMetrics(response.data);
        console.log('fetch updated!')
      } catch (error) {
        console.error("Error fetching metrics: ", error);
      }
    };
    fetchMetrics();

    const interval = setInterval(fetchMetrics, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {metrics.map((item, index) => (
        <div
          key={index}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <p>CPU: {item.cpuUsage}%</p>
          <p>Memory: {(item.totalMemory /1024/1024/1024).toFixed(2) } GB</p>
          <p>Free Memory: {(item.freeMemory /1024/1024/1024).toFixed(2) } GB</p>
          <p>Hostname : {item.hostname} </p>
          <p>Platform: {item.platform}</p>
          <p>Release : {item.release}</p>
          <p>Architecture : {item.arch}</p>
          <p>Load Average: {item.loadAverage.join(", ")}</p>
       
        </div>
      ))}
    </>
  );
}

export default App;
