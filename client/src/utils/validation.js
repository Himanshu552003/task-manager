export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// atleast 6 characters with one letter and one number
export const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email";
  if (!password) errors.password = "Password is required";
  return errors;
};

export const validateRegister = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email";

  if (!password) errors.password = "Password is required";
  else if (!isValidPassword(password))
    errors.password = "Min 6 characters with at least one letter and one number";

  if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
  return errors;
};

export const validateTask = ({ title, dueDate, assignedTo }) => {
  const errors = {};
  if (!title.trim()) errors.title = "Title is required";
  else if (title.length > 100) errors.title = "Title is too long (max 100)";
  if (!dueDate) errors.dueDate = "Due date is required";
  if (!assignedTo) errors.assignedTo = "Please select a user";
  return errors;
};
