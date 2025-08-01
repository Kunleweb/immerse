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

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({status:err.status, message:err.message, 
            error: err, stack: err.stack
        })}


const sendErrorProd = (err, res) =>{
    if (err.isOperational){
            res.status(err.statusCode).json({status:err.status, message:err.message})}
           else{
            console.error('ERROR', err)
                res.status(500).json({status:'error💥', message:'something went very wrong'})
           }  
    
}


module.exports= (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development'){
       sendErrorDev(err, res)} 
       
    else if (process.env.NODE_ENV === 'production'){
        
        if(err.name === 'CastError') err =handleCastErrorDB(err);
        if(err.code === 11000) err = handleDuplicateFieldsDB(err); 
        if(err.name === 'ValidationError') err = handleValidationErrorDB(err);
        if(err.name === 'JsonWebTokenError') err = handleJWTError(err)
        sendErrorProd(err, res)} ;
    }



// module.exports= (err, req, res, next)=>{
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';
    
// res.status(err.statusCode).json({status:err.status, message:err.message})
// }




