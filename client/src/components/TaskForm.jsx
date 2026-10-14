import { useState } from "react";
import { useSelector } from "react-redux";
import useUsers from "../hooks/useUsers";
import { validateTask } from "../utils/validation";
import { toInputDate } from "../utils/helpers";

const TaskForm = ({ initialData, onSubmit, submitting, buttonText }) => {
  const { user } = useSelector((state) => state.auth);
  const { users, loading: usersLoading } = useUsers();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
    status: initialData?.status || "pending",
    dueDate: toInputDate(initialData?.dueDate),
    // by default assign to yourself
    assignedTo: initialData?.assignedTo?._id || user?._id || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // remove error when user starts typing
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateTask(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4" noValidate>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input"
          placeholder="Enter task title"
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="input"
          placeholder="Write some details about the task..."
        ></textarea>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="input">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="input" />
          {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Assign To <span className="text-red-500">*</span>
          </label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="input"
            disabled={usersLoading}
          >
            <option value="">{usersLoading ? "Loading users..." : "Select user"}</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          {errors.assignedTo && <p className="mt-1 text-xs text-red-500">{errors.assignedTo}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
