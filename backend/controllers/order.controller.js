import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import orderRouter from "../routes/order.routes.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Placing order using COD method
const placeOrder = async (req,res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            paymentMethod: "COD",
            payment: false,
            date : Date.now(),
            address
        }
        const newOrder = Order.create(orderData);
        if (!newOrder) {
            throw new ApiError(400,"Error while creating new order!")
        }
        await User.findByIdAndUpdate(userId,{cartData:{}})
        return res.status(200).json(
            new ApiResponse(200,newOrder,"New COD order placed successfully!")
        )
    
    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);
        
    }
}

// Placing order using stripe method
const placeOrderStripe = async (req,res) => {

}


// Placing order using Razorpay method
const placeOrderRazorpay  = async (req,res) => {

}

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const allorders = await Order.find({});
        if (!allOrders) {
            throw new ApiError(400, "Error while fetching all orders.")
        }
        return res.status(200).json(
            new ApiResponse(200 , allorders , "All orders fetched successfully.")
        )
    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);
                
    }
}

// user orders Data for frontend
const userOrders = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        throw new ApiError(400, "Unauthorized user Login again")
    }
    let array = [];
    const orders = await Order.find({ userId });

    return res.status(200).json(
        new ApiResponse(200 , orders , "Orders fetched successfully.")
    )
}

// update order status from admin panel
const updateStatus = async (req, res) => {
try {
    const { orderId, status } = req.body;
    const response = await Order.findByIdAndUpdate(orderId, { status });
    res.json(
        new ApiResponse(200 , response,"Order status updated successfully.")
    )
} catch (error) {
    console.log(error.message);
    throw new ApiError(400 , error.message)
    
}
    
}

export { placeOrder, placeOrderRazorpay, placeOrderStripe, userOrders, allOrders, updateStatus };