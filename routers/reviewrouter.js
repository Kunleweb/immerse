
const express = require('express')
const router = express.Router()
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')


router.post('/createReview',  authController.protect,authController.restrictTo('user', 'admin'), reviewController.createReview)
router.get('/getAllReviews',  authController.protect,reviewController.getAllReviews)



module.exports= router 





