import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import logo from "../../img/logoBlack.png";
import MyMenu from "./MyMenu";
import { motion, AnimatePresence } from "framer-motion";
import { LoginContext } from "../../contexts/LoginContextProvider";

const items1 = [
  { name: "스터디 그룹", path: "/study", no: 0 },
  { name: "스터디 장소", path: "/place/list", no: 1 },
  { name: "시험 및 채용", path: "/job/list", no: 2 },
  { name: "게시판", path: "/", no: 3 },
];

const items2 = [
  { name: "스터디 그룹", path: "/study", no: 0 },
  { name: "스터디 장소", path: "/place/list", no: 1 },
  { name: "시험 및 채용", path: "/job/list", no: 2 },
  { name: "게시판", path: "/board", no: 3 },
];

const Header = () => {
  const { isLogin } = useContext(LoginContext);
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

  return (
    <nav id="navbar" className="absolute w-full h-full">
      <div className="relative p-4 flex justify-center bg-white z-50">
        <Link to={"/"}>
          <img className="object-contain size-24" src={logo} alt="이미지"></img>
        </Link>
      </div>

      <div className="p-6 flex sticky top-0 z-40 justify-center bg-white border-b-2 border-gray-400 font-GSans">
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
                      style={{ height: "4px" }}
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
        <div className="fixed top-0 right-0 z-50 p-6">
          {isLogin ? (
            <p className="text-gray-600 text-xs w-35 h-10 px-1 rounded cursor-pointer" onClick={openModal}>
              메뉴
            </p>
          ) : (
            <div className="flex gap-4">
              <p
                onClick={() => navigate('/login')}
                className="text-gray-600 text-xs w-35 h-10 px-1 rounded cursor-pointer"
              >
                로그인
              </p>
              <p className="text-gray-600 text-xs m-0">|</p>
              <p
                onClick={() => navigate('/join')}
                className="text-gray-600 text-xs w-35 h-10 px-1 rounded cursor-pointer"
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
