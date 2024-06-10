import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import logo from "../../img/logoWhite.png";
import MyMenu from "./MyMenu";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { name: "스터디 그룹", path: "/study", no: 0 },
  { name: "스터디 장소", path: "/place/list", no: 1 },
  { name: "시험 및 채용", path: "/job/list", no: 2 },
  { name: "Q & A", path: "/", no: 3 },
];

const Header = () => {
  //모달창
  const [result, setResult] = useState(false);
  const closeModal = () => {
    setResult(false);
  };
  const openModal = () => {
    setResult(true);
  };
  //메뉴바
  const location = useLocation();
  const [clickItem, setClickItem] = useState(location.state);
  const [currentItem, setCurrentItem] = useState(clickItem);

  useEffect(() => {
    setClickItem(location.state);
    console.log("location.state",location.state);
  }, [items.no]);

   
  return (
    <nav id="navbar" className="absolute w-full h-full">
      <div className="relative p-4 flex justify-center z-50">
        <Link to={"/"}>
          <img className="object-contain size-24" src={logo} alt="이미지"></img>
        </Link>
      </div>

      <div className="p-6 flex sticky top-0 z-40 justify-center bg-gray-500/20 font-GSans">
        <AnimatePresence>
          <ul
            className="flex space-x-32 text-xl text-white"
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
                      className="absolute bottom-0 w-full bg-indigo-200"
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
        <div className="fixed top-0 right-0 z-50">
          <button className="p-6 pb-10" onClick={openModal}>
          🤍
          </button>
        </div>
      )}
      {/* <div className="w-1/5 flex justify-end A4CEF5 p-4 font-medium">
                <div className="text-white text-sm m-1 rounded">
                    Login
                </div>
            </div> */}
    </nav>
  );
};

export default Header;
