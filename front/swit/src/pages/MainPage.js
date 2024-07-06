import React, { useEffect, useState } from "react";
import BasicLayout from "../layouts/MainLayout";
import BannerComponent from "../components/main/BannerComponent";
import PlaceRecommend from "../components/main/PlaceRecommend";
import BoardRecommend from "../components/main/BoardRecommend";
import MyStudy from "../components/main/MyStudy";
import "../components/main/Banner.css";
import arrow from "../img/thearrow.png"

const MainPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 페이지가 스크롤될 때 호출되는 함수
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <BasicLayout>
      <BannerComponent />
      <MyStudy />
      <PlaceRecommend />
      <BoardRecommend />
      {isVisible && (
        <button onClick={scrollToTop} className="z-20 w-20 font-blackHans bg-white rounded-full fixed bottom-16 right-16">
          <img src={arrow}/>
        </button>
      )}
    </BasicLayout>
  );
};



export default MainPage;
