
const express = require('express')

const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const router = express.Router({mergeParams:true});

router.route('/')
.post(authController.protect,authController.restrictTo('user', 'admin'), reviewController.setTourUserIds, reviewController.createReview)
.get(authController.protect, reviewController.getAllReviews)


router.route('/:id').delete(reviewController.deleteReview).patch(reviewController.updateReview).get(reviewController.getReview)


module.exports= router 





