import { FiCpu } from "react-icons/fi";
import { GrMemory } from "react-icons/gr";
import { GiFocusedLightning } from "react-icons/gi";
import { LiaSpaceShuttleSolid } from "react-icons/lia";
import { MdSdStorage, MdNetworkCheck } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";

// Using 'icon' (capitalized) makes it easier to render as a component
export const DASHBOARD_CARDS = [
  {
    name: "cpu",
    title: "CPU Usage",
    icon: <FiCpu className='color-cpu'/>,
    unit: "%",
    colorName: "color-cpu",
  },
  {
    name: "totalMemory",
    title: "Total Memory",
    icon: <GrMemory />,
    unit: "GB",
    colorName: "color-memory",
  },
  {
    name: "usedMemory",
    title: "Used Memory",
    icon: <GiFocusedLightning />,
    unit: "GB",
    colorName: "color-usage",
  },
  {
    name: "freeMemory",
    title: "Free Memory",
    icon: <LiaSpaceShuttleSolid />,
    unit: "GB",
    colorName: "color-free",
  },
  {
    name: "usageMemory",
    title: "Usage",
    icon: <MdSdStorage />,
    unit: "%",
    colorName: "color-usage",
  },
  {
    name: "downloadSpeed",
    title: "Download",
    icon: <MdNetworkCheck />,
    unit: "Mbps",
    colorName: 'color-network'
  },
  {
    name: "uploadSpeed",
    title: "Upload",
    icon: <IoSpeedometer />,
    unit: "Mbps",
    colorName: 'color-success'
  },
];
