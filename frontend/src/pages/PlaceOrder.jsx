import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    axiosInstance,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [formData, setFromData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFromData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      // console.log(cartItems);
      if (Object.keys(cartItems).length  > 0) {
        for (const items in cartItems) {
          for (const item in cartItems[items]) {
            if (cartItems[items][item] > 0) {
              let itemInfo = structuredClone(
                products.find((product) => product._id === items)
              );
              if (itemInfo) {
                itemInfo.size = item;
                itemInfo.quantity = cartItems[items][item];
                orderItems.push(itemInfo);
              }
            }
          }
        }

        let orderData = {
          address: formData,
          items: orderItems,
          amount: getCartAmount() + delivery_fee,
        };

        switch (method) {
          // api call for cod method
          case "cod":
            const response = await axiosInstance.post(
              "/api/order/place",
              orderData,
              { headers: { token } }
            );

            if (response.data.success) {
              console.log(response);
              setCartItems({})
              navigate('/orders')
            } else {
              toast.error(response.data.message)
            }


            break;

          default:
            break;
        }
      } else {
        toast.error("Select Items for placing order");
      }

    } catch (error) {
      console.log(error.message);
      toast.error(error.message)
      
      
    }
    
  }


  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t ">
      {/* Left side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            type="text"
            onChange={onChangeHandler}
            value={formData.firstName}
            name="firstName"
            placeholder="First Name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            type="text"
            value={formData.lastName}
            onChange={onChangeHandler}
            name="lastName"
            placeholder="Last Name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          type="email"
          value={formData.email}
          onChange={onChangeHandler}
          name="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          required
          value={formData.street}
          type="text"
          onChange={onChangeHandler}
          name="street"
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex gap-3">
          <input
            required
            value={formData.city}
            type="text"
            name="city"
            onChange={onChangeHandler}
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            value={formData.state}
            type="text"
            onChange={onChangeHandler}
            name="state"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            value={formData.zipCode}
            type="number"
            onChange={onChangeHandler}
            name="zipCode"
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            value={formData.country}
            type="text"
            onChange={onChangeHandler}
            name="country"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          value={formData.phone}
          onChange={onChangeHandler}
          name="phone"
          type="number"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* Right side */}

      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12 ">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* Payment method selection */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p
                onClick={() => setMethod("stripe")}
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.stripe_logo} alt="" className="h-5 mx-4" />
            </div>
            <div className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p
                onClick={() => setMethod("razorpay")}
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
            </div>
            <div className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p
                onClick={() => setMethod("cod")}
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8 ">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm "
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
