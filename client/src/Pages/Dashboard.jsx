import React from "react";
import { io } from "socket.io-client";
import axios from "axios";

import { GoAlertFill } from "react-icons/go";
import { IoNotificationsSharp } from "react-icons/io5";
import { FcSalesPerformance } from "react-icons/fc";
import { GrOverview } from "react-icons/gr";
import { DASHBOARD_CARDS } from "../constants/metricsData";
import Card from "../Components/Common/Card";
// import Layout from '../Components/Layout'
import SystemPerformanceChart from "../Components/Charts/SystemPerformanceChart";

const Dashboard = () => {
  const REACT_APP_API_URL =
    import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

    // metric to display value in card cpu, memory ..
  const [metrics, setMetrics] = React.useState({});
  // details for system performance chart
  const [details, setDetails] = React.useState([]);
  //system information
  const [info, setInfo] = React.useState([]);
  const [alerts, setAlerts] = React.useState([]);
  const [anomaly, setAnomaly] = React.useState([]);

  const socketRef = React.useRef(null);

  const formattedData = details.slice(-20).map((data) => ({
    cpu: data.cpu,
    usedMemory: data.usedMemory,
    usageMemory: data.usageMemory,
    upload: data.uploadSpeed,
    download: data.downloadSpeed,
    time: new Date(data.timestamp).toLocaleTimeString(),
  }));

  const criticalAlerts = alerts.reduce((acc, val) => {
    // const { cpu, timestamp, usageMemory } = val;
    acc = { cpu: 0, timestamp: 0, usageMemory: 0 }
    if (val.cpu > acc.cpu) {
      acc.cpu = val.cpu;
      acc.cpuTimestamp = val.timestamp;
    }
    if (val.usageMemory > acc.usageMemory) {
      acc.usageMemory = val.usageMemory;
      acc.memTimestamp = val.timestamp;
    }
    return acc;
  }, { cpu: 0, cpuTimestamp: null, usageMemory: 0, memTimestamp: null });

  React.useEffect(() => {
    socketRef.current = io(REACT_APP_API_URL);
    socketRef.current.on("metrics", setMetrics);
    socketRef.current.on("anomaly", setAnomaly);
    return () => socketRef.current.disconnect();
  }, []);

  React.useEffect(() => {
    axios
      .get(`${REACT_APP_API_URL}/metrics`)
      .then((res) => {
        setDetails(res.data.slice(20));
      })
      .catch((err) => console.error(err));
  }, []);

 
  React.useEffect(() => {
    axios.get(`${REACT_APP_API_URL}/alerts/cpu/critical`).then((res) => {
      setAlerts(res.data);
    }).catch((err) => console.error(err))
  }, [])

  React.useEffect(() => {
    axios.get(`${REACT_APP_API_URL}/systemInformation`).then((res) => {
      setInfo(res.data);
    }).catch((err) => console.error(err))
  }, [])

  return (
    <>
      <div className="dashboard-content px-3">
        <div className="grid grid-cols-2 items-center content-center sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-7 gap-3 w-full">
          {DASHBOARD_CARDS.map((card) => {
            return (
              <Card
                key={card.name}
                title={card.title}
                icon={card.icon}
                value={metrics[card.name]}
                unit={card.unit}
                colorName={card.colorName}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-3  py-3">
          <div className="card ">
            <div className="flex justify-start gap-2 text-[15px] font-bold items-center content-center text-amber-400 ">
              <div className="">
                <FcSalesPerformance />{" "}
              </div>
              <div>System Performance</div>
            </div>
            <div>
              <SystemPerformanceChart data={formattedData} />
            </div>
          </div>
          <div className="card ">
            <div className="flex justify-between  items-center content-center">
              <div className="flex gap-2 text-[15px] font-bold justify-center content-center items-center text-red-600">
                <div>
                  <GoAlertFill />{" "}
                </div>
                <div>AI Anamoly Detection</div>
              </div>
              <div className="bg-red-200 font-bold rounded-sm border text-red-600 border-red-400  text-[9px] text-center px-1 tracking-wide">
                High Risk
              </div>
            </div>
            <div className="flex justify-between gap-2 py-3">
              <div>//circle graph</div>
              <div>
                <div className="flex justify-between gap-3">
                  <span className="bg-green-700">dot </span>{" "}
                  <div>Anamoly Detection</div>
                </div>
                <div>{anomaly.anomalyDetection.type}</div>
                <div>{anomaly.anomalyDetection.severity}</div>
                <div>{anomaly.anomalyDetection.message}</div>
                <div>{anomaly.anomalyDetection.timestamp}</div>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-2 ">
          <div className="card">
            <div className="flex justify-between  items-center content-center">
              <div className="flex gap-2 text-[15px] font-bold items-center  text-orange-500 ">
                <div>
                  <GoAlertFill />
                </div>{" "}
                <div> Critical Alerts</div>
              </div>
            </div>
            <div className="text-xs font-bold  mt-2">
              Highest Peak CPU:
              <span className='font-bold text-red-500'> {criticalAlerts.cpu}% </span>
              at {criticalAlerts.cpuTimestamp ? new Date(criticalAlerts.cpuTimestamp).toLocaleTimeString() : 'N/A'} {" "}
              {/* on  {" "} {criticalAlerts.cpuTimestamp ? new Date(criticalAlerts.cpuTimestamp).toLocaleDateString() : 'N/A'} */}
            </div>

            <div className="text-xs font-bold mt-2">
              Highest Peak Memory:
              <span className='font-bold text-red-500'> {criticalAlerts.usageMemory}% </span>
              at {criticalAlerts.memTimestamp ? new Date(criticalAlerts.memTimestamp).toLocaleTimeString() : 'N/A'} {" "}
              {/* on  {" "} {criticalAlerts.memTimestamp ? new Date(criticalAlerts.memTimestamp).toLocaleDateString() : 'N/A'} */}
            </div>
          </div>
          <div className="card">
            <div className="flex justify-between  items-center content-center">
              <div className="flex gap-2 text-[15px] font-bold items-center text-blue-500">
                <div>
                  <IoNotificationsSharp />{" "}
                </div>
                <div>Datadog Insights</div>
              </div>
            </div>
            <div className="text-[13px] py-3">
              <div>{anomaly.dataDogInsights?.[0]}</div>
              <div>{anomaly.dataDogInsights?.[1]}</div>
              <div>{anomaly.dataDogInsights?.[2]}</div>
              <div>{anomaly.dataDogInsights?.[3]}</div>
              <div>{anomaly.dataDogInsights?.[4]}</div>
            </div>
          </div>
          <div className="card">
            <div className="gap-2">
              <div className="flex justify-start gap-2  text-[15px] font-bold  text-green-600 items-center content-center ">
                <div>
                  <GrOverview />
                </div>
                <div>System Overview</div>
              </div>
            </div>
            <div className="text-[13px]">
              <div className="flex justify-between align-center items-center">
                <div className='heading w-1/2'>Type: </div>
                <div className='content w-1/2  text-left'>{info.type}</div>
              </div>
              <div className="flex justify-between align-center items-center">
                <div className='heading w-1/2'>Hostname: </div>
                <div className='content w-1/2 text-left '>{info.hostname}</div>
              </div>

              <div className="flex justify-between align-center items-center">
                <div className='heading w-1/2'>System Architecture: </div>
                <div className='content w-1/2 text-left'>{info.arch}</div>
              </div>
              <div className="flex justify-between align-center items-center">
                <div className='heading w-1/2'>System Platform: </div>
                <div className='content w-1/2 text-left'>{info.platform}</div>
              </div>

              <div className="flex justify-between align-center items-center">
                <div className='heading w-1/2'>Release Information: </div>
                <div className='content w-1/2 text-left'>{info.release}</div>
              </div>
              <div className="flex justify-between align-center items-center">
                <div className='heading w-1/2'>System Timezone: </div>
                <div className='content w-1/2 text-left'>{info.timezone}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
