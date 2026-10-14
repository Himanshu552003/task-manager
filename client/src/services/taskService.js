import api from "./api";

const getTasks = async (params) => {
  const res = await api.get("/tasks", { params });
  return res.data;
};

const getTask = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

const getStats = async () => {
  const res = await api.get("/tasks/stats");
  return res.data;
};

const createTask = async (data) => {
  const res = await api.post("/tasks", data);
  return res.data;
};

const updateTask = async (id, data) => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
};

const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};

const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

const taskService = { getTasks, getTask, getStats, createTask, updateTask, deleteTask, getUsers };
export default taskService;
