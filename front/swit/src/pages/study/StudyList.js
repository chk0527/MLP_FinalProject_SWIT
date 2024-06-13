import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { motion, AnimatePresence } from "framer-motion";
import { API_SERVER_HOST, getAllStudies } from "../../api/StudyApi"; // getAllStudies 함수를 가져옴
import { isMember, isLeader } from "../../api/GroupApi"; // isMember 함수를 가져옴
import { getUserIdFromToken } from "../../util/jwtDecode";

//아이콘
import searchIcon from "../../img/search-icon.png";
import defaultImg from "../../img/defaultImage.png";



const StudyListPage = () => {
  const host = API_SERVER_HOST;

  // 스터디 목록을 저장할 상태
  const [studyList, setStudyList] = useState([]);
  const [studyTitle, setStudyTitle] = useState("");
  const [studySubject, setStudySubject] = useState("");
  const [studyAddr, setStudyAddr] = useState("");
  const [studyOnline, setStudyOnline] = useState(1);
  const navigate = useNavigate();

  // useEffect(() => {
  //   // 모든 스터디 목록을 가져오는 API 호출
  //   const fetchStudyList = async () => {
  //     try {
  //       const studyListData = await getAllStudies();
  //       setStudyList(studyListData);
  //     } catch (error) {
  //       console.error("Error fetching study list:", error);
  //     }
  //   };

  //   fetchStudyList(); // 함수 실행
  // }, []); // 빈 배열을 두번째 인자로 넘겨 한 번만 실행되도록 설정

  useEffect(() => {
    getAllStudies(studyTitle, studySubject, studyAddr, studyOnline).then(
      (data) => {
        console.log(data);
        setStudyList(data);
      }
    );
  }, [studyTitle, studySubject, studyAddr, studyOnline]);

  const handleReadStudy = async (studyNo) => {
    try {
      // 현재 로그인된 사용자 ID를 가져옵니다 (예: 로컬 스토리지에서 가져옴)
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("테스트: 비로그인");
        navigate(`/study/read/${studyNo}`, { state: 0 });
        return;
      }
      alert("테스트: 로그인");
      //방장인지 확인
      const isLeaderStatus = await isLeader(studyNo);
      if (isLeaderStatus) {
        alert("테스트: 방장입니다.");
        navigate(`/study/group/${studyNo}`, { state: 0 });
        return;
      }
      // 사용자가 해당 스터디에 참여하고 있는지 확인
      const isMemberStatus = await isMember(userId, studyNo);
      console.log(isMemberStatus+"!!");
      if (isMemberStatus === 1) {
        alert("승인 완료");
        navigate(`/study/group/${studyNo}`, { state: 0 });
      } else if (isMemberStatus === 0) {
        alert("승인 대기중");
        navigate(`/study/read/${studyNo}`, { state: 0 });
      } else if (isMemberStatus === 2) {
        alert("거절되었습니다.");
        navigate(`/study/read/${studyNo}`, { state: 0 });
      } else {
        alert("로그인 상태지만 미가입");
        navigate(`/study/read/${studyNo}`, { state: 0 });
      }
    } catch (error) {
      console.error("Error checking membership or leader status:", error);
    }
  };

  //리스트 목록 애니메이션
  const [isHovered, setHovered] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (!currentItem) {
      setHovered(false);
    } else {
      setHovered(true);
    }
  }, [currentItem]);

  //이미지 디폴트값
  const defaultImage = (e) => {
    e.target.src = `${defaultImg}`;
  };

  return (
    <BasicLayout>
      {/* 검색창 */}
      <div className="flex w-full justify-between px-8">
        <div className="text-5xl pb-16 font-blackHans">
          <div>스터디 그룹</div>
        </div>
        <div className="text-right">
          <div className="text-xl">
            <input
              className="focus:outline-none"
              type="text"
              placeholder="이름검색"
            />
            <button type="button">
              <img className="size-6" src={searchIcon}></img>
            </button>
          </div>
          <div className="text-2xl">
            <select className="focus:outline-none p-2">
              <option value="">전체</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-wrap w-1300 font-GSans">
        <div className="md:grid place-items-center md:grid-cols-4 ">
          {/* 스터디 목록을 카드 형식으로 출력 */}
          <AnimatePresence>
            {studyList.map((study, index) => (
              <div
                key={study.studyNo}
                onMouseEnter={() => setCurrentItem(study.studyNo)}
                onMouseLeave={() => setCurrentItem(null)}
                onClick={() => handleReadStudy(study.studyNo)}
                className="relative w-72 h-72 mb-8"
              >
                <img
                  onError={defaultImage}
                  className="w-72 h-72 bg-cover "
                  src={`${host}/api/study/display/${study.uploadFileNames}`}
                />

                <div className="absolute w-72 h-72 top-0 bg-black/60 text-white cursor-pointer">
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity:
                        isHovered && `${study.studyNo}` == currentItem ? 0 : 1,
                    }}
                  >
                    <div className="flex justify-between p-8">
                      <p className="px-4 py-1 rounded-xl bg-yellow-200/80 text-black">
                        {study.studySubject}
                      </p>
                      <p cl>1명/{study.studyHeadcount}명</p>
                    </div>
                    <div className="absolute  bottom-0 p-8 ">
                      <p className="text-xl py-2">
                        #서울 #{study.studyTitle ? "비대면" : "대면"}
                      </p>
                      <p className="w-60 truncate text-2xl">
                        {study.studyTitle}
                      </p>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity:
                      isHovered && `${study.studyNo}` == currentItem ? 1 : 0,
                    border: "4px solid rgb(253 230 138)",
                    scale: 0.8,
                  }}
                  className="absolute w-72 h-72  bottom-0 p-10 cursor-pointer"
                >
                  <div className="line-clamp-8 text-center text-white">
                    {study.studyContent}
                  </div>
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
        </div>
        <div className="grid place-items-end">
          <Link to={{ pathname: `/study/add` }} state={0}>
            <button className=" hover:bg-yellow-200 border-2 border-solid border-black  py-2 px-4 rounded mt-4">
              스터디 만들기
            </button>
          </Link>
        </div>
      </div>
    </BasicLayout>
  );
};

export default StudyListPage;
