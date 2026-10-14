// handles routes that dont exist
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
};

// common error handler
const errorHandler = (err, req, res, next) => {
  console.log("Error:", err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // wrong mongo id
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id";
  }

  // mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // duplicate key (email already exists)
  if (err.code === 11000) {
    statusCode = 400;
    message = "User with this email already exists";
  }

  // invalid json body
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };
