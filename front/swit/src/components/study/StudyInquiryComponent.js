import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserIdFromToken } from '../../util/jwtDecode';
import { isLeader } from '../../api/GroupApi';
import { fetchInquiries, inquirySubmit, responseSubmit } from '../../api/StudyApi'; // 수정된 함수 임포트

const StudyInquiryComponent = () => {
    const { studyNo } = useParams();
    const [inquiries, setInquiries] = useState([]);
    const [inquiryContent, setInquiryContent] = useState('');
    const [responseContent, setResponseContent] = useState({});
    const [isLeaderStatus, setIsLeaderStatus] = useState(false);

    useEffect(() => {
        const initializeData = async () => {
            const inquiriesData = await fetchInquiries(studyNo);
            setInquiries(inquiriesData);

            const leaderStatus = await isLeader(studyNo);
            setIsLeaderStatus(leaderStatus);
        };

        initializeData();
    }, [studyNo]);

    const handleInquirySubmit = async () => {
      await inquirySubmit(studyNo, inquiryContent);
      setInquiryContent('');
      const inquiriesData = await fetchInquiries(studyNo);
      setInquiries(inquiriesData);
  };

    const handleResponseSubmit = async (inquiryNo) => {
        await responseSubmit(inquiryNo, responseContent[inquiryNo]);
        setResponseContent({ ...responseContent, [inquiryNo]: '' });
        const inquiriesData = await fetchInquiries(studyNo);
        setInquiries(inquiriesData);
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Questions</h2>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    value={inquiryContent}
                    onChange={(e) => setInquiryContent(e.target.value)}
                />
                <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleInquirySubmit}
                >
                    Submit Question
                </button>
            </div>
            {inquiries.map((inquiry) => (
                <div key={inquiry.inquiryNo} className="mb-4">
                    <div className="bg-gray-100 p-4 rounded">
                        <p>{inquiry.inquiryContent}</p>
                    </div>
                    {inquiry.responseContent && (
                        <div className="bg-green-100 p-4 rounded mt-2 ml-8">
                            <p>{inquiry.responseContent}</p>
                        </div>
                    )}
                    {isLeaderStatus && inquiry.inquiryType === "0" && !inquiry.responseContent && (
                        <div className="mt-2 ml-8">
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded"
                                value={responseContent[inquiry.inquiryNo] || ''}
                                onChange={(e) => setResponseContent({ ...responseContent, [inquiry.inquiryNo]: e.target.value })}
                            />
                            <button
                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => handleResponseSubmit(inquiry.inquiryNo)}
                            >
                                Submit Answer
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StudyInquiryComponent;
