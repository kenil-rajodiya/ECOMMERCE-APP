import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
export const ShopContext = createContext();


export const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10
    // const backend_url = import.meta.env.VITE_BACKEND_URL;
    const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_URL,
    });
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [token , setToken] = useState('')
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        if (!itemId || !size) {
            toast.error("Select product size");
            return;
        }
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                const response = await axiosInstance.post('/api/cart/add', { itemId, size }, { headers: { token } });
                console.log(response);
                
                
            } catch (error) {
                console.log(error.message);
                toast.error(error.message)
                
            }
        }
        
    }
    const updateQuantity = async (itemId , size,quantity) => {
        let cartDataCopy = structuredClone(cartItems);
        cartDataCopy[itemId][size] = quantity;
        setCartItems(cartDataCopy)

        if (token) {
            try {
                const response = await axiosInstance.post('/api/cart/update', { itemId, size, quantity }, { headers: { token } })
                console.log(response);
                
    
            } catch (error) {
                console.log(error);
                toast.error(error.message)
                
            }
            
        }

    } 

    const getCartCount = () => {
        let totalCount = 0;
        // if (token) {
        //     getUserCart(token);
        // }
        for (let items in cartItems) {
            for (let item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }

    const getCartAmount =  () => {
        let totalAmount = 0;
        for (let items in cartItems) {
            // console.log(items);
            
            let itemInfo = products.find((product) => product._id === items);
            // console.log(itemInfo);
            
            for (let item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += (itemInfo.price * cartItems[items][item]);
                    }
                } catch (error) {
                    
                }
            }
        }

        return totalAmount;
    }

    const getProductData = async () => {
    
        try {
            const response = await axiosInstance.get('/api/product/list');
            // console.log(response);
            
            if (response.data.success) {
                setProducts(response.data.data)
            } else {
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
      try {
        const response = await axiosInstance.post(
          "/api/cart/get",
          {}, // body
          { headers: { token } } // headers
        );

        if (response.data.success) {
          toast.success(response.data.message);
          setCartItems(response.data.data.cartData);
        } else {
          toast.error(response.data.message || "Failed to fetch cart.");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong while fetching cart."
        );
      }
    };
    
   

    useEffect(() => {
        ; (async () => await getProductData())();
        
    }, [])
    
    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem("token"));
            getUserCart(localStorage.getItem('token'))
        }
    },[])



    const value = {
      products,
      currency,
      axiosInstance,
      delivery_fee,
      cartItems,
      search,
      showSearch,
      token,
        getProductData,
        getUserCart,
      setSearch,
      setToken,
      setShowSearch,
      setCartItems,
      addToCart,
      getCartCount,
      updateQuantity,
      getCartAmount,
      navigate,
    };
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
        
    )
}