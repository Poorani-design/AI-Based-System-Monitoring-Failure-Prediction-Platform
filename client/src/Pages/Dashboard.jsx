import React from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { FiCpu } from "react-icons/fi";
import { GrMemory } from "react-icons/gr";
import { MdSdStorage } from "react-icons/md";
import { MdNetworkCheck } from "react-icons/md";
import { LuServerCrash } from "react-icons/lu";
import { IoSpeedometer } from "react-icons/io5";

// import Layout from '../Components/Layout'
const Dashboard = () => {
  const REACT_APP_API_URL =
    import.meta.env.REACT_APP_API_URL || "http://localhost:5000";
  const socket = io(REACT_APP_API_URL); // Replace with your actual local URL
  const cards = [
    { name: "cpu", title: "CPU Usage", icon: <FiCpu />, data: "cpu" },
    // {
    //   name: "totalMemory",
    //   title: "Total Memory",
    //   icon: <GrMemory />,
    //   data: "totalMemory",
    // },
    {
      name: "usedMemory",
      title: "Used Memory",
      icon: <MdSdStorage />,
      data: "usedMemory",
      
    },
    {
      name: "memoryUsage",
      title: "Memory Usage",
      icon: <GrMemory />,
      data: "memoryUsage",
    },
    {
      name: "downloadSpeed",
      title: "Network Download",
      icon: <MdNetworkCheck />,
      data: "downloadSpeed",
    },
    {
      name: "uploadSpeed",
      title: "Network Upload",
      icon: <IoSpeedometer />,
      data: "uploadSpeed",
    },
  ];
  const [metrics, setMetrics] = React.useState([]);
  const [details, setDetails] = React.useState({});

  React.useEffect(() => {
    socket.on("metrics", (data) => {
      // console.log(data);
      setMetrics(data);
    });

    return () => socket.off("metrics");
  });

  React.useEffect(() => {
    axios
      .get(`${REACT_APP_API_URL}/details`)
      .then((res) => {
        console.log(res.data[0]);
        setDetails(res.data[0]);
      })
      .catch((err) => {
        console.error("Error fetching details:", err);
      });
  }, []);

  return (
    <>
      <div className="dashboard-content px-2 w-12/12">
        <div className="content flex flex-col sm:flex-row gap-3">
          {cards.map((card) => {
            return (
              <div
                key={card.name}
                className="card w-full sm:w-2/4 md:w-1/4 flex flex-col gap-3"
              >
                <div className="title flex align-center content-center gap-2">
                  <div className="text-xl">{card.icon} </div>
                  <div className="text-md"> {card.title}</div>
                </div>
                <div className="text-xl font-bold">
                  {metrics[card.data] || 0}%
                </div>
                <div className="flex justify-between">
                  {" "}
                  <div className=" text-gray-500">
                    <span className="text-green-500">12%</span> vs last hour
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 my-2 ">
          <div className="card w-7/12">
            <div className="font-bold text-sm">System Performance</div>
            <div>Hostname: {details.hostname} </div>
          </div>
          <div className="card w-5/12">
            <div className="flex justify-between  items-center content-center">
              <div className="flex gap-2 text-[15px] font-bold justify-center items-center">
                <div>
                  <LuServerCrash />{" "}
                </div>
                <div>AI Anamoly Detection</div>
              </div>
              <div className="bg-red-300 rounded-sm border text-red-700 border-red-500  text-[9px] text-center px-1 tracking-wide">
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
          <div className="card w-6/12">
            <div className="font-bold text-sm">Alerts</div>
            <div>Hostname: {details.hostname} </div>
          </div>
          <div className="card w-6/12">
            <div className="flex justify-between  items-center content-center">
              <div className="flex gap-2 text-[15px] font-bold justify-center items-center">
                <div>
                  <LuServerCrash />{" "}
                </div>
                <div>Notification</div>
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
