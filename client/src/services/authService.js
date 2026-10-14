import api from "./api";

const login = async (data) => {
  const res = await api.post("/login", data);
  return res.data;
};

const register = async (data) => {
  const res = await api.post("/register", data);
  return res.data;
};

const authService = { login, register };
export default authService;
