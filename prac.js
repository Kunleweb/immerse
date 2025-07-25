const express = require('express');
const morgan = require('morgan')
const app = express()
const port = 8000
const fs= require('fs')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tours = JSON.parse(fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`));

// const tourRouter = require(`${__dirname}/routers/tourrouters.js`)


// MIDDLEWARES
app.use(express.json())




if (process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}


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
    next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404))

})



app.use(globalErrorHandler)




module.exports = app;


























