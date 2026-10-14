import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/tasks", label: "All Tasks", icon: "📋" },
  { to: "/tasks/new", label: "Create Task", icon: "➕" },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* dark background on mobile when sidebar is open */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose}></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 transform bg-indigo-700 text-white transition-transform duration-200 dark:bg-gray-800 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <h1 className="text-xl font-bold">✅ TaskFlow</h1>
          <button onClick={onClose} className="text-2xl md:hidden">
            &times;
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
