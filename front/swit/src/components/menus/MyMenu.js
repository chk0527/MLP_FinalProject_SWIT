import { Link } from "react-router-dom";
import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import profile from "../../img/profileEx.jpg";
import { LoginContext } from "../../contexts/LoginContextProvider";

const MyMenu = ({ callbackFn }) => {
  const [studyList, setStudyList] = useState(false); //모달창
  const { isLogin, login, logout } = useContext(LoginContext)
  console.info("MyMenu isLogin [" + isLogin + "]");
  const myStudy = () => {
    setStudyList(!studyList);
  };

  const onlogout = () => {
    localStorage.removeItem('accessToken');
    console.log("로그아웃 완료-로컬스토리지 저장값확인: " + localStorage.getItem("accessToken"));   
    logout();
    window.location.href = '/';
    
};


  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          width: "250px",
          position: "fixed",
          right: 0,
          top: 0,
          height: "100lvh",
          zIndex: 50,
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          borderLeft: "1px solid gray",
        }}
        animate={{ opacity: 1, width: "384px" }}
        exit={{ opacity: 0, width: "250px" }}
        transition={{ duration: 0.5 }}
      >
        <button className="absolute p-6 pb-10 right-0" onClick={callbackFn}>
          🤍
        </button>
        <div className="pt-24">
          <div className="flex pb-2">
            <p className="pr-12 text-2xl">윈터님</p>
            <p className="pt-2">환영합니다.</p>
          </div>
          <img
            className="object-cover size-52"
            src={profile}
            alt="이미지"
          ></img>
          <div className="text-2xl pt-8">
            <Link to={"/"}>
              <p className="py-2">내 정보</p>
            </Link>
            <Link to={"/"}>
              <p className="py-2">스터디 만들기</p>
            </Link>
            <button onClick={myStudy} className="py-2">
              내 스터디
            </button>
            <div className="w-52 h-52 bg-white overflow-hidden text-xl">
              {studyList ? (
                <motion.ul
                  className="myStudyList"
                  initial={{ opacity: 1, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <li className="pb-2">º 리액트 스터디</li>
                  <li>º 스프링부트 스터디</li>
                </motion.ul>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 pb-24">
          <button onClick={onlogout}>로그아웃</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default MyMenu;
