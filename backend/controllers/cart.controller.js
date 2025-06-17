import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid objecId");
        }
        if (!itemId || !size) {
            throw new ApiError(40, "Both ItemId and size are required.")
        }
        const userData = await User.findById(userId);
        let cartData = userData.cartData;

        if(cartData[itemId]){
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        }else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { cartData: cartData }, {new : true} );

        if (!updatedUser) {
            throw new ApiError(400, "Error while adding item to cart.")
        }

        return res.status(200).json(
            new ApiResponse(200, updatedUser, "Item added to cart successfully.")
        )

    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);


    }
}


// Update  user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid objecId");
        }

        if (!itemId || !size || !quantity && quantity!=0) {
            throw new ApiError(40, " ItemId , quantity and size are required.")
        }

        const user = await User.findById(userId);
        const cartData = {...user.cartData};
        // console.log(cartData);
        if (!cartData[itemId]) {
            cartData[itemId] ={}
        }
        if (quantity <= 0) {
            delete cartData[itemId][size];

            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]
            }
        } else {
            cartData[itemId][size] = quantity;
        }
        
        // cartData[itemId][size] = quantity;
        const updatedUser = await User.findByIdAndUpdate(userId, { cartData }, { new: true, projection: { cartData: 1, _id: 0 } });
        if (!updatedUser) {
            throw new ApiError(400, "Error while adding item to cart.")
        }

        return res.status(200).json(
            new ApiResponse(200, updatedUser, " cart updated successfully.")
        )

    } catch (error) {
        console.log(error);
        throw new ApiError(400 , error.message)
        
    }

}
// get  user cart
const getUserCart = async (req, res) => {
try {
        const { userId } = req.body;
        if (!userId) {
            throw new ApiError(400 , "UserId is required.")
        }
        if (!isValidObjectId(userId)) {
            throw new ApiError(400 , "Invalid objectId")
        }
    
        const cartData = await User.findById(userId, { cartData: 1, _id: 0 })
        
        if (!cartData) {
            throw new ApiError(400 , "Error while fetching usercart data.")
        }
        return res.status(200).json(
            new ApiResponse(200 , cartData ,"User cartdata fetched successfully")
        )
    
} catch (error) {
    console.log(error);
    throw new ApiError(400 , error.message)
    
}
}

export { addToCart, getUserCart, updateCart };