const express = require('express');
const morgan = require('morgan')
const app = express()
const port = 8000
const fs= require('fs')
const tours = JSON.parse(fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`));

// const tourRouter = require(`${__dirname}/routers/tourrouters.js`)


// MIDDLEWARES
app.use(express.json())




if (process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}

app.use((req,res,next) =>{
    console.log('Hello from the middleware'); 
    next()
})
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next(); 
})


// ROute 

const tourRouter = require('./routers/tourrouters');
const userRouter = require('./routers/userRouters')


// ROUTES

app.use('/api/v1/tours',  tourRouter)
app.use('/api/v1/users',  userRouter)
app.use(express.static(`${__dirname}/starter/public`))

app.all('*', (req,res,next)=>{
    // res.status(404).json({status: 'fail', message: `Cant find ${req.originalUrl} on tbis server!`})

    const err = new Error(`Cant find ${req.originalUrl} on tbis server!`);
    err.status = 'fail';
    err.statusCode = 404;

// Why have we passed err into next function
    next(err)

})



app.use((err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
res.status(err.statusCode).json({status:err.status, message:err.message})

})




module.exports = app;


























