import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { motion, AnimatePresence } from "framer-motion";
import { getAllStudies } from "../../api/StudyApi"; // getAllStudies 함수를 가져옴
import { isMember } from "../../api/GroupApi"; // isMember 함수를 가져옴
import { getUserIdFromToken } from "../../util/jwtDecode";

//아이콘
import searchIcon from "../../img/search-icon.png";
import banner1 from "../../img/banner1.jpg";

const StudyListPage = () => {
  // 스터디 목록을 저장할 상태
  const [studyList, setStudyList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 모든 스터디 목록을 가져오는 API 호출
    const fetchStudyList = async () => {
      try {
        const studyListData = await getAllStudies();
        setStudyList(studyListData);
      } catch (error) {
        console.error("Error fetching study list:", error);
      }
    };

    fetchStudyList(); // 함수 실행
  }, []); // 빈 배열을 두번째 인자로 넘겨 한 번만 실행되도록 설정

  const handleReadStudy = async (studyNo) => {
    try {
      // 현재 로그인된 사용자 ID를 가져옵니다 (예: 로컬 스토리지에서 가져옴)
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("추후 삭제 될 알림: 비로그인");
        navigate(`/study/read/${studyNo}`, { state: 0 });
        return;
      }
      alert("추후 삭제 될 알림: 로그인");
      // 사용자가 해당 스터디에 참여하고 있는지 확인
      const isMemberStatus = await isMember(userId, studyNo);
      if (isMemberStatus) {
        alert('승인 완료 or 방장');
        navigate(`/study/group/${studyNo}`, { state: 0 });
      } else {
        alert('승인 대기중');
        navigate(`/study/read/${studyNo}`, { state: 0 });
      }
    } catch (error) {
      console.error("Error checking membership:", error);
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
                onMouseEnter={() => setCurrentItem(index + 1)}
                onMouseLeave={() => setCurrentItem(null)}
                onClick={() => handleReadStudy(study.studyNo)}
                className="relative w-72 h-72 mb-8"
              >
                <img src={banner1} className="w-72 h-72 bg-cover "></img>
                <div className="absolute w-72 h-72 top-0 bg-black/50 text-white cursor-pointer">
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity:
                        isHovered && `${study.studyNo}` == currentItem ? 0 : 1,
                    }}
                  >
                    <div className="flex justify-between p-8">
                      <p className="px-4 py-1 rounded-xl bg-gray-500/50">
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
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4">
              Go to StudyAddPage
            </button>
          </Link>
        </div>
      </div>
    </BasicLayout>
  );
};

export default StudyListPage;
