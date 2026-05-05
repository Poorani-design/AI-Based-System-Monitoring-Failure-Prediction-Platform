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

const Dashboard = () => {
  const REACT_APP_API_URL =
    import.meta.env.REACT_APP_API_URL || "http://localhost:5000";

  const [metrics, setMetrics] = React.useState({});
  const [details, setDetails] = React.useState({});
  const socketRef = React.useRef(null);

  React.useEffect(() => {
    socketRef.current = io(REACT_APP_API_URL);
    socketRef.current.on("metrics", setMetrics);
    return () => socketRef.current.disconnect();
  }, []);

  React.useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/metrics`)
      .then((res) => setDetails(res.data[0]))
      .catch(console.error);
  }, []);

  return (
    <>
      <div className="dashboard-content px-3">
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-3 w-full">
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
                <div>some information</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
