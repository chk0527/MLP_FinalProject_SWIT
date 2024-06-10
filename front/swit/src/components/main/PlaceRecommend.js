import { getPlaceDetail } from "../../api/PlaceApi";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";
//배너 배경

import banner2 from "../../img/banner2.jpg";
import banner3 from "../../img/banner3.jpg";
import roundGradient from "../../img/Rectangle23.png";

const initState = {
  placeNo: 0,
  placeName: "",
  placeAddr: "",
  placeTime: "",
  placeTel: "",
  placeDetail: "",
  placeImg: "",
};

const PlaceRecommend = () => {
  const [place1, setPlace1] = useState(initState);
  const [place2, setPlace2] = useState(initState);
  const [place3, setPlace3] = useState(initState);
  useEffect(() => {
    getPlaceDetail(1).then((data) => {
      setPlace1(data);
    });
    getPlaceDetail(96).then((data) => {
      setPlace2(data);
    });
    getPlaceDetail(134).then((data) => {
      setPlace3(data);
    });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,


    appendDots: (dots) => (
      <div
        style={{
          width: "100%",
          bottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ul> {dots} </ul>
      </div>
    ),
    dotsClass: "dots_custom",
  };

  return (
    <div className="font-GSans">
      <div className="flex justify-center">
        <div className="overflow-hidden px-10 pb-10 w-1900">
          <p
            className="mx-24 my-5 text-2xl w-56 py-4 text-center bg-mainBg"
            style={{ backgroundImage: `url(${roundGradient})` }}
          >
            장소 추천
          </p>
          <Slider {...settings}>
            <div>
              <div className="flex justify-between">
                <img
                  className="w-650 h-96 object-cover"
                  src={place3.placeImg}
                ></img>
                <div className="relative w-1000 p-10">
                  <div className="text-5xl pb-10">
                    나랑 새로 생긴 스터디카페에서 공부할 사람
                  </div>
                  <div className="text-3xl leading-relaxed ">
                    <p>깨끗하고 예쁜곳에서 다같이 공부하자</p>
                    <p> #서울 #감성 #쾌적</p>
                  </div>
                  <Link
                    to={{ pathname: `/place/read/${place3.placeNo}` }}
                    state={1}
                  >
                    <div className="absolute bottom-10 right-10 text-2xl text-black bg-gray-100 px-8 py-3 rounded">
                      보러가기
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <img
                  className="w-650 h-96 object-cover"
                  src={place3.placeImg}
                ></img>
                <div className="relative w-1000 p-10">
                  <div className="text-5xl pb-10">
                    나랑 새로 생긴 스터디카페에서 공부할 사람
                  </div>
                  <div className="text-3xl leading-relaxed ">
                    <p>깨끗하고 예쁜곳에서 다같이 공부하자</p>
                    <p> #서울 #감성 #쾌적</p>
                  </div>
                  <Link
                    to={{ pathname: `/place/read/${place3.placeNo}` }}
                    state={1}
                  >
                    <div className="absolute bottom-10 right-10 text-2xl text-black bg-gray-100 px-8 py-3 rounded">
                      보러가기
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div>dfs</div>
          </Slider>
        </div>
      </div>
    </div>
  );
};
export default PlaceRecommend;
