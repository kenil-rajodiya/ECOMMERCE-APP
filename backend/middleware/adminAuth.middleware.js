import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js';
const adminAuth = async (req,res,next) => {
    try {
        const { token } = req.headers;
        // console.log(token);
        
        if (!token) {
            throw new ApiError(400,"Not authorized Admin.")
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedToken);
        
        if (decodedToken !== `${process.env.ADMIN_EMAIL}${process.env.ADMIN_PASSWORD}`) {
            throw new ApiError(400,"Not authorized Admin.")
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(400).json(
            {
                message : error.message
            }
        )
        
    }    
}

export default adminAuth;