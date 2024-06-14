import React, { useState, useEffect } from "react";
import { API_SERVER_HOST, getStudy } from "../../api/StudyApi";
import { memberCount } from "../../api/GroupApi";
import { useNavigate } from "react-router-dom";
import StudyListBtnComponent from "./StudyListBtnComponent";
import StudyInfoComponent from "./StudyInfoComponent";
import GroupJoinComponent from "../group/GroupJoinComponent";
import { getUserIdFromToken } from "../../util/jwtDecode"; // JWT 디코딩 유틸리티 함수
import StudyInquiryComponent from "./StudyInquiryComponent";

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
  const [showInquiryComponent, setShowInquiryComponent] = useState(false);
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

  const handleInquiryButtonClick = () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("로그인 후 이용해주세요");
      navigate("/login");
      return;
    }
    setShowInquiryComponent(true);
  };

  const ApplyButton = ({ }) => (
    <button onClick={openModal} className="bg-green-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-600 transition duration-300">
      신청
    </button>
  );

  return (
    <div className="border-2 border-gray-200 mt-10 mx-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="w-full flex justify-center flex-col items-center mb-6">
        {study.uploadFileNames.map((imgFile, i) => (
          <img
            alt="StudyImage"
            key={i}
            className="p-4 w-1/2 rounded-lg shadow-md"
            src={`${host}/api/study/display/${imgFile}`}
          />
        ))}
      </div>

      <div className="flex justify-between mb-6">
        <StudyInfoComponent studyNo={studyNo} ActionComponent={ApplyButton} />
      </div>  
      <div className="mb-6">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={handleInquiryButtonClick}
        >
          문의 작성
        </button>
        <div className="w-3/4">
        {showInquiryComponent && <StudyInquiryComponent studyNo={studyNo} />}
        </div>
      </div>
      <div className="flex justify-start">
        <StudyListBtnComponent />
      </div>

      <GroupJoinComponent isModalOpen={isModalOpen} closeModal={closeModal} studyNo={studyNo} />
    </div>
  );
};

export default StudyReadComponent;
