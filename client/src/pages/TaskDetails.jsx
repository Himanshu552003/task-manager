import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import taskService from "../services/taskService";
import { getErrorMessage } from "../services/api";
import { deleteTask, updateTask } from "../store/taskSlice";
import Loader from "../components/Loader";
import { formatDate, isOverdue, statusColors, priorityColors, statusLabel } from "../utils/helpers";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    taskService
      .getTask(id)
      .then((data) => setTask(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (e) => {
    const result = await dispatch(updateTask({ id, data: { status: e.target.value } }));
    if (updateTask.fulfilled.match(result)) {
      setTask(result.payload);
      toast.success("Status updated");
    } else {
      toast.error(result.payload);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) {
      toast.success("Task deleted");
      navigate("/tasks");
    } else {
      toast.error(result.payload);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="card py-12 text-center">
        <p className="text-4xl">😕</p>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
        <Link to="/tasks" className="btn-primary mt-4 inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

  const canDelete = user?.role === "admin" || task.createdBy?._id === user?._id;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Back
      </button>

      <div className="card space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{task.title}</h2>
          <div className="flex gap-2">
            <Link to={`/tasks/${task._id}/edit`} className="btn-primary">
              Edit
            </Link>
            {canDelete && (
              <button onClick={handleDelete} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[task.status]}`}>
            {statusLabel[task.status]}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${priorityColors[task.priority]}`}>
            {task.priority} priority
          </span>
          {isOverdue(task) && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Overdue</span>
          )}
        </div>

        <div>
          <h4 className="mb-1 text-sm font-semibold text-gray-500 dark:text-gray-400">Description</h4>
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-200">
            {task.description || "No description added."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 text-sm dark:border-gray-700 sm:grid-cols-2">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Due Date</p>
            <p className="font-medium text-gray-800 dark:text-white">{formatDate(task.dueDate)}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Assigned To</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {task.assignedTo?.name} <span className="text-gray-500">({task.assignedTo?.email})</span>
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Created By</p>
            <p className="font-medium text-gray-800 dark:text-white">{task.createdBy?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Created On</p>
            <p className="font-medium text-gray-800 dark:text-white">{formatDate(task.createdAt)}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 dark:border-gray-700">
          <label className="mb-1 block text-sm text-gray-500 dark:text-gray-400">Quick status update</label>
          <select value={task.status} onChange={handleStatusChange} className="input sm:w-60">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
