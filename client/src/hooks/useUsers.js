import { useState, useEffect } from "react";
import taskService from "../services/taskService";
import { getErrorMessage } from "../services/api";

// gets list of users for the "assign to" dropdown
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    taskService
      .getUsers()
      .then((data) => {
        if (!ignore) setUsers(data);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { users, loading, error };
};

export default useUsers;
