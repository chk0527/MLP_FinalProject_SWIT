import React from "react";
import "./Banner.css";
import TypeIt from "typeit-react";


//배너 배경
import banner1 from "../../img/banner1.jpg";

const BannerComponent = () => {
  //text
  const getBeforeInit = (instance) => {
    instance
      .options({ lifeLike: false, nextStringDelay: 3000, loop: false })
      .pause(2000)
      .delete(10)
      .pause(1000)
      .type("<span>SWit</span>");
    return instance;
  };

  return (
    <div className="w-full overflow-hidden font-GSans">
        <div>
          <div
            className="relative w-full h-dvh bg-cover after:content-['*'] after:absolute after:top-0 after:right-0 after:w-full after:h-full after:bg-black after:opacity-80 after:block after:z-10"
            style={{ backgroundImage: `url(${banner1})` }}
          >
            <div className="absolute p-16 flex justify-center items-center z-20 text-white w-full h-full">
              <TypeIt className="text-9xl text-yellow-200" getBeforeInit={getBeforeInit}><span className="text-7xl text-white">세상의 모든 스터디</span></TypeIt>
            </div>
          </div>
        </div>

    </div>
  );
};

export default BannerComponent;
