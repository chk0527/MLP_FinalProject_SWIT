import React from 'react';
import { useNavigate } from "react-router-dom";
const StudyCard = ({ study, handleReadStudy }) => {
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수
  const goToStudyListPage = () => {
    navigate("/study");
  };
    return (
      <div className="grid place-items-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded"
          style={{ width: "200px", height: "40px" }}
          onClick={goToStudyListPage}
        >
          Study List로 돌아가기
        </button>
        </div>
    );
};

export default StudyCard;
