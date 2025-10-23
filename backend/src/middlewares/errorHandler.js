export function notFound(req, res, next) {
  res.status(404).json({ error: "Not Found" });
}

export function errorHandler(err, req, res, next) {
  console.error("API ERROR:", {
    message: err.message,
    code: err.code,
    sqlMessage: err.sqlMessage,
    sqlState: err.sqlState,
    stack: err.stack
  });
  res.status(500).json({
    error: err.sqlMessage || err.message || "Internal Server Error",
    code: err.code
  });
}
