import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext.jsx'
import Title from './Title';
import ProductItem from './ProductItem';
const BestSeller = () => {
  const { products } = useContext(ShopContext);

  
  const [bestSeller, setBestSeller] = useState([]);
    useEffect(() => {
      setBestSeller(products.filter((item) => {
        return item.bestSeller;
      }).slice(0, 5));
        
    }, [products])
  
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam nostrum
          ipsum quo, minus eum dolorum asperiores assumenda id sit. Incidunt
          eligendi totam pariatur sunt facere praesentium quidem in voluptas!
          Provident.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => {      
          return (
            <ProductItem
              key={index}
              id={item._id}
              images={item.images}
              name={item.name}
              price={item.price}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BestSeller
