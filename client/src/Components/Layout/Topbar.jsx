// import React from 'react'

const Topbar = () => {
  return (
    <div className="topbar-content flex flex-col border-0 border-bottom w-12/12">
      <div className="text-center text-xl font-bold bg-linear-to-r
         from-purple-400 to-purple-300 
         light:from-purple-600 light:to-purple-700 
         bg-clip-text text-transparent">
        AI BASED SYSTEM MONITORING DASHBOARD
      </div>
      <div className="hidden md:flex flex-row gap-8 justify-center text-gray-400 text-xs mt-2">
        <div>Realtime Monitoring</div>
        <div>Anamoly Detection</div>
        <div>Intelligent Alerts</div>
      </div>
    </div>
  );
};

export default Topbar;
