import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsletterBox from "../components/NewsletterBox";
const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6  md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus,
            suscipit omnis libero veniam ad, quos ratione
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
            dolorum excepturi fuga, explicabo, possimus sint
          </p>
          <b className="text-gray-800 ">Our Mission</b>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae
            consequatur voluptas doloribus recusandae
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            adipisci libero facilis modi repellat. Ne! Labore id a distinctio
            tempora exercitationem.
          </p>
        </div>
        <div className="border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            adipisci libero facilis modi repellat. Numquam eveniet,
            exercitationem fugit .
          </p>
        </div>
        <div className="border border-gray-300 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            adipisci libero facilis modi repellat. Numquam eveniet,
            exercitationem fugit .
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;
