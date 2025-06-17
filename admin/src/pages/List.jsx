import axios from "axios";
import React, { useEffect, useState } from "react";
import { axiosInstance, currency } from "../App.jsx";
import { toast } from "react-toastify";

const List = ({token}) => {
    const [list, setList] = useState([]);
    useEffect(() => {
        ; (async() => {
            try {
                const response = await axiosInstance.get("/product/list");
    
                if (response?.data?.success) {
                    setList(response.data.data);
                    console.log
                    (response.data);
                } else {
                    toast.error(response?.data.message);
                }
            } catch (error) {
                toast.error("Error");
            }

        })()
    }, [])
    
    const removeProduct = async (id) => {
        try {

            const response = await axiosInstance.post('/product/remove', {id}, {
                headers: {
                    token:token
                }
            });

            if (response.data.success) {
                toast.success("Product removed successfully.")
            } else {
                toast.error(response.data.message)
                
            }
            
            
        } catch (error) {
            toast.error(response.data.message)
            
        }
        
    }
    return (
    <>
        <p className="mb-2 ">All Products List</p>
        <div className="flex flex-col gap-2">
            {/* List Table Title  */}
            <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
                <b>Image</b>
                <b>Name</b>
                <b>Category</b>
                <b>Price</b>
                <b className="text-center">Action</b>
                </div>
                

                {/* Product list */}
                {
                    list.map((item,index) => {
                       return (
                         <div
                           className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm "
                           key={index}
                         >
                           <img className="w-12" src={item.images[0]} alt="" />
                           <p>{item.name}</p>
                           <p>{item.category}</p>
                           <p>
                             {currency}
                             {item.price}
                           </p>
                           <p
                             onClick={() => removeProduct(item._id)}
                             className="text-right md:text-center cursor-pointer text-lg"
                           >
                             X
                           </p>
                         </div>
                       );
                    })
                }
        </div>
      
  </>)
};

export default List;
