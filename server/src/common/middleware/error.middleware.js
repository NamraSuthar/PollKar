function notFoundHandler(req, res, next) {
    res.status(404).json({ 
        success: false,
        message: `Route not found: ${req.originalUrl}`
     });
}


function errorHandler(err, req, res, next) {
   const statusCode = err.statusCode || 500;

   if(process.env.NODE_ENV !== 'test') {
       console.error(err);
   }

   res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : err.message
   });
}

export { notFoundHandler, errorHandler };