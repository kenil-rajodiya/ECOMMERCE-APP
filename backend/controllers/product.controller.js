import {v2 as cloudinary} from 'cloudinary'
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { isValidObjectId } from 'mongoose';

// function for add product
const addProduct = async (req,res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

        if ([name, description, price, category, subCategory, sizes].some((field) => !field.trim() || field === '')) {
            throw new ApiError(400,"These fields are required: name, description, price, category, subCategory, sizes")
        }


        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item!== undefined)
        // console.log(images);
        if (images.length <= 0) {
            throw new ApiError(400,"Atleast one image is required.")
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url;
            })
        ).catch((err) => {
                throw new ApiError(400 , "Error while uploading images on cloudinary.");
            
        })

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === 'true' ? true : false,
            sizes:JSON.parse(sizes),
            category,
            images: imagesUrl,
            date:Date.now()
        })

        if (!product) {
            throw new ApiError(400,"Error while creating new product in database.")
        }
        
        return res.status(200).json(new ApiResponse(200,product , "New product added successfully."))
        
    } catch (error) {
        console.log(error);
        return;
        
    }
}


// function for List of products
const listProducts = async (req, res) => {
    
    try {
        const products = await Product.find({});
        if (!products) {
            throw new ApiError(400, "Error while fetching product list.");
        }

        return res.status(200).json(
            new ApiResponse(200,products,"Products list fetched successfully")
        )

    } catch (error) {
        console.log(error);
        return;
        
    }
    
}


// function for removing product
const removeProduct = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        throw new ApiError(400 , "ProductId is required.")
    }
    if (!isValidObjectId(id)) {
        throw new ApiError(400 , "Invalid productId.")
        
    }
    const deletedUser = await Product.findByIdAndDelete({ _id: id });
    if (!deletedUser) {
        throw new ApiError(400 , "Error while deleting Product.")
    }
    
    return res.status(200).json(
        new ApiResponse(200, "Product removed successfully.")
    )
    
}


// function for single product info
const singleProduct = async (req,res) => {
    
    try {
        const { id } = req.body;
        if (!id) {
            throw new ApiError(400, "ProductId is required.")
        }
        if (!isValidObjectId(id)) {
            throw new ApiError(400, "Invalid productId.")
        }
        const product = await Product.findById({ _id: id });
        if (!product) {
            throw new ApiError(400 , "Error while Fetching Product.")
        }
        return res.status(200).json(
            new ApiResponse(200,product , "Product information fetched successfully")
        )

    } catch (error) {
        return res.status(400).json({
            success: false,
            message : error.message
        })
    }
}

export { addProduct, listProducts, removeProduct, singleProduct }