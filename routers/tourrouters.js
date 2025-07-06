
const express = require('express')
// const fs = require('fs');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));
const router = express.Router();
const tourController = require('./../controllers/tourController.js')



// router.param('id', tourController.checkID )


// Create a checkbody middleware
// Check if body contains the name and price property
// if not, send back 400 (bad request)
// Add it to the post handler stack


router.route('/')
.get(tourController.getAlltours)
.post(tourController.addtour);

router.route('/:id')
.get(tourController.gettour)
.patch(tourController.updatetour)   
.delete(tourController.deletetour)


module.exports = router