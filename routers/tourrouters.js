
const express = require('express')
// const fs = require('fs');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));
const router = express.Router();
const tourController = require('./../controllers/tourController.js')
const authController = require('./../controllers/authController.js')
const reviewrouter = require('./reviewrouter.js')

// router.param('id', tourController.checkID )
router.use('/:tourId/reviews', reviewrouter)



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
.get(tourController.getAlltours)
.post(authController.protect, authController.restrictTo('admin', 'lead-guide') , tourController.addtour);

router.route('/:id')
.get(tourController.gettour)
.patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updatetour)   
.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deletetour)


// router.route('/:tourId/reviews')
// .post(
//     authController.protect,
//     reviewController.createReview
// )




module.exports = router