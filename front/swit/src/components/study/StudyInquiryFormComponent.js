import React, { useState,useEffect } from "react";
import { inquirySubmit, fetchInquiries } from "../../api/StudyApi";

const StudyInquiryFormComponent = ({ studyNo, setInquiries }) => {
  const [inquiryContent, setInquiryContent] = useState("");


  const handleInquirySubmit = async () => {
    await inquirySubmit(studyNo, inquiryContent);
    setInquiryContent("");
    const inquiriesData = await fetchInquiries(studyNo);
    setInquiries(inquiriesData);
  };

  return (
    <div className="flex border border-gray-200  justify-center items-center py-4 gap-8">
      <input
        type="text"
        className="w-750 px-6 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        value={inquiryContent}
        onChange={(e) => setInquiryContent(e.target.value)}
        placeholder="질문을 입력하세요..."
      />
      <button
        className="text-gray-500 border-2 border-solid border-gray-400 bg-white px-6 py-2 rounded hover:border-black hover:text-black transition duration-300"
        onClick={handleInquirySubmit}
      >
        등록
      </button>
    </div>
  );
};

export default StudyInquiryFormComponent;
