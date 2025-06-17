import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {ShopContext} from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
const Product = () => {
  const { productId } = useParams();
  // console.log(productId);
  const { products, currency, addToCart, axiosInstance } =
    useContext(ShopContext);
  const [productData, setProductData] = useState({});
  const [isFetched, setIsFetched] = useState(false);

  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const fetchProductData = async () => {
    try {
      const response = await axiosInstance.post('/api/product/single',
        { id: productId }
      );
      setProductData(response.data.data);
      if (response.data.success) {
        setImage(response.data.data.images[0]);
        setIsFetched(true)

      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
    


  }
  useEffect(() => {
    fetchProductData()
  },[productId])

  return isFetched ? (
    <div className="border-t-2  pt-10 transition-opacity ease-in duration-500 opacity-100 ">
      {/* {console.log(productData)} */}
      {/* Product data */}
      <div className="flex gap-4 sm:gap-12 flex-col sm:flex-row ">
        {/* Product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row ">
          <div
            className="flex sm:flex-col  overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full 
          sm:w-[18.7%]"
          >
            {productData.images.map((item, index) => {
              return (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  alt=""
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                />
              );
            })}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        {/* Product details */}
        <div className="flex-1 ">
          <h1 className="font-medium text-2xl mt-2 ">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_icon} alt="" />
            <img className="w-3.5" src={assets.star_dull_icon} alt="" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5 ">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, idx) => (
                <button
                  onClick={() => setSize(item)}
                  className={`  py-2 cursor-pointer px-4 bg-gray-100 ${
                    item === size ? "border-orange-500 border" : ""
                  }`}
                  key={idx}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>
          <button onClick={() => addToCart(productData._id , size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5
          ' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1 '>
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange poicy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* Description and review section */}
      <div className='mt-20'>
        <div className='flex '>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero libero consequuntur, nisi accusamus id optio quae ipsam a repudiandae dolorem ipsum quasi fugiat provident odit, distinctio exercitationem aliquid illum voluptatibus!</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Adipisci quod tempora aut, magnam odio accusantium recusandae impedit iusto, deserunt rem neque molestiae illum unde error! Doloremque dolorum id saepe hic?</p>
        </div>
      </div>

      {/* Related products */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
}

export default Product
