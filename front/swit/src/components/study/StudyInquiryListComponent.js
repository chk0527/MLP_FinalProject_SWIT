import React, { useState, useEffect } from 'react';
import { fetchInquiries, responseSubmit } from '../../api/StudyApi';
import { isLeader } from '../../api/GroupApi';

const StudyInquiryListComponent = ({ studyNo }) => {
    const [inquiries, setInquiries] = useState([]);
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

    const handleResponseSubmit = async (inquiryNo) => {
        await responseSubmit(inquiryNo, responseContent[inquiryNo]);
        setResponseContent(prev => ({ ...prev, [inquiryNo]: '' }));
        const inquiriesData = await fetchInquiries(studyNo);
        setInquiries(inquiriesData);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            {inquiries.map((inquiry) => (
                <div key={inquiry.inquiryNo} className="mb-6">
                    <div className="flex flex-col">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md text-left max-w-fit">
                            <p className="font-semibold break-words">{inquiry.user.userId}: {inquiry.inquiryContent}</p>
                        </div>
                        {inquiry.responseContent && (
                            <div className="bg-green-100 p-4 rounded-lg shadow-md text-right max-w-fit self-end mt-2">
                                <p className="font-semibold break-words">{inquiry.study.userId}: {inquiry.responseContent}</p>
                            </div>
                        )}
                        {isLeaderStatus && inquiry.inquiryType === "0" && !inquiry.responseContent && (
                            <div className="mt-2 ml-8">
                                <textarea
                                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={responseContent[inquiry.inquiryNo] || ''}
                                    onChange={(e) => setResponseContent(prev => ({ ...prev, [inquiry.inquiryNo]: e.target.value }))}
                                    placeholder="답변을 입력하세요..."
                                />
                                <button
                                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
                                    onClick={() => handleResponseSubmit(inquiry.inquiryNo)}
                                >
                                    답변 등록
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StudyInquiryListComponent;
