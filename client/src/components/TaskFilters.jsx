import { memo } from "react";

const TaskFilters = ({ filters, onChange, onReset }) => {
  return (
    <div className="card grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <input
        type="text"
        name="search"
        placeholder="Search by title..."
        value={filters.search}
        onChange={onChange}
        className="input lg:col-span-2"
      />

      <select name="status" value={filters.status} onChange={onChange} className="input">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select name="priority" value={filters.priority} onChange={onChange} className="input">
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <div className="flex gap-2">
        <select name="sort" value={filters.sort} onChange={onChange} className="input">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="dueDate-asc">Due date (soonest)</option>
          <option value="dueDate-desc">Due date (latest)</option>
        </select>
        <button onClick={onReset} className="btn-secondary !px-3" title="Clear filters">
          ↺
        </button>
      </div>
    </div>
  );
};

export default memo(TaskFilters);
