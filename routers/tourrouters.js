
const express = require('express')
// const fs = require('fs');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));
const router = express.Router();
const tourController = require('./../controllers/tourController.js')
const authController = require('./../controllers/authController.js')


// router.param('id', tourController.checkID )


// Create a checkbody middleware
// Check if body contains the name and price property
// if not, send back 400 (bad request)
// Add it to the post handler stack
router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAlltours)


router.route('/tourstats')
.get(tourController.getTourStats)

router.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan)

router.route('/')
.get(authController.protect, tourController.getAlltours)
.post(tourController.addtour);

router.route('/:id')
.get(tourController.gettour)
.patch(tourController.updatetour)   
.delete(authController.protect, authController.restrictTo('admin', 'lead-gudie'), tourController.deletetour)


module.exports = router