// import {Link} from 'react'
import { FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaFileInvoice } from "react-icons/fa";
import { PiDetectiveFill } from "react-icons/pi";
import { GoAlertFill } from "react-icons/go";
import { MdNotificationsActive } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";


const Sidebar = () => {
  const links = [
    { id: 1, name: "Home", icon: <FaHome /> },
    { id: 2, name: "Dashboard", icon: <MdDashboard /> },
    { id: 3, name: "Anamoly Detection", icon: <PiDetectiveFill /> },
    { id: 4, name: "Alerts", icon: <GoAlertFill /> },
    { id: 5, name: "Notification", icon: <MdNotificationsActive /> },
    { id: 6, name: "Reports", icon: <BiSolidReport /> },
    { id: 7, name: "Settings", icon: <IoSettings /> },
    { id: 8, name: "Logs", icon: <FaFileInvoice /> },
    { id: 9, name: "Sign out", icon: <FaSignOutAlt /> },
  ];
  return (
    <div className="sidebar-content w-50 hidden md:block px-2 py-3">
      <div className="text-center my-3">
        <div className="text-md font-bold">
          <img src="./logo.png" alt="logo" className="w-15 h-15 mx-auto mb-1" />
          {/* System Monitor
          <span className="text-xs font-bold text-amber-400">Monitoring</span> */}
        </div>
      </div>
      <div>
        <div className="nav-links list-none space-y-2  mt-5 flex flex-col px-2">
          {links.map((link) => {
            return (
              <div key={link.id}>
                <a className="flex gap-2 cursor-pointer hover:bg-gray-500 items-center space-x-1 justify-start px-3 py-2 rounded-md sidebar-link bg-secondary">
                  <div className="text-sm">{link.icon} </div>
                  <div className="">{link.name}</div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
