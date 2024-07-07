import React, { useEffect, useState, use } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../util/jwtDecode";
import { motion } from "framer-motion";
import "./Banner.css";
import TypeIt from "typeit-react";

// 배너 배경
import banner1 from "../../img/banner2.jpg";

const BannerComponent = () => {
  const userId = getUserIdFromToken();
  const [brightness, setBrightness] = useState(100);
  const [scale, setScale] = useState(1);
  const [showButtons, setShowButtons] = useState(false);

  const navigate = useNavigate();

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const newBrightness = Math.max(10, 100 - (scrollTop / maxScroll) * 300);
    setBrightness(newBrightness);

    const newScale = 1 + (scrollTop / maxScroll) * 0.45;
    setScale(newScale);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToStudy = () => {
    const windowHeight = window.innerHeight;
    const targetPosition = windowHeight - windowHeight / 2;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  };
  const scrollToPlace = () => {
    const windowHeight = window.innerHeight;
    const targetPosition = 2 * windowHeight - windowHeight / 2;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  };
  const scrollToBoard = () => {
    const windowHeight = window.innerHeight;
    const targetPosition = 3 * windowHeight - windowHeight / 2;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  };

  //typeit 타자치는 텍스트 모션
  const getBeforeInit = (instance) => {
    instance
      .options({
        lifeLike: false,
        nextStringDelay: 3000,
        loop: false,
        speed: 40,
      })
      .type(
        '<br /><span class="font-GSans text-2xl text-white font-bold">다양한 주제로 열정적인 멤버들과 함께 공부하세요.</span>'
      );
    return instance;
  };

  //스터디 가입 / 생성 버튼
  const mainButton =
    "font-GSans bg-black shadow text-white w-fit px-4 py-2 rounded text-xl cursor-pointer";

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
            <span className="text-7xl text-white">세상의 모든 스터디</span>
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
                  transition={{ duration: 1 }}
                >
                  {userId ? "스터디 가입" : "스터디 둘러보기"}
                </motion.div>
              </Link>
              {userId ? (
                <Link to={"/study/add"}>
                  <motion.div
                    className={mainButton}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    스터디 만들기
                  </motion.div>
                </Link>
              ) : (
                <></>
              )}
            </motion.div>
          )}
          {showButtons && (
            <motion.div
              className="flex gap-4 my-4 overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ duration: 1 }}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex font-GSans text-white text-2xl gap-4 font-normal ha"
              >
                <motion.button
                  onClick={() => {
                    scrollToStudy();
                  }}
                  whileHover={{ scale: 1.1 }}
                  style={{
                    fontSize: "25px",
                    border: "none",
                    color: "#fff",
                    padding: "0 15px",
                  }}
                >
                  내 스터디
                </motion.button>
                |
                <motion.button
                  onClick={() => {
                    scrollToPlace();
                  }}
                  whileHover={{ scale: 1.1 }}
                  style={{
                    fontSize: "25px",
                    border: "none",
                    color: "#fff",
                    padding: "0 15px",
                  }}
                >
                  스터디 장소 추천
                </motion.button>
                |
                <motion.button
                  onClick={() => {
                    scrollToBoard();
                  }}
                  whileHover={{ scale: 1.1 }}
                  style={{
                    fontSize: "25px",
                    border: "none",
                    color: "#fff",
                    padding: "0 15px",
                  }}
                >
                  최근 게시물
                </motion.button>
              </motion.div>{" "}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerComponent;
