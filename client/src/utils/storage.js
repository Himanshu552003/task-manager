// if remember me is checked we save in localStorage
// otherwise sessionStorage (gets cleared when browser closes)

const KEY = "taskflow_user";

export const saveUser = (user, rememberMe) => {
  if (rememberMe) {
    localStorage.setItem(KEY, JSON.stringify(user));
  } else {
    sessionStorage.setItem(KEY, JSON.stringify(user));
  }
};

export const getUser = () => {
  const data = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
};
