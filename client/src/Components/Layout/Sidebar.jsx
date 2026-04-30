// import {Link} from 'react'
import { FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";

const Sidebar = () => {
  const links = [
    { id: 1, name: "Home", icon: <FaHome /> },
    { id: 2, name: "Dashboard", icon: <MdDashboard /> },
    { id: 3, name: "Alerts", icon: <FaBell /> },
    { id: 4, name: "Settings", icon: <IoSettings /> },
    { id: 5, name: "Sign out", icon: <FaSignOutAlt /> },
  ];
  return (
    <div className="sidebar-content w-40 hidden md:block px-2 py-3">
      <div className="text-center my-3">
        <div className="text-xl font-bold">
          AI SYSTEM{" "}
          <span className="text-sm font-bold text-amber-400">Monitoring</span>
        </div>
      </div>
      <div>
        <div className="nav-links list-none space-y-2  mt-5 flex flex-col px-2">
          {links.map((link) => {
            return (
              <div key={link.id}>
                <a className="flex gap-2 cursor-pointer hover:bg-gray-500 items-center space-x-2 justify-start px-3 py-2 rounded-md sidebar-link bg-secondary">
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
