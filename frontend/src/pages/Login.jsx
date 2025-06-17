import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../context/ShopContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, axiosInstance, getUserCart } =
    useContext(ShopContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // console.log(e.target);
    // console.log(axiosInstance);
    
    
    try {
      console.log(name,email,password);
      
      if (currentState === 'Sign Up') {
        const response = await axiosInstance.post('/api/user/register', {
          "name": name,
          "email": email,
          "password": password,
        },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        if (!response) {
          toast.error(response.response.data.message);
          return;
        } else {
          setToken(response.data.data.token);
          localStorage.setItem("token", response.data.data.token);
          toast.success(response.data.message);
        
          setCurrentState('Login')
        }
        
        
      } else {
        
        const response = await axiosInstance.post('/api/user/login', { email, password })
        // console.log(response.data.data);
        if (response.data.success) {
          setToken(response.data.data);
          localStorage.setItem('token', response.data.data)
          toast.success(response.data.message)

        } else {
          toast.error(response.data.message)
          
        }
        
      }
      
      
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
      getUserCart(token)
  } ,[token])
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px]  w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      )}

      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password? </p>
        {currentState === "Login" ? (
          <p
            className="cursor-pointer"
            onClick={() => setCurrentState("Sign Up")}
          >
            Create Account
          </p>
        ) : (
          <p
            className="cursor-pointer"
            onClick={() => setCurrentState("Login")}
          >
            Login Here
          </p>
        )}
      </div>
      <button className="bg-black  cursor-pointer text-white font-light px-8 py-2 mt-4 ">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
}

export default Login
