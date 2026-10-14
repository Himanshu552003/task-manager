import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { updateTask } from "../store/taskSlice";
import taskService from "../services/taskService";
import { getErrorMessage } from "../services/api";
import TaskForm from "../components/TaskForm";
import Loader from "../components/Loader";

const EditTask = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    taskService
      .getTask(id)
      .then((data) => setTask(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    const result = await dispatch(updateTask({ id, data: formData }));
    setSubmitting(false);

    if (updateTask.fulfilled.match(result)) {
      toast.success("Task updated!");
      navigate(`/tasks/${id}`);
    } else {
      toast.error(result.payload);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="card py-12 text-center">
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <Link to="/tasks" className="btn-primary mt-4 inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Edit Task</h2>
      <TaskForm initialData={task} onSubmit={handleSubmit} submitting={submitting} buttonText="Update Task" />
    </div>
  );
};

export default EditTask;
