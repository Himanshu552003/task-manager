import { memo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const STATUS_COLORS = ["#eab308", "#3b82f6", "#22c55e"];
const PRIORITY_COLORS = ["#9ca3af", "#f97316", "#ef4444"];

const TaskCharts = ({ statusData, priorityData }) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="card">
        <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">Tasks by Status</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">Tasks by Priority</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis allowDecimals={false} stroke="#9ca3af" />
              <Tooltip cursor={{ fill: "rgba(156,163,175,0.1)" }} />
              <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskCharts);
