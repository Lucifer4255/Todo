const AppError = require('./../utils/AppError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message,400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    
    const message = `Duplicate field value: ${value}. Please use another value`;
    
    return new AppError(message,400);
    
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    
    const message = `Invalid input data.${errors.join('. ')}`;
    return new AppError(message,400);

}

const handleJWTError = () =>{
    return new AppError("Invalid Token.Please Log in again!",401);
} 

const handleJWTExpiredError = ()=>{
    return new AppError("Your Token has expired. Please log in again.",401); 
}

const sendError = (err,res) =>{
    if(err.isOperational){
        console.log(err);
        res.status(err.statusCode).json({
            status:err.status,
            error:err,
            message:err.message,
            stack:err.stack
        })
    }
    else{
        console.log("Error",err);

        res.status(500).json({
            status:'error',
            message:err.message,
            
        })
    }
}

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if(error.name === 'JsonWebTokenError')
        error = handleJWTError();
    if(error.name === 'TokenExpiredError')
        error = handleJWTExpiredError();

    sendError(error, res);
}