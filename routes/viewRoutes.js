const express = require('express')
const viewController = require('../controllers/viewController')
const authController = require('../controllers/authController')
//Very Important to make mapbox work alongside helmet
const CSP = 'Content-Security-Policy';
const POLICY =
  "default-src 'self' https://*.mapbox.com ;" +
  "base-uri 'self';block-all-mixed-content;" +
  "font-src 'self' https: data:;" +
  "frame-ancestors 'self';" +
  "img-src http://localhost:8000 'self' blob: data:;" +
  "object-src 'none';" +
  "script-src https: cdn.jsdelivr.net cdnjs.cloudflare.com api.mapbox.com 'self' blob: ;" +
  "script-src-attr 'none';" +
  "style-src 'self' https: 'unsafe-inline';" +
  'upgrade-insecure-requests;';

const viewRouter = express.Router()

viewRouter.use((req, res, next) => {
    res.setHeader(CSP, POLICY);
    next();
});

viewRouter.use(authController.isLoggedIn)

//This is for the overview page 
viewRouter.get('/',viewController.getOverview)

//This is when enquiring for a specific tour
viewRouter.get('/tour/:id',viewController.getTour)

//This is the login Point
viewRouter.get('/login',viewController.loginUser)

module.exports = viewRouter