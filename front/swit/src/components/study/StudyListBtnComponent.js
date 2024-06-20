import React from 'react';
import { useNavigate } from "react-router-dom";
const StudyCard = ({ study, handleReadStudy }) => {
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수
  const goToStudyListPage = () => {
    navigate("/study");
  };
    return (
      <div className="flex justify-center m-32">
        <button
          className="bg-yellow-500 w-52 h-12 text-white text-center"
          onClick={goToStudyListPage}
        >
          목록
        </button>
        </div>
    );
};

export default StudyCard;
