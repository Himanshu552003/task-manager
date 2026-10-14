import { memo } from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="mt-1 text-3xl font-bold text-gray-800 dark:text-white">{value}</h3>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default memo(StatCard);
