const Loader = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen bg-gray-100 dark:bg-gray-900" : "py-10"
      }`}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
    </div>
  );
};

export default Loader;
