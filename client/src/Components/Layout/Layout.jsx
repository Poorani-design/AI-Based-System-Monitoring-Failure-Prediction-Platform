// import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <>
      <div id="layout">
        <div id="sidebark">
          <Sidebar />
        </div>
        <div id="wrapper">
          <div id="topbar">
            <Topbar />
          </div>
          <div id="dashboard">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
