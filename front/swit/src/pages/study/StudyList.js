import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import useCustomMove from "../../hooks/useCustomMove";
import { API_SERVER_HOST, getAllStudies } from "../../api/StudyApi"; // getAllStudies 함수를 가져옴
import { isMember, isLeader, memberCount } from "../../api/GroupApi"; // isMember 함수를 가져옴
import { getUserIdFromToken } from "../../util/jwtDecode";
import StudyListComponent from "../../components/study/StudyListComponent";
import StudyPageComponent from "../../components/study/StudyPageComponent ";
import LoginRequireModal from "../../components/common/LoginRequireModal";
//아이콘
import searchIcon from "../../img/search-icon.png";

const initState = {
  dtoList: [],
  pageNumsList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const StudyListPage = () => {
  const { StudyPage, StudySize, moveToStudy } = useCustomMove();
  const [studyList, setStudyList] = useState(initState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [studyTitle, setStudyTitle] = useState("");
  const [studySubject, setStudySubject] = useState("");
  const [studyAddr, setStudyAddr] = useState("");
  const [studyOnline, setStudyOnline] = useState(false);

  const [inputText, setInputText] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  const handleButton = () => {
    setStudyTitle(inputText);
  };

  const subjectList = [
    { value: "수능" },
    { value: "공무원" },
    { value: "임용" },
    { value: "자격증" },
    { value: "어학" },
    { value: "취업" },
    { value: "학교" },
    { value: "개발" },
    { value: "기타" },
  ];
  const [selectedSubject, setSelectedSubject] = useState("");

  const selectSubject = (e) => {
    const value = e.target.value;
    const newSelectedSubject = selectedSubject === value ? "" : value;
    setSelectedSubject(newSelectedSubject);
    setStudySubject(newSelectedSubject);
  };

  const addrList = [
    { value: "", name: "지역" },
    { value: "서울", name: "서울" },
    { value: "경기도", name: "경기도" },
  ];
  const selectAddr = (e) => {
    const value = e.target.value;
    setStudyAddr(value);
  };

  useEffect(() => {
    const fetchStudyList = async () => {
      const userId = getUserIdFromToken();
      try {
        setLoading(true);
        const studyListData = await getAllStudies(
          studyTitle,
          studySubject,
          studyAddr,
          studyOnline,
          userId,
          { StudyPage, StudySize }
        );
        console.log("Fetched study list:", studyListData);

        const studyListWithStatus = await Promise.all(
          studyListData.dtoList.map(async (study) => {
            let leaderStatus = false;
            let memberStatus = userId ? -1 : -2;
            let currentMemberCount = 0;
            if (userId) {
              leaderStatus = await isLeader(study.studyNo);
              memberStatus = await isMember(userId, study.studyNo);
            }
            currentMemberCount = await memberCount(study.studyNo);
            return {
              ...study,
              isLeader: leaderStatus,
              isMemberStatus: memberStatus,
              currentMemberCount,
            };
          })
        );
        setStudyList({ ...studyListData, dtoList: studyListWithStatus });
      } catch (error) {
        console.error("Error fetching study list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyList();
  }, [studyTitle, studySubject, studyAddr, studyOnline, StudyPage, StudySize]);
  const handleReadStudy = async (studyNo) => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        navigate(`/study/read/${studyNo}`, { state: 0 });
        return;
      }
      const isLeaderStatus = await isLeader(studyNo);
      if (isLeaderStatus) {
        navigate(`/study/group/${studyNo}`, { state: 0 });
        return;
      }
      const isMemberStatus = await isMember(userId, studyNo);
      if (isMemberStatus === 1) {
        navigate(`/study/group/${studyNo}`, { state: 0 });
      } else if (isMemberStatus === 0) {
        navigate(`/study/read/${studyNo}`, { state: 0 });
      } else if (isMemberStatus === 2) {
        navigate(`/study/read/${studyNo}`, { state: 0 });
      } else {
        navigate(`/study/read/${studyNo}`, { state: 0 });
      }
    } catch (error) {
      console.error("Error handling study click:", error);
    }
  };

  const getStatusText = (study) => {
    if (study.isLeader) {
      return "방장";
    }
    switch (study.isMemberStatus) {
      case 1:
        return "참여중";
      case 0:
        return "승인대기";
      case 2:
        return "승인거절";
      case 3:
        return "추방";
      default:
        return "미가입";
    }
  };

  const getStatusClass = (study) => {
    if (study.isLeader) {
      return "bg-blue-500";
    }
    switch (study.isMemberStatus) {
      case 1:
        return "bg-green-500";
      case 0:
        return "bg-yellow-500";
      case 2:
        return "bg-red-500";
      case 3:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAddStudy = () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setShowLoginModal(true);
      // alert("로그인이 필요합니다.");
      // navigate("/login");
      return;
    }
    navigate("/study/add", { state: 0 });
  };

  return (
    <BasicLayout>

      {showLoginModal && ( 
        <LoginRequireModal callbackFn={() => setShowLoginModal(false)} /> 
      )} 

      {/* 검색창 */}
      <div className="flex justify-between font-GSans == px-8 pb-8">
        <div className="text-5xl font-blackHans">스터디 그룹</div>
        <div className="text-2xl -m-4">
          <div className="text-right flex justify-end pb-4">
            {/* 제목검색 */}
            <input
              className="focus:outline-none"
              type="text"
              placeholder="제목 검색"
              onChange={handleInput}
            />
            <button type="button" onClick={handleButton}>
              <img className="size-6" src={searchIcon}></img>
            </button>
          </div>
          <div className="flex justify-end pb-4">
            {/* 대면비대면 */}
            <div
              className={`mx-4 cursor-pointer ${
                studyOnline === false ? "font-bold text-black" : "text-gray-500"
              }`}
              onClick={() => setStudyOnline(false)}
            >
              대면
            </div>
            |
            <div
              className={`mx-4 cursor-pointer ${
                studyOnline === true ? "font-bold text-black" : "text-gray-500"
              }`}
              onClick={() => setStudyOnline(true)}
            >
              비대면
            </div>
            {/* 지역검색 */}
            <select className="focus:outline-none mx-4" onChange={selectAddr}>
              {addrList.map((addr) => (
                <option key={addr.value} value={addr.value}>
                  {addr.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            {/* 주제검색 */}
            <div className="text-xl flex justify-end">
              {subjectList.map((subject, index) => (
                <label
                  key={subject.value}
                  className={
                    selectedSubject === subject.value
                      ? ""
                      : "text-gray-400 px-1"
                  }
                  onClick={() =>
                    selectSubject({ target: { value: subject.value } })
                  }
                >
                  <span
                    className={`${selectedSubject === subject.value ? "" : ""}`}
                  >
                    {selectedSubject === subject.value && <span>✔</span>}
                  </span>
                  {subject.value} {index < subjectList.length - 1 && " · "}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-wrap font-GSans min-h-650">
        <StudyListComponent
          handleReadStudy={handleReadStudy}
          getStatusText={getStatusText}
          getStatusClass={getStatusClass}
          studyList={studyList}
          loading={loading}
        />
      </div>
      <div className="grid place-items-end">
        <button
          onClick={handleAddStudy}
          className=" hover:bg-yellow-200 border-2 border-solid border-black  py-2 px-4 rounded mt-4"
        >
          스터디 만들기
        </button>
      </div>
      <StudyPageComponent serverData={studyList} movePage={moveToStudy} />
    </BasicLayout>
  );
};

export default StudyListPage;
