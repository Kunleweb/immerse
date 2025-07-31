const express = require('express');
const morgan = require('morgan')
const app = express()
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const port = 8000
const fs= require('fs')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tours = JSON.parse(fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`));

// const tourRouter = require(`${__dirname}/routers/tourrouters.js`)


// MIDDLEWARES
// Security HTTP Headers
app.use(helmet())




// Rate limiting 

const limiter = rateLimit({
    max:100, 
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this ip, try again after an hours'



})

app.use('/api', limiter)


// Environment logging
if (process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}
// Body Parser, reading data from the body into req.body
app.use(express.json());

// Test Middlewares
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next(); 
})


app.use(hpp(
    {
        whitelist: ['duration', 'ratingsQuantity','maxGroupSize', 'difficulty', 'price']
    }
))

// ROute 

const tourRouter = require('./routers/tourrouters');
const userRouter = require('./routers/userRouters')


// ROUTES

app.use('/api/v1/tours',  tourRouter)
app.use('/api/v1/users',  userRouter)




// Data sanitization against noSQL query injection
// removes all the dollar signs and dots 
app.use(mongoSanitize());
// Data sanitization against xss attacks
app.use(xss())



// Serving Static files
app.use(express.static(`${__dirname}/starter/public`))


app.all('*', (req,res,next)=>{
    next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404))

})



app.use(globalErrorHandler)




module.exports = app;


























