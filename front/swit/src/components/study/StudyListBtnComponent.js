import React from 'react';
import { useNavigate } from "react-router-dom";
const StudyCard = ({ study, handleReadStudy }) => {
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수
  const goToStudyListPage = () => {
    navigate("/study");
  };
    return (
      <div className="flex justify-center my-32">
        <button
        
          className="rounded p-3 m-2 text-xl w-32 text-white bg-yellow-500 hover:bg-yellow-600 shadow-md"
          onClick={goToStudyListPage}
        >
          목록
        </button>
        </div>
    );
};

export default StudyCard;
