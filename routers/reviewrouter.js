
const express = require('express')

const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const router = express.Router({mergeParams:true});

router.use(authController.protect)

router.route('/')
.post(authController.restrictTo('user', 'admin'), reviewController.setTourUserIds, reviewController.createReview)
.get(reviewController.getAllReviews)


router.route('/tours/:id').delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview).patch(authController.restrictTo('user', 'admin'), reviewController.updateReview).get(reviewController.getReview)


module.exports= router 





