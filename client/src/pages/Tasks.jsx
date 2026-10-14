import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchTasks, deleteTask } from "../store/taskSlice";
import useDebounce from "../hooks/useDebounce";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

const initialFilters = { search: "", status: "", priority: "", sort: "newest" };
const LIMIT = 6;

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, page, totalPages, total, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // dont call api on every key press
  const debouncedSearch = useDebounce(filters.search, 500);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      status: filters.status,
      priority: filters.priority,
      sort: filters.sort,
      page: currentPage,
      limit: LIMIT,
    }),
    [debouncedSearch, filters.status, filters.priority, filters.sort, currentPage]
  );

  useEffect(() => {
    dispatch(fetchTasks(queryParams));
  }, [dispatch, queryParams]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // go back to first page when filter changes
  }, []);

  const handleReset = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this task?")) return;

      const result = await dispatch(deleteTask(id));
      if (deleteTask.fulfilled.match(result)) {
        toast.success("Task deleted");
        // reload the list so pagination stays correct
        dispatch(fetchTasks(queryParams));
      } else {
        toast.error(result.payload);
      }
    },
    [dispatch, queryParams]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Tasks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{total} task(s) found</p>
        </div>
        <Link to="/tasks/new" className="btn-primary">
          + New Task
        </Link>
      </div>

      <TaskFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}{" "}
          <button onClick={() => dispatch(fetchTasks(queryParams))} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              canDelete={user?.role === "admin" || task.createdBy?._id === user?._id}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Tasks;
