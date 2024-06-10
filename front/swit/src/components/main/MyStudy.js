import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

//스터디예시
import study1 from "../../img/banner2.jpg";
import roundGradient from "../../img/Rectangle23.png";

const MyStudy = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    centerMode: false,
  };

  return (
    <div className="font-GSans">
      <div className="flex justify-center">
        <div className="overflow-hidden px-10 pt-28 pb-10 w-1900">
          <p
            className="mx-24 my-5 text-2xl w-56 py-4 text-center bg-mainBg"
            style={{ backgroundImage: `url(${roundGradient})` }}
          >
            나의 스터디
          </p>
          <Slider {...settings}>
            <div>
              <div className="">
                <img className="w-450 h-96 object-cover" src={study1}></img>
              </div>
            </div>
            <div>
              <div className="">
                <img className="w-450 h-96 object-cover" src={study1}></img>
              </div>
            </div>
            <div>
              <div className="">
                <img className="w-450 h-96 object-cover" src={study1}></img>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};
export default MyStudy;
