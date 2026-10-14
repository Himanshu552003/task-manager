import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../store/authSlice";
import useDarkMode from "../hooks/useDarkMode";

const Navbar = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-2xl text-gray-600 dark:text-gray-300 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
        <p className="hidden text-gray-600 dark:text-gray-300 sm:block">
          Welcome back, <span className="font-semibold text-gray-800 dark:text-white">{user?.name}</span> 👋
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="rounded-full p-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-medium text-gray-800 dark:text-white">{user?.name}</p>
            <p className="text-xs capitalize text-gray-500 dark:text-gray-400">{user?.role}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="btn-secondary !px-3 !py-1.5">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
