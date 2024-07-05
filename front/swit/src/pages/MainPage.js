import React, { useEffect, useState } from "react";
import BasicLayout from "../layouts/MainLayout";
import BannerComponent from "../components/main/BannerComponent";
import PlaceRecommend from "../components/main/PlaceRecommend";
import BoardRecommend from "../components/main/BoardRecommend";
import MyStudy from "../components/main/MyStudy";

const MainPage = () => {
  const [scrollDisabled, setScrollDisabled] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const enableScroll = () => {
      setScrollDisabled(false);
    };

    setTimeout(enableScroll, 1000); // 1초 후에 스크롤 활성화

    return () => {
      window.removeEventListener("scroll", disableScroll);
    };
  }, []);

  const disableScroll = () => {
    window.scrollTo(0, 0);
  };
  const handleWheel = (event) => {
    if (scrollDisabled) {
      event.preventDefault(); // 스크롤 막기
    }
  };
  useEffect(() => {
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [scrollDisabled]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const defaultHeight = (2.3 * windowHeight) / 5;
      setScrollPosition(position);

      if (position > lastScrollTop) {
        // 스크롤을 내릴 때
        if (position > 2 * windowHeight - defaultHeight) {
          window.scrollTo({
            top: 3 * windowHeight - defaultHeight,
            behavior: "smooth",
          });
        } else if (position > 1 * windowHeight - defaultHeight) {
          window.scrollTo({
            top: 2 * windowHeight - defaultHeight,
            behavior: "smooth",
          });
        } else if (position > 0) {
          window.scrollTo({
            top: windowHeight - defaultHeight,
            behavior: "smooth",
          });
        }
      } else {
        // 스크롤을 올릴 때
        if (position < 1 * windowHeight - defaultHeight) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } else if (position < 2 * windowHeight - defaultHeight) {
          window.scrollTo({
            top: windowHeight - defaultHeight,
            behavior: "smooth",
          });
        } else if (position < 3 * windowHeight - defaultHeight) {
          window.scrollTo({
            top: 2 * windowHeight - defaultHeight,
            behavior: "smooth",
          });
        }
      }

      setLastScrollTop(position);
    };

    if (!scrollDisabled) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollDisabled, lastScrollTop]);

  return (
    <BasicLayout>
      <BannerComponent />
      <MyStudy />
      <PlaceRecommend />
      <BoardRecommend />
    </BasicLayout>
  );
};

export default MainPage;
