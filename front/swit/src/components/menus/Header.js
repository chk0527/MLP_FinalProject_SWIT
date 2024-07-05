import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import logo from "../../img/logoBlack.png";
import MyMenu from "./MyMenu";
import { motion, AnimatePresence } from "framer-motion";
import { LoginContext } from "../../contexts/LoginContextProvider";
import GroupJoinCheckComponent from "../../components/group/GroupJoinCheckComponent";
import GroupInquiryCheckComponent from "../group/GroupInquiryCheckComponent";

const items1 = [
  { name: "스터디 그룹", path: "/study", no: 0 },
  { name: "스터디 장소", path: "/place/list", no: 1 },
  { name: "시험 및 채용", path: "/job/list", no: 2 },
  { name: "게시판", path: "/board", no: 3 },
];

const items2 = [
  { name: "스터디 그룹", path: "/study", no: 0 },
  { name: "스터디 장소", path: "/place/list", no: 1 },
  { name: "시험 및 채용", path: "/job/list", no: 2 },
  { name: "게시판", path: "/board", no: 3 },
];

const Header = () => {
  const { isLogin, timeLeft, refreshAccessToken } = useContext(LoginContext);
  const navigate = useNavigate(); // navigate 훅 추가
  const [result, setResult] = useState(false);
  const location = useLocation();
  const [clickItem, setClickItem] = useState(location.state);
  const [currentItem, setCurrentItem] = useState(clickItem);

  useEffect(() => {
    setClickItem(location.state);
    console.log("location.state", location.state);
  }, [location.state]);

  const items = isLogin ? items2 : items1;

  const closeModal = () => {
    setResult(false);
  };
  const openModal = () => {
    setResult(true);
  };

  // 로그아웃까지 남은 시간을 시, 분, 초로 변환하는 함수
  const formatTimeLeft = (seconds) => {
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
  };

  return (
    <nav id="navbar" className="absolute w-full h-full">
      <div className="relative flex justify-center bg-white z-50">
        <Link to={"/"}>
          <img className="object-contain size-28" src={logo} alt="이미지"></img>
        </Link>
        {isLogin ? (
          <>
            {" "}
            {timeLeft !== null && (
              <div className="absolute top-8 right-32 mr-3 flex items-center gap-2">
                <p className="text-gray-600 text-xs">
                  로그아웃까지:{" "}
                  <span className="text-blue-300">
                    {formatTimeLeft(timeLeft)}
                  </span>
                </p>
                <button
                  onClick={refreshAccessToken}
                  className="text-gray-600 text-xs bg-yellow-200 px-2 py-1 rounded-full hover:bg-yellow-300"
                >
                  유지
                </button>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="p-6 flex sticky top-0 z-40 justify-center bg-gray-50 border shadow border-gray-200 font-GSans">
        <AnimatePresence>
          <ul
            className="flex space-x-32 text-xl"
            onMouseLeave={() => {
              setCurrentItem(clickItem);
            }}
          >
            {items.map((item, index) => (
              <Link to={item.path} state={item.no} key={item.name}>
                <li
                  className={`cursor-pointer relative`}
                  onMouseEnter={() => setCurrentItem(index)}
                >
                  <div className="px-5 py-2 z-10 relative">{item.name}</div>
                  {index === currentItem && (
                    <motion.div
                      layoutId="underline"
                      style={{ height: "6px" }}
                      className="absolute bottom-0 w-full bg-yellow-200"
                    />
                  )}
                </li>
              </Link>
            ))}
          </ul>
        </AnimatePresence>
      </div>

      {result ? (
        <MyMenu callbackFn={closeModal} />
      ) : (
        <div className="fixed top-0 right-0 z-50 p-6 flex  items-center">
          {isLogin ? (
            <div className="flex items-center gap-2">
              <GroupInquiryCheckComponent />
              <GroupJoinCheckComponent />
              <p className="text-gray-600 text-xs w-35 h-10 px-1 rounded cursor-pointer flex items-center" onClick={openModal}>
                메뉴
              </p>
            </div>
          ) : (
            <div className="flex gap-4">
              <p
                onClick={() => navigate('/login')}
                className="text-gray-600 text-xs w-35 h-10 px-1 rounded cursor-pointer flex items-center"
              >
                로그인
              </p>
              <p className="text-gray-600 text-xs m-0 flex items-center">|</p>
              <p
                onClick={() => navigate('/join')}
                className="text-gray-600 text-xs w-35 h-10 px-1 rounded cursor-pointer flex items-center"
              >
                회원가입
              </p>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
