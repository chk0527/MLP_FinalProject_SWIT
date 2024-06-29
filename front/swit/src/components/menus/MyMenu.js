import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { getUserImage } from "../../api/UserApi";
import { getUserIdFromToken, getUserNickFromToken } from "../../util/jwtDecode"; // JWT 디코딩 유틸리티 함수
import { getMyStudy } from "../../api/StudyApi"; // getMyStudy 함수 import

const MyMenu = ({ callbackFn }) => {
  const [studyList, setStudyList] = useState([]); // 가입된 스터디 목록
  const [showStudyList, setShowStudyList] = useState(false); // 스터디 목록 모달창 표시 여부
  const { isLogin, logout } = useContext(LoginContext);
  const [userImage, setUserImage] = useState(null); // 이미지 관리
  const navigate = useNavigate(); // useNavigate 훅 추가
  const [isClicked, setIsClicked] = useState(false); //내 스터디 클릭 상태 관리

  const userId = isLogin ? getUserIdFromToken() : null;

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        try {
          const imageUrl = await getUserImage(userId);
          setUserImage(imageUrl);
          // 사용자 프로필 이미지가 없으면 기본 이미지로 대체
          if (!imageUrl) {
            setUserImage(`${process.env.PUBLIC_URL}/user0_blank.png`);
          }
        } catch (error) {
          console.error(
            "마이메뉴에서 유저 이미지를 가져올 수 없습니다:",
            error
          );
          setUserImage(`${process.env.PUBLIC_URL}/user0_blank.png`);
        }
      } else {
        setUserImage(`${process.env.PUBLIC_URL}/user0_blank.png`);
      }
    };

    const fetchStudyList = async () => {
      if (userId) {
        try {
          const studies = await getMyStudy(userId);
          setStudyList(studies);
        } catch (error) {
          console.error("가입된 스터디 목록을 가져올 수 없습니다:", error);
        }
      }
    };

    fetchUserInfo();
    fetchStudyList();
  }, [userId]);

  const toggleStudyList = () => {
    console.log(isClicked+"@@");
    setIsClicked(!isClicked);
    setShowStudyList(!showStudyList);
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
          height: "100vh",
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
          <img className="object-cover size-52" src={userImage} alt="이미지"></img>
          <div className="text-2xl pt-8">
            {isLogin ? (
              <>
                <Link to={`/mypage/${userId}`}>
                  <p className="mt-4 mb-4">내 정보</p>
                </Link>
                <Link to={"/study/add"}>
                  <p className="mt-4 mb-4">스터디 만들기</p>
                </Link>
                <p className={`mt-4 mb-4 cursor-pointer hover:bg-yellow-100 ${isClicked ? "bg-yellow-100" : ""}`}
                onClick={toggleStudyList}>
                  <span className=" ">내 스터디</span>
                </p>
                {showStudyList && (
                  <div className="w-52 bg-white text-xl overflow-hidden mt-2">
                    <motion.ul
                      className="myStudyList"
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ y: -30 }}
                      transition={{ duration: 0.5 }}
                    >
                      {studyList.length > 0 ? (
                        studyList.map((study, index) => (
                          <li key={index} className="pb-2">
                            <Link to={`/study/group/${study.studyNo}`}>
                              • {study.studyTitle}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>가입된 스터디가 없습니다.</li>
                      )}
                    </motion.ul>
                  </div>
                )}
                <div className="absolute bottom-0 pb-24 w-full flex justify-center">
                  <button
                    onClick={logout}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 mr-28"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
                <div className="relative bottom-[-150px] pb-24 w-full flex justify-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate("/login")}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => navigate("/join")}
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                    >
                      회원가입
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MyMenu;
