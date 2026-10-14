import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center dark:bg-gray-900">
      <h1 className="text-7xl font-bold text-indigo-600">404</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Oops! Page not found</p>
      <Link to="/" className="btn-primary mt-6">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
