import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";

import { getPlaceDetail } from "../../api/PlaceApi";

//배너 배경
import banner1 from "../../img/banner1.jpg";
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

const BannerComponent = () => {
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
    appendDots: (dots) => (
      <div
        style={{
          width: "100%",
          position: "absolute",
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
    <div className="w-full overflow-hidden font-GSans">
      <Slider {...settings}>
        {/* banner1 */}
        <div>
          <div
            className="relative w-full h-dvh bg-cover after:content-['*'] after:absolute after:top-0 after:right-0 after:w-full after:h-full after:bg-black after:opacity-80 after:block after:z-10"
            style={{ backgroundImage: `url(${banner1})` }}
          >
            <div className="absolute pt-64 p-16 flex justify-center z-20 text-white w-full h-full">
              {/* 스터디 장소 추천 */}
              <div className="w-full relative">
                <img
                  className="w-full h-550 object-cover"
                  src={place1.placeImg}
                ></img>
                <div
                  className="w-56 py-5 mt-4 -ml-4 text-center bg-mainBg text-xl"
                  style={{ backgroundImage: `url(${roundGradient})` }}
                >
                  스터디 장소 추천
                </div>
                <div className="text-5xl py-4">
                  나랑 새로 생긴 스터디카페에서 공부할 사람~
                </div>
                <div className="text-3xl leading-relaxed ">
                  <p>깨끗하고 예쁜곳에서 다같이 공부하자</p>
                  <p> #서울 #감성 #쾌적</p>
                </div>
                <Link to={{ pathname: `/place/read/${place1.placeNo}` }} state={1}>
                  <div className="absolute bottom-0 right-0 text-2xl text-black bg-gray-100 px-8 py-3 rounded">
                    보러가기
                  </div>
                </Link>
              </div>
              {/* 중앙선 */}
              <div>
                <div className="w-1 mx-16 h-full bg-gray-500/30" />
              </div>
              {/* 명언?기타? */}
              <div className="w-full relative">
                <div></div>
              </div>
            </div>
          </div>
        </div>

        {/* banner2 */}
        <div>
          <div
            className="relative w-full h-dvh bg-cover after:content-['*'] after:absolute after:top-0 after:right-0 after:w-full after:h-full after:bg-black after:opacity-80 after:block after:z-10"
            style={{ backgroundImage: `url(${banner2})` }}
          >
            <div className="absolute pt-64 p-16 flex justify-center z-20 text-white w-full h-full">
              {/* 스터디 장소 추천 */}
              <div className="w-full relative">
                <img
                  className="w-full h-550 object-cover"
                  src={place2.placeImg}
                ></img>
                <div
                  className="w-56 py-5 mt-4 -ml-4 text-center bg-mainBg text-xl"
                  style={{ backgroundImage: `url(${roundGradient})` }}
                >
                  스터디 장소 추천
                </div>
                <div className="text-5xl py-4">
                  나랑 새로 생긴 스터디카페에서 공부할 사람~
                </div>
                <div className="text-3xl leading-relaxed ">
                  <p>깨끗하고 예쁜곳에서 다같이 공부하자</p>
                  <p> #서울 #감성 #쾌적</p>
                </div>
                <Link to={{ pathname: `/place/read/${place2.placeNo}` }} state={1}>
                  <div className="absolute bottom-0 right-0 text-2xl text-black bg-gray-100 px-8 py-3 rounded">
                    보러가기
                  </div>
                </Link>
              </div>
              {/* 중앙선 */}
              <div>
                <div className="w-1 mx-16 h-full bg-gray-500/30" />
              </div>
              {/* 명언?기타? */}
              <div className="w-full relative"></div>
            </div>
          </div>
        </div>

        {/* banner3 */}
        <div>
          <div
            className="relative w-full h-dvh bg-cover after:content-['*'] after:absolute after:top-0 after:right-0 after:w-full after:h-full after:bg-black after:opacity-80 after:block after:z-10"
            style={{ backgroundImage: `url(${banner3})` }}
          >
            <div className="absolute pt-64 p-16 flex justify-center z-20 text-white w-full h-full">
              {/* 스터디 장소 추천 */}
              <div className="w-full relative">
                <img
                  className="w-full h-550 object-cover"
                  src={place3.placeImg}
                ></img>
                <div
                  className="w-56 py-5 mt-4 -ml-4 text-center bg-mainBg text-xl"
                  style={{ backgroundImage: `url(${roundGradient})` }}
                >
                  스터디 장소 추천
                </div>
                <div className="text-5xl py-4">
                  나랑 새로 생긴 스터디카페에서 공부할 사람~
                </div>
                <div className="text-3xl leading-relaxed ">
                  <p>깨끗하고 예쁜곳에서 다같이 공부하자</p>
                  <p> #서울 #감성 #쾌적</p>
                </div>
                <Link to={{ pathname: `/place/read/${place3.placeNo}` }} state={1}>
                  <div className="absolute bottom-0 right-0 text-2xl text-black bg-gray-100 px-8 py-3 rounded">
                    보러가기
                  </div>
                </Link>
              </div>
              {/* 중앙선 */}
              <div>
                <div className="w-1 mx-16 h-full bg-gray-500/30" />
              </div>
              {/* 명언?기타? */}
              <div className="w-full relative"></div>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default BannerComponent;
