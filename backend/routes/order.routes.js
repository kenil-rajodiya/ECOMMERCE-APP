import express from 'express';
import {
    allOrders,
    placeOrder,
    placeOrderRazorpay,
    placeOrderStripe,
    updateStatus,
    userOrders
} from '../controllers/order.controller.js';

import adminAuth from '../middleware/adminAuth.middleware.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.route('/list')
    .post(adminAuth, allOrders);

orderRouter.route('/status')
    .post(adminAuth, updateStatus);

// Payment Features
orderRouter.route('/place')
    .post(authUser, placeOrder);

orderRouter.route('/stripe')
    .post(authUser, placeOrderStripe);

orderRouter.route('/razorpay')
    .post(authUser, placeOrderRazorpay);

// User Features
orderRouter.route('/userorders')
    .post(authUser, userOrders);

export default orderRouter;
