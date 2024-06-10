import { Link } from "react-router-dom";
import React,{ useContext, useState } from "react";
import logo from "../../img/logoBlack.png";
import MyMenu from "./MyMenu";
import { motion, AnimatePresence } from 'framer-motion';
import { LoginContext } from "../../contexts/LoginContextProvider";

const Header = () => {
  const [result, setResult] = useState(false); //모달창
  const [animate, setAnimate] = useState(false) //모달창 애니메이션

  const closeModal = () => {
    setResult(false);
    
  };
  const openModal = () => {
    setResult(true);
    
  };
  // isLogin  : 로그인 여부 - Y(true), N(false)
  // logout() : 로그아웃 함수 - setLogin(false)
  const { isLogin, login, logout } = useContext(LoginContext);

  return (
    <nav id="navbar" className="absolute w-full h-full">
      <div className="p-4 flex justify-center bg-white ">
        <Link to={"/"}>
          <img className="object-contain size-24"
            src={logo}
            alt="이미지"
          ></img>
        </Link>
      </div>
      <div className="p-6 sticky top-0 z-40 flex justify-center  border-y-2 bg-gray-100 border-gray-200 font-GSans">
      {/* <li> 만 분기 처리가 안되 <ul>로 분기함 */}
      {
        !isLogin
        ?
            <ul className="flex text-black space-x-32 text-xl">
              <li>
                <Link to={"/study"}>스터디 그룹</Link>
              </li>
              <li>
                <Link to={"/place/list"}>스터디 장소</Link>
              </li>
              <li>
                <Link to={"/job"}>시험 및 채용</Link>
              </li>
              <li>
                <Link to={"/"}>Q&A</Link>
              </li>
              <li><Link to="/login">로그인</Link></li>
              <li><Link to="/join">회원가입</Link></li>
          </ul>
          :
          <ul className="flex text-black space-x-32 text-xl">
            <li>
              <Link to={"/study"}>스터디 그룹</Link>
            </li>
            <li>
              <Link to={"/place/list"}>스터디 장소</Link>
            </li>
            <li>
              <Link to={"/job"}>시험 및 채용</Link>
            </li>
            <li>
              <Link to={"/"}>Q&A</Link>
            </li>
            <li><button className="link" onClick={() => logout() }>로그아웃(임시)</button></li>
          </ul>
      }
      </div>
        {result ? 
        <MyMenu callbackFn={closeModal} />: 
        <div className="fixed top-0 right-0 z-50">
          <button className="p-6 pb-10" onClick={openModal}>🖤</button>
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
