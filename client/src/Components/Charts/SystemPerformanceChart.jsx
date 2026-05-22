import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SystemPerformanceChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={130}>
      <AreaChart data={data}>
        
        {/* Gradient fill */}
        <defs>
          <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4d4f" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#ff4d4f" stopOpacity={0} />
          </linearGradient>
           <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#efdb00" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#efdb00" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* X axis hidden */}
        <XAxis dataKey="time" hide />

        {/* Y axis with percentage */}
        <YAxis
          domain={[0, 120]}
          tickFormatter={(val) => `${val}%`}
          width={30}
          tick={{ fontSize: 10 }}
        />

        {/* Tooltip */}
        <Tooltip
          formatter={(value) => `${value}%`}
          contentStyle={{
            background: "#111",
            border: "none",
            borderRadius: "6px",
            fontSize: "11px",
            color: "#fff",
          }}
        />

        {/* Area (fill) */}
        <Area
          type="monotone"
          dataKey="cpu"
          stroke="#ff4d4f"
          strokeWidth={2}
          fill="url(#cpuFill)"
          dot={false}
        />
         <Area
          type="monotone"
          dataKey="usageMemory"
          stroke="#efdb00"
          strokeWidth={2}
          fill="url(#usageFill)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SystemPerformanceChart;