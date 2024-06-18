import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { motion, AnimatePresence } from "framer-motion";
import { API_SERVER_HOST, getAllStudies } from "../../api/StudyApi"; // getAllStudies 함수를 가져옴
import { isMember, isLeader, memberCount } from "../../api/GroupApi"; // isMember 함수를 가져옴
import { getUserIdFromToken } from "../../util/jwtDecode";

//아이콘
import searchIcon from "../../img/search-icon.png";
import defaultImg from "../../img/defaultImage.png";

const host = API_SERVER_HOST;

const StudyListPage = () => {
  // 스터디 목록을 저장할 상태
  const [studyList, setStudyList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 모든 스터디 목록을 가져오는 API 호출
    const fetchStudyList = async () => {
      try {
        const studyListData = await getAllStudies();
        console.log("Fetched study list:", studyListData); // API 결과 로그

        // 각 스터디에 대한 상태 정보 추가
        const userId = getUserIdFromToken();
        const studyListWithStatus = await Promise.all(
          studyListData.map(async (study) => {
            let leaderStatus = false;
            let memberStatus = userId ? -1 : -2; // -1: 가입신청을 하지 않은경우, -2: 비회원(로그인 안 한 상태)
            let currentMemberCount = 0;
            if (userId) {
              leaderStatus = await isLeader(study.studyNo);
              memberStatus = await isMember(userId, study.studyNo);
            }
            currentMemberCount = await memberCount(study.studyNo); // 현재 가입된 인원 수 가져오기
            return {
              ...study,
              isLeader: leaderStatus,
              isMemberStatus: memberStatus,
              currentMemberCount,
            };
          })
        );
        console.log("Study list with status:", studyListWithStatus); // 상태가 추가된 리스트 로그
        setStudyList(studyListWithStatus);
      } catch (error) {
        console.error("Error fetching study list:", error);
      }
    };

    fetchStudyList(); // 함수 실행
  }, []); // 빈 배열을 두번째 인자로 넘겨 한 번만 실행되도록 설정

  const handleReadStudy = async (studyNo) => {
    try {
      // 현재 로그인된 사용자 ID를 가져옴 (sessionStorage)
      const userId = getUserIdFromToken();
      if (!userId) {
        // alert("테스트: 비로그인");
        navigate(`/study/read/${studyNo}`, { state: 0 });
        return;
      }
      // alert("테스트: 로그인");
      //방장인지 확인
      const isLeaderStatus = await isLeader(studyNo);
      if (isLeaderStatus) {
        // alert("테스트: 방장입니다.");
        navigate(`/study/group/${studyNo}`, { state: 0 });
        return;
      }
      // 사용자가 해당 스터디에 참여하고 있는지 확인
      const isMemberStatus = await isMember(userId, studyNo);
      if (isMemberStatus === 1) {
        // alert("승인 완료");
        navigate(`/study/group/${studyNo}`, { state: 0 });
      } else if (isMemberStatus === 0) {
        // alert("승인 대기중");
        navigate(`/study/read/${studyNo}`, { state: 0 });
      } else if (isMemberStatus === 2) {
        // alert("거절되었습니다.");
        navigate(`/study/read/${studyNo}`, { state: 0 });
      } else {
        // alert("로그인 상태지만 미가입");
        navigate(`/study/read/${studyNo}`, { state: 0 });
      }
    } catch (error) {
      console.error("Error checking membership or leader status:", error);
    }
  };

  const handleAddStudy = () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    navigate("/study/add", { state: 0 });
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

  const getStatusText = (study) => {
    if (!study.isLeader && study.isMemberStatus === -2) return "비회원";
    if (study.isLeader) return "방장";
    if (study.isMemberStatus === 1) return "참가중";
    if (study.isMemberStatus === 2) return "거절";
    if (study.isMemberStatus === 0) return "승인 대기중";
    return "미가입";
  };

  const getStatusClass = (study) => {
    if (!study.isLeader && study.isMemberStatus === -2) return "bg-gray-500";
    if (study.isLeader) return "bg-blue-500";
    if (study.isMemberStatus === 1) return "bg-green-500";
    if (study.isMemberStatus === 2) return "bg-red-500";
    if (study.isMemberStatus === 0) return "bg-yellow-500";
    return "bg-gray-500";
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
                className="relative w-72 h-72 mb-8 rounded"
              >
                <img
                  src={
                    study.imageList.length > 0
                      ? `${host}/api/study/display/${study.imageList[0].fileName}`
                      : defaultImg
                  }
                  className="w-72 h-72 bg-cover rounded"
                  alt={study.studyTitle}
                ></img>
                <div className="absolute w-72 h-72 top-0 bg-black/50 text-white cursor-pointer rounded">
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity:
                        isHovered && `${study.studyNo}` == currentItem ? 0 : 1,
                    }}
                  >
                    <div className="flex justify-between p-8">
                      <div className="flex gap-4">
                        <p
                          className={`px-2 rounded pt-1 ${getStatusClass(
                            study
                          )}`}
                        >
                          {getStatusText(study)}
                        </p>
                        <p className="px-2 pt-1 rounded bg-gray-500/50">
                          {study.studySubject}
                        </p>
                      </div>
                      <p>
                        {study.currentMemberCount}/{study.studyHeadcount}명
                      </p>
                    </div>
                    <div className="absolute bottom-0 p-8">
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
                  className="absolute w-72 h-72 bottom-0 p-10 cursor-pointer"
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
          <button 
            onClick={handleAddStudy}
            className=" hover:bg-yellow-200 border-2 border-solid border-black  py-2 px-4 rounded mt-4"
          >
            스터디 만들기
          </button>
        </div>
      </div>
    </BasicLayout>
  );
};

export default StudyListPage;
