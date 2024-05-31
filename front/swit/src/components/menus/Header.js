import { Link } from "react-router-dom";
import React,{ useState } from "react";
import logo from "../../img/logoBlack.png";
import MyMenu from "./MyMenu";
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [result, setResult] = useState(false); //모달창
  const [animate, setAnimate] = useState(false) //모달창 애니메이션

  const closeModal = () => {
    setResult(false);
    
  };
  const openModal = () => {
    setResult(true);
    
  };

  return (
    <nav id="navbar" className="relative">
      <div className="p-4 flex justify-center bg-white">
        <Link to={"/"}>
          <img className="object-contain size-24"
            src={logo}
            alt="이미지"
          ></img>
        </Link>
      </div>
      <div className="p-6 flex justify-center border-y-2 bg-gray-100 border-gray-300 font-medium">
        <ul className="flex text-black space-x-32 text-xl">
          <li>
            <Link to={"/"}>스터디 그룹</Link>
          </li>
          <li>
            <Link to={"/"}>스터디 장소</Link>
          </li>
          <li>
            <Link to={"/examjob"}>시험 및 채용</Link>
          </li>
          <li>
            <Link to={"/"}>Q&A</Link>
          </li>
        </ul>
      </div>
        {result ? 
        <MyMenu callbackFn={closeModal} />: 
        <div className="absolute top-0 right-0">
          <button className="absolute p-5 pb-10 right-0 " onClick={openModal}>🖤</button>
        </div>}
      {/* <div className="w-1/5 flex justify-end A4CEF5 p-4 font-medium">
                <div className="text-white text-sm m-1 rounded">
                    Login
                </div>
            </div> */}
    </nav>
  );
};

export default Header;
