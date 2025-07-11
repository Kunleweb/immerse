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


module.exports = app;


























