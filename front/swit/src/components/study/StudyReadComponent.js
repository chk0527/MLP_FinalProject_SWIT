import React, { useState, useEffect } from "react";
import { API_SERVER_HOST, getStudy } from "../../api/StudyApi";
import { memberCount } from "../../api/GroupApi";
import { useNavigate } from "react-router-dom";
import StudyListBtnComponent from "./StudyListBtnComponent";
import StudyInfoComponent from "./StudyInfoComponent";
import GroupJoinComponent from "../group/GroupJoinComponent";
import { getUserIdFromToken } from "../../util/jwtDecode"; // JWT 디코딩 유틸리티 함수

const initState = {
  studyNo: 0,
  user_id: "user_id",
  studyTitle: "읽기",
  studyContent: "콘텐츠",
  studyType: "스터디",
  studyStartDate: null,
  studyEndDate: null,
  studyHeadcount: 1,
  studyOnline: false,
  studySubject: "개발",
  studyComm: "오픈채팅",
  studyLink: "kakao.com",
  studyUuid: "전용 링크",
  uploadFileNames: []
};

const host = API_SERVER_HOST;

const StudyReadComponent = ({ studyNo }) => {
  const [study, setStudy] = useState(initState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수

  useEffect(() => {
    getStudy(studyNo).then((data) => {
      console.log(data);
      setStudy(data);
    });
  }, [studyNo]);

  const openModal = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("로그인 후 이용해주세요");
      navigate("/login");
      return;
    }

    try {
      const currentMemberCount = await memberCount(studyNo);
      if (currentMemberCount >= study.studyHeadcount) {
        alert("인원이 가득 찼습니다");
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error checking member count:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const ApplyButton = ({ }) => (
    <button onClick={openModal} className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600">
      신청
    </button>
  );

  return (
    <div className="border-2 border-none mt-10 m-2 p-4">
      <div className="w-full justify-center flex flex-col m-auto items-center">
        {study.uploadFileNames.map((imgFile, i) => (
          <img
            alt="StudyImage"
            key={i}
            className="p-4 w-1/2"
            src={`${host}/api/study/display/${imgFile}`}
          />
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <StudyInfoComponent studyNo={studyNo} ActionComponent={ApplyButton} />
      </div>  
    
      <div className="flex justify-start">
        <StudyListBtnComponent />
      </div>

      <GroupJoinComponent isModalOpen={isModalOpen} closeModal={closeModal} studyNo={studyNo} />
    </div>
  );
};

export default StudyReadComponent;
