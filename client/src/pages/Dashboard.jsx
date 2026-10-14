import { useEffect, useMemo, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchStats, fetchTasks } from "../store/taskSlice";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import { formatDate, statusColors, statusLabel } from "../utils/helpers";

// charts library is big so load it only when needed
const TaskCharts = lazy(() => import("../components/TaskCharts"));

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, statsLoading, tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchTasks({ page: 1, limit: 5, sort: "newest" }));
  }, [dispatch]);

  const statusData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Pending", value: stats.pending },
      { name: "In Progress", value: stats.inProgress },
      { name: "Completed", value: stats.completed },
    ];
  }, [stats]);

  const priorityData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Low", value: stats.byPriority.low },
      { name: "Medium", value: stats.byPriority.medium },
      { name: "High", value: stats.byPriority.high },
    ];
  }, [stats]);

  const completionRate = useMemo(() => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }, [stats]);

  if (statsLoading && !stats) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You have completed {completionRate}% of your tasks
          </p>
        </div>
        <Link to="/tasks/new" className="btn-primary">
          + New Task
        </Link>
      </div>

      {error && !stats && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tasks" value={stats?.total ?? 0} icon="📋" color="bg-indigo-100 dark:bg-indigo-900/40" />
        <StatCard title="Pending" value={stats?.pending ?? 0} icon="⏳" color="bg-yellow-100 dark:bg-yellow-900/40" />
        <StatCard title="In Progress" value={stats?.inProgress ?? 0} icon="🚧" color="bg-blue-100 dark:bg-blue-900/40" />
        <StatCard title="Completed" value={stats?.completed ?? 0} icon="✅" color="bg-green-100 dark:bg-green-900/40" />
      </div>

      {stats && stats.total > 0 && (
        <Suspense fallback={<Loader />}>
          <TaskCharts statusData={statusData} priorityData={priorityData} />
        </Suspense>
      )}

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white">Recent Tasks</h3>
          <Link to="/tasks" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            View all →
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : tasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No tasks yet. <Link to="/tasks/new" className="text-indigo-600">Create one</Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Due Date</th>
                  <th className="py-2 font-medium">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-b border-gray-100 last:border-0 dark:border-gray-700">
                    <td className="py-3 pr-4">
                      <Link to={`/tasks/${task._id}`} className="font-medium text-gray-800 hover:text-indigo-600 dark:text-gray-100">
                        {task.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[task.status]}`}>
                        {statusLabel[task.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-gray-600 dark:text-gray-300">{formatDate(task.dueDate)}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">{task.assignedTo?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
