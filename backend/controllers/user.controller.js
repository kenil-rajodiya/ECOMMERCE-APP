import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const createToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(400, "All fields are required")
        }
        let user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, "User doesn't exists with this EmailId.")
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            throw new ApiError(400, "Password is wrong!")
        }

        if (matchPassword) {
            const token = await createToken(user._id);

            return res.status(200).json(
                new ApiResponse(200, token, "User Logged In successfully.")
            )
        }
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Error while logging in",
        });
    }
}

// Route for user Register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        

        if ([name, email, password].some((field) => !field?.trim())) {
            // return res.json({ success: false, message: "All fields are required" });
            throw new ApiError(400, "All fields are required");
        }

        const exists = await User.findOne({ email });
        if (exists) {
            throw new ApiError(400, "User with this emailId exists");
        }
        // validating email format and password
        if (!validator.isEmail(email)) {
            throw new ApiError(400, "Please enter a valid Email")
        }
        if (!validator.isStrongPassword(password)) {
            throw new ApiError(400, "Please enter a strong password")
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const createdUser = await User.create({ name, email, password: hashedPassword });

        if (!createdUser) {
            throw new ApiError(400, "Error while creating new User");
        }

        const token = await createToken(createdUser._id)

        return res.status(200).json(new ApiResponse(200, { user: createdUser, token }, "User registered successfully!"));

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            message: error.message || "Error while registration of user",
        });

    }
}


//Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(400,"Both fields are required.")
            
        }
        
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = await jwt.sign(`${process.env.ADMIN_EMAIL}${process.env.ADMIN_PASSWORD}`, process.env.JWT_SECRET)
            // console.log(token);
            
            return res.status(200).json(
                new ApiResponse(200,token,"Admin loggedin successfully")
            )
        } else {
            throw new ApiError(400,"Admin fields are not matching.")
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

export { loginUser, registerUser, adminLogin };