const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.statusCode ? err.message : "Internal server error.";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}.`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value.";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
