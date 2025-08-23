const AppError = require("../utils/appError")

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};


const handleDuplicateFieldsDB = err =>{
    const value= err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: x. Please use another value!`
    return new AppError(message, 400);
}


const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};


const handleJWTError = err => new AppError('Invalid Token. Please log in again', 401)

const sendErrorDev = (err, req, res) => {
    // API
    if(req.originalUrl.startsWith('/api')){
        res.status(err.statusCode).json({status:err.status, message:err.message, 
            error: err, stack: err.stack
        })
    }
    else{
        // rendered website
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!', msg:err.message
        })
    }
}


const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};



module.exports= (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development'){
       sendErrorDev(err,req, res)} 
       
    else if (process.env.NODE_ENV === 'production'){
        
        if(err.name === 'CastError') err =handleCastErrorDB(err);
        if(err.code === 11000) err = handleDuplicateFieldsDB(err); 
        if(err.name === 'ValidationError') err = handleValidationErrorDB(err);
        if(err.name === 'JsonWebTokenError') err = handleJWTError(err)
        sendErrorProd(err,req, res)} ;
    }



// module.exports= (err, req, res, next)=>{
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';
    
// res.status(err.statusCode).json({status:err.status, message:err.message})
// }




