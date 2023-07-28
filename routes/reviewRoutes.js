const express = require('express')

const reviewController = require('../controllers/reviewController')

const authController = require('../controllers/authController')

const ReviewRouter = express.Router({mergeParams:true})

ReviewRouter.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect,reviewController.createNewReview)

ReviewRouter.route('/:id')
.delete(reviewController.deleteReview)

module.exports = ReviewRouter