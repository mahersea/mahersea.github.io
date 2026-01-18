export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    const field = err.detail.match(/\(([^)]+)\)/)[1];
    return res.status(400).json({
      error: `${field} already exists`
    });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Referenced resource does not exist'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};
