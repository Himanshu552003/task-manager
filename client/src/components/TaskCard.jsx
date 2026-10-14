import { memo } from "react";
import { Link } from "react-router-dom";
import { formatDate, isOverdue, statusColors, priorityColors, statusLabel } from "../utils/helpers";

const TaskCard = ({ task, onDelete, canDelete }) => {
  const overdue = isOverdue(task);

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/tasks/${task._id}`}
          className="font-semibold text-gray-800 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
        >
          {task.title}
        </Link>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
        {task.description || "No description"}
      </p>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-medium ${statusColors[task.status]}`}>
          {statusLabel[task.status]}
        </span>
        <span className={overdue ? "font-medium text-red-600" : "text-gray-500 dark:text-gray-400"}>
          📅 {formatDate(task.dueDate)} {overdue && "(Overdue)"}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          👤 {task.assignedTo?.name || "Unassigned"}
        </span>
        <div className="flex gap-3 text-sm">
          <Link to={`/tasks/${task._id}`} className="text-gray-600 hover:underline dark:text-gray-300">
            View
          </Link>
          <Link to={`/tasks/${task._id}/edit`} className="text-indigo-600 hover:underline dark:text-indigo-400">
            Edit
          </Link>
          {canDelete && (
            <button onClick={() => onDelete(task._id)} className="text-red-600 hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TaskCard);
