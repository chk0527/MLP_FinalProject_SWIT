import React, { useState } from 'react';
import { inquirySubmit, fetchInquiries } from '../../api/StudyApi';

const StudyInquiryFormComponent = ({ studyNo, setInquiries }) => {
    const [inquiryContent, setInquiryContent] = useState('');

    const handleInquirySubmit = async () => {
        await inquirySubmit(studyNo, inquiryContent);
        setInquiryContent('');
        const inquiriesData = await fetchInquiries(studyNo);
        setInquiries(inquiriesData);
    };

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">문의하기</h2>
            <textarea
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inquiryContent}
                onChange={(e) => setInquiryContent(e.target.value)}
                placeholder="질문을 입력하세요..."
            />
            <button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleInquirySubmit}
            >
                등록
            </button>
        </div>
    );
};

export default StudyInquiryFormComponent;
