const fs = require('fs');
const express = require('express');
const app = express();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`));
const tourRouter = require('./Newproutes/tourRouters')
// Letss create a middle ware here:
app.use(express.json())

// Lets group all the route handlers together and 



//  Lets create routes and route handlers

// app.get('/api/v1/tour', getalltours )
// app.get('/api/v1/tour/:id', gettour)
// app.post('/api/v1/tour', createTour)

app.use('/api/v1/tours ', tourRouter)

app.listen(3000, (req, res) =>{
    console.log('Listening on port 3000')
})