// we want to inherit from the built in error class that is why we use extends 
// we pass two parameters into constructor which is what we would want to use when create a new
// object from the AppError class
// we use super to call the parent built in class and pass in message since it is the only parameter
// that the built in error accepts
// we set our status code and status
// sp bascially since the no in statuscode means something we do not need a status
//  instead we check what the no starts with if 4 fail otherwise it is an error
//  We set isoperational error, so we can have is operational property
// we need to capture the stack trace 

class AppError extends Error {
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail': 'error';
        this.isOperational = true;


        // blackbox code
        Error.captureStackTrace(this, this.constructor)

    }
}



module.exports = AppError;