import React, { useEffect, useState, use } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Banner.css";
import TypeIt from "typeit-react";

// 배너 배경
import banner1 from "../../img/banner2.jpg";

const BannerComponent = () => {
  const [brightness, setBrightness] = useState(100); // 초기 brightness 값 설정
  const [scale, setScale] = useState(1); // 초기 scale 값 설정
  const [showButtons, setShowButtons] = useState(false); // 버튼 표시 상태

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const newBrightness = Math.max(10, 100 - (scrollTop / maxScroll) * 300); // 최소값을 30으로 설정
    setBrightness(newBrightness);

    const newScale = 1 + (scrollTop / maxScroll) * 0.45; // 최대 45%까지 커지도록 설정
    setScale(newScale);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // 3초 후에 버튼 표시 상태를 true로 설정
    const timer = setTimeout(() => setShowButtons(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 텍스트 애니메이션
  const getBeforeInit = (instance) => {
    instance
      .options({
        lifeLike: false,
        nextStringDelay: 3000,
        loop: false,
        speed: 40,
      }) // speed 옵션 추가
      .type(
        '<br /><span class="font-GSans text-4xl text-white font-bold">다양한 주제로 열정적인 멤버들과 함께 공부하세요.</span>'
      );
    return instance;
  };

  const mainButton =
    "font-GSans bg-black shadow text-white w-fit px-4 py-2 rounded text-2xl cursor-pointer";

  return (
    <div className="w-full overflow-hidden font-blackHans">
      <div className="relative w-full h-dvh fixed top-0 left-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${banner1})`,
            backgroundRepeat: "no-repeat", // 배경 이미지 반복 안 함
            backgroundSize: "cover", // 배경 이미지가 뷰포트를 덮도록 설정
            backgroundPosition: "center", // 배경 이미지가 중앙에 위치하도록 설정
            filter: `brightness(${brightness}%)`, // brightness 값을 통해 밝기 조절
            transform: `scale(${scale})`, // scale 값을 통해 이미지 크기 조절
            transition: "filter 0.5s, transform 0.5s",
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>{" "}
        {/* 어두운 레이어 */}
        <div className="absolute top-96 left-20 z-0">
          <TypeIt getBeforeInit={getBeforeInit}>
            <span className="text-9xl text-white">세상의 모든 스터디</span>
          </TypeIt>
          {showButtons && (
            <motion.div
              className="flex gap-4 my-4 overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ duration: 1 }}
            >
              <Link to={"/study"}>
                <motion.div
                  className={mainButton}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  스터디 가입
                </motion.div>
              </Link>
              <Link to={"/study/add"}>
                <motion.div
                  className={mainButton}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  스터디 만들기
                </motion.div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerComponent;
