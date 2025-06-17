import jwt, { decode } from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js';
const authUser = async (req, res, next) => {
    const token = req.headers.token;
    // console.log(token);
    
    if ( token === undefined || token === null ) {
        throw new ApiError(400, "Not Authorized. Login again");
    }
      

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedToken);
        
        req.body.userId = decodedToken.id;
        next();

    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message);
    }

    
}

export default authUser;