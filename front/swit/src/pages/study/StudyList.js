import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { API_SERVER_HOST, getAllStudies } from "../../api/StudyApi"; // getAllStudies 함수를 가져옴
import { isMember, isLeader, memberCount } from "../../api/GroupApi"; // isMember 함수를 가져옴
import { getUserIdFromToken } from "../../util/jwtDecode";
import StudyListComponent from "../../components/study/StudyListComponent";
// import styles from "../../css/CustomCheckbox.css";

//아이콘
import searchIcon from "../../img/search-icon.png";

const StudyListPage = () => {
  // 스터디 목록을 저장할 상태
  const [studyList, setStudyList] = useState([]);
  const navigate = useNavigate();

  //검색 내용 저장할 상태
  const [studyTitle, setStudyTitle] = useState("");
  const [studySubject, setStudySubject] = useState("");
  const [studyAddr, setStudyAddr] = useState("");
  const [studyOnline, setStudyOnline] = useState(false);

  //대면비대면
  const handleClick = (online) => {
    setStudyOnline(online);
  };

  //이름 검색
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState(""); //검색 이름

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  const handleButton = () => {
    setSearchText(inputText);
    setStudyTitle(searchText);
  };

  //주제 검색
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

  //주소 검색
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
    // 모든 스터디 목록을 가져오는 API 호출
    const fetchStudyList = async () => {
      const userId = getUserIdFromToken();
      try {
        const studyListData = await getAllStudies(
          studyTitle,
          studySubject,
          studyAddr,
          studyOnline,
          userId
        );
        console.log("Fetched study list:", studyListData); // API 결과 로그

        // 각 스터디에 대한 상태 정보 추가
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
  }, [studyTitle, studySubject, studyAddr, studyOnline]); // 빈 배열을 두번째 인자로 넘겨 한 번만 실행되도록 설정

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

  const getStatusText = (study) => {
    if (!study.isLeader && study.isMemberStatus === -2) return "비회원";
    if (study.isLeader) return "방장";
    if (study.isMemberStatus === 1) return "참가중";
    if (study.isMemberStatus === 2) return "거절";
    if (study.isMemberStatus === 0) return "승인 대기중";
    if (study.isMemberStatus === 3) return "추방";
    return "미가입";
  };

  const getStatusClass = (study) => {
    if (!study.isLeader && study.isMemberStatus === -2) return "bg-gray-500";
    if (study.isLeader) return "bg-blue-500";
    if (study.isMemberStatus === 1) return "bg-green-500";
    if (study.isMemberStatus === 2) return "bg-red-500";
    if (study.isMemberStatus === 0) return "bg-yellow-500";
    if (study.isMemberStatus === 3) return "bg-purple-500";
    return "bg-gray-500";
  };

  return (
    <BasicLayout>
      {/* 검색창 */}
      <div className="flex justify-between font-GSans == px-8 pb-8">
        <div className="text-5xl font-blackHans">스터디 그룹</div>
        <div className="text-2xl -m-4 pb-10">
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
              onClick={() => handleClick(false)}
            >
              대면
            </div>
            |
            <div
              className={`mx-4 cursor-pointer ${
                studyOnline === true ? "font-bold text-black" : "text-gray-500"
              }`}
              onClick={() => handleClick(true)}
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
              {subjectList.map((subject) => (
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
                  {subject.value} ·
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-wrap w-1300 font-GSans">
        <StudyListComponent
          studyList={studyList}
          handleReadStudy={handleReadStudy}
          getStatusText={getStatusText}
          getStatusClass={getStatusClass}
        />
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
