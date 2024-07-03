import React, { useState, useEffect } from "react";
import { API_SERVER_HOST, getStudy, fetchInquiries } from "../../api/StudyApi";
import { memberCount } from "../../api/GroupApi";
import { useNavigate } from "react-router-dom";
import StudyListBtnComponent from "./StudyListBtnComponent";
import StudyInfoComponent from "./StudyInfoComponent";
import GroupJoinComponent from "../group/GroupJoinComponent";
import { getUserIdFromToken } from "../../util/jwtDecode"; // JWT 디코딩 유틸리티 함수
import StudyInquiryListComponent from "./StudyInquiryListComponent";
import StudyInquiryFormComponent from "./StudyInquiryFormComponent";

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
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const StudyReadComponent = ({ studyNo }) => {
  const [study, setStudy] = useState(initState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showInquiries, setShowInquiries] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수

  useEffect(() => {
    const fetchData = async () => {
      const studyData = await getStudy(studyNo);
      setStudy(studyData);

      const inquiriesData = await fetchInquiries(studyNo);
      setInquiries(inquiriesData);
    };

    fetchData();
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
    setShowInquiryForm(true);
  };

  const handleViewInquiriesClick = () => {
    setShowInquiries((prevState) => !prevState);
  };

  const ApplyButton = () => (
    <button
      onClick={openModal}
      className="bg-green-500 text-white px-6 py-2 rounded mt-4 hover:bg-green-600 transition duration-300"
    >
      신청
    </button>
  );

  return (
    <div>
      {/* 스터디정보 */}
      <div className="flex justify-center">
        <StudyInfoComponent studyNo={studyNo} ActionComponent={ApplyButton} />
      </div>

      {/* 문의 */}
      <div>
        <StudyInquiryListComponent
          studyNo={studyNo}
          inquiries={inquiries}
          setInquiries={setInquiries}
        />
        <StudyInquiryFormComponent
          studyNo={studyNo}
          setInquiries={setInquiries}
        />
      </div>

      {/* 목록으로 돌아가기 */}
      <StudyListBtnComponent />

      <GroupJoinComponent
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        studyNo={studyNo}
      />
    </div>
  );
};

export default StudyReadComponent;
