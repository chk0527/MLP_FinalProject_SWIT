import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { inquirySubmit, fetchInquiries } from "../../api/StudyApi";
import { getUserIdFromToken } from "../../util/jwtDecode"; // JWT 디코딩 유틸리티 함수

const StudyInquiryFormComponent = ({ studyNo, setInquiries }) => {
  const [inquiryContent, setInquiryContent] = useState("");
  const navigate = useNavigate();

  const handleInquirySubmit = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    await inquirySubmit(studyNo, inquiryContent);
    setInquiryContent("");
    const inquiriesData = await fetchInquiries(studyNo);
    setInquiries(inquiriesData);
  };

  //엔터키이벤트
  const pressEnter = (e) => {
    if (e.nativeEvent.isComposing) {
      // isComposing 이 true 이면 조합 중이므로 동작을 막는다.
      return;
    }
    if (e.key === "Enter" && e.shiftKey) {
      return;
    } else if (e.key === "Enter") {
      handleInquirySubmit();
    }
  };

  return (
    <div className="flex justify-center ">
      <div className="flex items-center py-4 px-20 gap-8 w-full max-w-1000  border border-gray-200 ">
        <textarea
          className="resize-none w-full h-10 py-1.5 px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          value={inquiryContent}
          onKeyDown={(e) => pressEnter(e)}
          onChange={(e) => setInquiryContent(e.target.value)}
          placeholder="질문을 입력하세요."
        />
        <button
          className="text-gray-500 w-20 border-2 border-solid border-gray-400 bg-white py-2 rounded hover:border-black hover:text-black transition duration-300"
          onClick={handleInquirySubmit}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default StudyInquiryFormComponent;
