import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createTask } from "../store/taskSlice";
import TaskForm from "../components/TaskForm";

const CreateTask = () => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    const result = await dispatch(createTask(formData));
    setSubmitting(false);

    if (createTask.fulfilled.match(result)) {
      toast.success("Task created!");
      navigate("/tasks");
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Create New Task</h2>
      <TaskForm onSubmit={handleSubmit} submitting={submitting} buttonText="Create Task" />
    </div>
  );
};

export default CreateTask;
