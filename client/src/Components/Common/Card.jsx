// import React from "react";

const Card = ({ title, icon, value, unit, colorName }) => {
  return (
    <div className="card flex flex-col my-1 justify-between px-3 py-2">
      <div className={`flex items-center gap-2 font-bold py-1`}>
       <div className={`text-lg ${colorName}`} > {icon}</div>
        <div className=''>{title}</div>
      </div>

      <div className="text-[15px] font-bold my-1">
        {value ?? 0} {unit}
      </div>

      {/* <span className="text-gray-500">updated now</span> */}
    </div>
  );
};

export default Card;