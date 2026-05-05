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
import { HiOutlineDesktopComputer } from "react-icons/hi";


const Sidebar = () => {
  const links = [
    { id: 1, name: "Home", icon: <FaHome /> },
    { id: 2, name: "Dashboard", icon: <MdDashboard /> },
    { id: 3, name: "Anamoly Detection", icon: <PiDetectiveFill /> },
    { id: 4, name: "Alerts", icon: <GoAlertFill /> },
    { id: 5, name: "Notification", icon: <MdNotificationsActive /> },
    { id: 6, name: "System", icon: <HiOutlineDesktopComputer /> },
    { id: 7, name: "Reports", icon: <BiSolidReport /> },
    { id: 8, name: "Settings", icon: <IoSettings /> },
    { id: 9, name: "Logs", icon: <FaFileInvoice /> },
    { id: 10, name: "Sign out", icon: <FaSignOutAlt /> },
  ];
  return (
    <div className="sidebar-content w-50 hidden md:block px-2 py-3">
      <div className="text-center my-3">
        <div className="text-md font-bold text-15px flex text-md items-center gap-1 justify-center">
          <img src="./logo.png" alt="logo" className="w-8 h-8 mb-1" />
          System {" "}<br/>
          <span className="text-amber-400"> Monitoring</span>
        </div>
      </div>
      <div>
        <div className="nav-links list-none space-y-2  mt-5 flex flex-col px-2 ">
          {links.map((link) => {
            return (
              <div key={link.id} className='hover:bg-white'>
                <a className="flex gap-2 cursor-pointer hover:bg-gray-500 items-center space-x-1 justify-start px-3 py-2 rounded-md sidebar-link bg-secondary hover:text-purple-600">
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
