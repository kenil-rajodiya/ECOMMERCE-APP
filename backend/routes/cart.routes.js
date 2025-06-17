import { Router } from 'express'
import { updateCart, getUserCart, addToCart } from '../controllers/cart.controller.js'
import authUser from '../middleware/auth.js';

const cartRouter = Router();
cartRouter.use(authUser);
cartRouter.route('/get').post(getUserCart)
cartRouter.route('/add').post(addToCart)
cartRouter.route('/update').post(updateCart)

export default cartRouter;