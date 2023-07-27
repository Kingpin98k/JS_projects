const express = require('express')

const reviewController = require('../controllers/reviewController')

const authController = require('../controllers/authController')

const ReviewRouter = express.Router()

ReviewRouter.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect,reviewController.createNewReview)

module.exports = ReviewRouter