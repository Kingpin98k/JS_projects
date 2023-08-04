const express = require('express')
const viewController = require('../controllers/viewController')

const viewRouter = express.Router()

//This is for the overview page 
viewRouter.get('/',viewController.getOverview)

//This is when enquiring for a specific tour
viewRouter.get('/tour/:id',viewController.getTour)

module.exports = viewRouter