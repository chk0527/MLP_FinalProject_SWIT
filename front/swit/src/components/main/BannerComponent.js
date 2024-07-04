import React from "react";
import "./Banner.css";
import TypeIt from "typeit-react";
import { motion, AnimatePresence } from "framer-motion";

//배너 배경
import banner1 from "../../img/banner1.jpg";

const BannerComponent = () => {
  //text
  const getBeforeInit = (instance) => {
    instance
      .options({ lifeLike: false, nextStringDelay: 3000, loop: false })
      .pause(1500)
    return instance;
  };

  const variants = {
    start: { pathLength: 0, fill: "rgba(254 240 138,0)" },
    end: { pathLength: 1, fill: "rgba(254 240 138,1)" },
  };

  return (
    <div className="w-full overflow-hidden font-blackHans">
      <div>
        <div
          className="relative w-full h-dvh bg-cover after:content-['*'] after:absolute after:top-0 after:right-0 after:w-full after:h-full after:bg-black after:opacity-80 after:block after:z-10"
          style={{ backgroundImage: `url(${banner1})` }}
        >
          <div className="absolute p-20 flex justify-center items-center z-20 text-white w-full h-full">
            <TypeIt getBeforeInit={getBeforeInit}>
              <span className="text-8xl text-white">세상의 모든 스터디</span>
            </TypeIt>
            {/* <div className="absolute text-9xl text-yellow-200">fasdfasdf</div> */}
            {/* <motion.svg
              className="absolute"
              xmlns="http://www.w3.org/2000/svg"
              width="1000px"
              viewBox="0 0 450 213"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0,243) scale(0.1,-0.1)"
                fill="rgba(254,249,195,0)"
                stroke="black"
                strokeWidth="20px"
                
              >
                <motion.path
                  variants={variants}
                  initial="start"
                  animate="end"
                  transition={{
                    default: { duration: 1, delay: 3 },
                    fill: { duration: 1, delay: 4},
                  }}
                  d="M783 1810 c-125 -23 -240 -105 -284 -203 -19 -41 -24 -70 -24 -137 0
-118 23 -160 181 -334 147 -161 167 -198 168 -306 1 -87 -15 -128 -72 -185
-72 -72 -168 -100 -258 -75 -108 31 -144 143 -74 233 27 34 25 44 -10 62 -68
35 -160 9 -200 -57 -23 -37 -28 -135 -9 -171 23 -44 74 -88 128 -109 78 -30
279 -37 371 -14 117 30 227 105 286 193 50 75 71 167 56 246 -20 109 -51 154
-211 314 -82 82 -158 167 -170 190 -41 81 -20 178 51 238 49 42 90 55 166 55
55 0 76 -5 103 -23 73 -49 56 -142 -34 -185 -45 -21 -48 -26 -42 -50 10 -41
43 -62 98 -62 76 0 139 45 171 122 42 100 -5 196 -119 244 -44 18 -202 26
-272 14z"
                />
                <motion.path
                  variants={variants}
                  initial="start"
                  animate="end"
                  transition={{
                    default: { duration: 1, delay: 3.5 },
                    fill: { duration: 1, delay: 4.5 },
                  }}
                  d="M2935 1788 c-11 -6 -28 -18 -39 -27 -17 -15 -15 -16 39 -21 75 -7 97
-33 103 -123 14 -214 -184 -709 -350 -877 -70 -70 -116 -94 -187 -94 -50 -1
-55 1 -91 42 -52 58 -64 114 -57 266 10 224 81 431 236 688 l22 36 -21 7 c-55
18 -165 -31 -230 -101 -43 -46 -80 -115 -136 -250 -64 -156 -131 -276 -227
-404 -160 -214 -263 -301 -341 -286 -106 20 -115 206 -24 466 92 262 238 491
391 613 26 21 47 42 47 47 0 6 -101 10 -255 10 -286 0 -378 -12 -455 -58 -63
-39 -110 -111 -110 -171 0 -46 29 -111 50 -111 5 0 10 15 10 33 1 78 79 155
185 181 50 12 307 46 350 46 7 0 -27 -39 -75 -87 -145 -145 -292 -397 -357
-611 -34 -114 -40 -305 -9 -362 43 -81 94 -113 178 -113 188 2 355 151 542
481 38 67 71 120 73 118 3 -2 0 -37 -6 -77 -27 -173 -9 -349 45 -432 69 -106
238 -100 431 14 183 110 407 426 498 704 79 240 64 385 -44 442 -49 25 -149
32 -186 11z"
                />
                <motion.path
                  variants={variants}
                  initial="start"
                  animate="end"
                  transition={{
                    default: { duration: 1, delay: 4 },
                    fill: { duration: 1, delay: 5 },
                  }}
                  d="M3494 1557 c-45 -45 -60 -81 -50 -121 10 -41 33 -39 81 9 27 28 54
45 68 45 31 0 47 18 47 51 0 33 -32 59 -74 59 -20 0 -41 -12 -72 -43z"
                />
                <motion.path
                  variants={variants}
                  initial="start"
                  animate="end"
                  transition={{
                    default: { duration: 1, delay: 4.5 },
                    fill: { duration: 1, delay: 5.5 },
                  }}
                  d="M3905 1546 c-49 -21 -124 -113 -168 -208 l-42 -88 -67 0 c-68 0 -98
-14 -98 -46 0 -10 14 -14 55 -14 38 0 55 -4 55 -13 0 -26 -145 -297 -196 -368
-45 -61 -117 -127 -149 -135 -88 -22 -68 105 60 374 35 72 73 145 84 161 11
15 18 31 14 35 -14 13 -109 5 -143 -12 -128 -68 -275 -515 -216 -657 54 -128
235 -26 396 223 36 55 68 101 71 101 3 1 -3 -29 -12 -66 -21 -79 -24 -220 -7
-258 13 -29 55 -55 88 -55 11 0 36 6 54 14 115 48 375 401 329 447 -6 6 -28
-22 -64 -83 -91 -154 -200 -251 -248 -221 -43 27 -18 172 67 388 l48 120 85 5
c86 5 119 18 119 46 0 11 -20 14 -86 14 -84 0 -85 0 -79 23 14 45 81 164 127
225 l47 62 -47 0 c-26 -1 -61 -7 -77 -14z"
                />
              </g>
            </motion.svg>
            <motion.svg
              className="absolute"
              viewBox="0 0 1920 1080"
              preserveAspectRatio="xMidYMid meet"
              transform="translate(0,40)"
            >
              <motion.rect
                x="150"
                y="230"
                className="relative w-5/6 h-2/3"
                stroke="rgb(254,249,195)"
                strokeWidth="1px"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  pathLength: { type: "spring", duration: 5, bounce: 0, delay: 3 },
                  
                }}
              />
            </motion.svg> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerComponent;
