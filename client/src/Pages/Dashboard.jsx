import React from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { FiCpu } from "react-icons/fi";
import { GrMemory } from "react-icons/gr";
import { MdSdStorage } from "react-icons/md";
import { LiaSpaceShuttleSolid } from "react-icons/lia";
import { GiFocusedLightning } from "react-icons/gi";
import { MdNetworkCheck } from "react-icons/md";
import { GoAlertFill } from "react-icons/go";
import { IoSpeedometer } from "react-icons/io5";
import { IoNotificationsSharp } from "react-icons/io5";
import { FcSalesPerformance } from "react-icons/fc";
import { GrOverview } from "react-icons/gr";


// import Layout from '../Components/Layout'

const Dashboard = () => {
  const REACT_APP_API_URL =
    import.meta.env.REACT_APP_API_URL || "http://localhost:5000";
  const socket = io(REACT_APP_API_URL); // Replace with your actual local URL
  const cards = [
    {
      name: "cpu",
      title: "CPU Usage",
      icon: <FiCpu className="color-cpu" />,
      data: "cpu",
    },
    {
      name: "totalMemory",
      title: "Total Memory",
      icon: <GrMemory className="color-memory" />,
      data: "totalMemory",
    },
    {
      name: "usedMemory",
      title: "Used Memory",
      icon: <GiFocusedLightning className="color-memory" />,
      data: "usedMemory",
    },
    {
      name: "freeMemory",
      title: "Free Memory",
      icon: <LiaSpaceShuttleSolid className="color-free" />,
      data: "freeMemory",
    },
    {
      name: "memoryUsage",
      title: "Memory Usage",
      icon: <MdSdStorage className="color-usage" />,
      data: "usageMemory",
    },
    {
      name: "downloadSpeed",
      title: "N/W Download",
      icon: <MdNetworkCheck className="color-network" />,
      data: "downloadSpeed",
    },
    {
      name: "uploadSpeed",
      title: "N/W Upload",
      icon: <IoSpeedometer className="text-green-500" />,
      data: "uploadSpeed",
    },
  ];
  const [metrics, setMetrics] = React.useState({});
  const [details, setDetails] = React.useState({});

  React.useEffect(() => {
    socket.on("metrics", (data) => {
      console.log("LIVE:", data);
      setMetrics(data);
    });

    return () => {
      socket.off("metrics");
    };
  }, []);

  React.useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/details`)
      .then((res) => setDetails(res.data[0]))
      .catch(console.error);
  }, []);

  return (
    <>
      <div className="dashboard-content px-3 w-12/12">
        <div className="content flex flex-col sm:flex-row lg:flex-row gap-3 my-2">
          {cards.map((card) => {
            return (
              <div
                key={card.name}
                className="card w-full sm:w-2/4 md:w-1/4 flex flex-col"
              >
                <div className="title flex align-center content-center gap-3 items-center">
                  <div className="text-xl">{card.icon}</div>
                  <div className=""> {card.title}</div>
                </div>
                <div className="text-lg font-bold py-1">
                  {metrics[card.data] || 0}
                  {card.name === "cpu" || card.name === "memoryUsage"
                    ? " %"
                    : card.name.includes("Memory")
                      ? " GB"
                      : " KB/s"}
                </div>
                <div className="flex justify-between">
                  {" "}
                  <div className="text-gray-500">
                    {/* <span className="text-green-500">12%</span>  */}
                    updated now..
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 my-2 ">
          <div className="card w-7/12">
            <div className="flex justify-start gap-2 text-[15px] font-bold items-center content-center text-amber-400 ">
              <div className="">
                <FcSalesPerformance />{" "}
              </div>
              <div>System Performance</div>
            </div>
            <div>Hostname: {details.hostname} </div>
          </div>
          <div className="card w-5/12">
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
                <div>CPU usage spike detected</div>
                <div>Impact : High</div>
                <div>Time : 1hr ago</div>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="flex gap-3 my-2 ">
          <div className="card w-4/12">
            <div className="flex justify-between  items-center content-center">
              <div className="flex gap-2 text-[15px] font-bold items-center  text-orange-500 ">
                <div>
                  <GoAlertFill />
                </div>{" "}
                <div> Critical Alerts</div>
              </div>
            </div>
            <div>Hostname: {details.hostname} </div>
          </div>
          <div className="card w-5/12">
            <div className="flex justify-between  items-center content-center">
              <div className="flex gap-2 text-[15px] font-bold items-center text-blue-500">
                <div>
                  <IoNotificationsSharp />{" "}
                </div>
                <div>System Notification</div>
              </div>
            </div>
            <div className="flex justify-between gap-2 py-3">
              <div>//circle graph</div>
              <div>
                <div className="flex justify-between gap-3">
                  <div>Anamoly Detection</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card w-4/12">
            <div className="flex justify-between  items-center content-center">
              <div className="gap-2 ">
                <div className="flex justify-between  text-[15px] font-bold  text-green-600 items-center content-center ">
                  <div>
                    <GrOverview />
                  </div>
                  <div>System Overview</div>
                </div>
                <div>
                some information
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
