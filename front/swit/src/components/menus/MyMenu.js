import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { getUserImage } from "../../api/UserApi";
import { getUserIdFromToken, getUserNickFromToken } from "../../util/jwtDecode"; // JWT 디코딩 유틸리티 함수

const MyMenu = ({ callbackFn }) => {
  const [studyList, setStudyList] = useState(false); //모달창
  const { isLogin, logout } = useContext(LoginContext);
  const [userImage, setUserImage] = useState(null); // 이미지 관리
  const navigate = useNavigate(); // useNavigate 훅 추가

  const userId = isLogin ? getUserIdFromToken() : null;

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        try {
          const imageUrl = await getUserImage(userId);
          setUserImage(imageUrl);
        } catch (error) {
          console.error(
            "마이메뉴에서 유저 이미지를 가져올 수 없습니다:",
            error
          );
        }
      } else {
        setUserImage(`${process.env.PUBLIC_URL}/user0_blank.png`);
      }
    };
    fetchUserInfo();
  }, [userId]);

  const myStudy = () => {
    setStudyList(!studyList);
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
          X
        </button>
        <div className="pt-24 font-GSans">
          <div className="flex pb-2">
            {isLogin ? (
              <>
                <p className="pr-12 text-2xl">
                  {getUserNickFromToken(userId)}님
                </p>
                <p className="pt-2">환영합니다.</p>
              </>
            ) : (
              <p className="text-2xl">로그인이 필요합니다</p>
            )}
          </div>
          <img
            className="object-cover size-52"
            src={userImage}
            alt="이미지"
          ></img>
          <div className="text-2xl pt-8">
            <>
              <Link to={`/mypage/${userId}`}>
                <p className="py-2">내 정보</p>
              </Link>
              <Link to={"/study/add"}>
                <p className="py-2">스터디 만들기</p>
              </Link>
              <Link to={"/study"}>
                <p className="py-2">내 스터디</p>
              </Link>
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
              <div className="absolute bottom-0 pb-24 w-full flex justify-center">
                <button
                  onClick={logout}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 mr-28"
                >
                  로그아웃
                </button>
              </div>
            </>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MyMenu;
