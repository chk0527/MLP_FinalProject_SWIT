import React, { useState, useEffect } from "react";
import { responseSubmit, fetchInquiries } from "../../api/StudyApi";
import { isLeader } from "../../api/GroupApi";

const StudyInquiryListComponent = ({ studyNo, inquiries, setInquiries }) => {
  const [responseContent, setResponseContent] = useState({});
  const [isResponseOpen, setIsResponseOpen] = useState({});
  const [isLeaderStatus, setIsLeaderStatus] = useState(false);

  useEffect(() => {
    console.log(inquiries+"!!!!!!");
    const initializeData = async () => {
      const leaderStatus = await isLeader(studyNo);
      setIsLeaderStatus(leaderStatus);
    };

    initializeData();
  }, [studyNo]);

  const handleResponseSubmit = async (inquiryNo) => {
    await responseSubmit(inquiryNo, responseContent[inquiryNo]);
    setResponseContent((prev) => ({ ...prev, [inquiryNo]: "" }));
    const inquiriesData = await fetchInquiries(studyNo);
    setInquiries(inquiriesData);
    setIsResponseOpen((prev) => ({ ...prev, [inquiryNo]: false }));
  };

  const openResponse = (inquiryNo) => {
    setIsResponseOpen((prev) => ({ ...prev, [inquiryNo]: true }));
  };

  const closeResponse = (inquiryNo) => {
    setIsResponseOpen((prev) => ({ ...prev, [inquiryNo]: false }));
  };

  return (
    <div>
      <p className="text-xl font-semibold mt-8 p-2 text-gray-900"> 가입 문의</p>
      <hr className="border-4 border-gray-500 mb-4 w-1/6" />

      <div className="flex justify-center">
        <div className="p-4 w-1000 h-fit max-h-450 bg-white rounded border border-gray-200 overflow-auto custom-scrollbar">
          {inquiries == "" ? (
            <p className="text-center text-gray-500">문의 내용이 없습니다</p>
          ) : (
            inquiries.map((inquiry) => (
              <div key={inquiry.inquiryNo} className="">
                <div className="flex flex-col py-2">
                  <div className="flex my-4">
                    <div>
                      <p className="break-words py-2 px-4 ">
                        {inquiry.user.userId}님
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded max-w-750">
                      <p className="break-words py-2 px-4">
                        {inquiry.inquiryContent}
                      </p>
                    </div>
                  </div>
                  {inquiry.responseContent && (
                    <div className="flex justify-end my-4">
                      <div className="border ml-4 border-gray-200 rounded bg-yellow-200 text-black max-w-750">
                        <p className="break-words py-2 px-4">
                          {inquiry.responseContent}
                        </p>
                      </div>
                      <div>
                        <p className="break-words py-2 px-4 ">방장</p>
                      </div>
                    </div>
                  )}
                  {isLeaderStatus &&
                    inquiry.inquiryType === "0" &&
                    !inquiry.responseContent && (
                      <div>
                        {!isResponseOpen[inquiry.inquiryNo] ? (
                          <button value={inquiry.inquiryNo}
                            onClick={() => openResponse(inquiry.inquiryNo)}
                          >
                            답변하기
                          </button>
                        ) : (
                          <div>
                            <div>
                              <button onClick={() => closeResponse(inquiry.inquiryNo)}>
                                닫기
                              </button>
                            </div>
                            <div className="flex bg-gray-100 justify-center items-center py-4 ">
                              <input
                                type="text"
                                className="w-750 px-6 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                value={responseContent[inquiry.inquiryNo] || ""}
                                onChange={(e) =>
                                  setResponseContent((prev) => ({
                                    ...prev,
                                    [inquiry.inquiryNo]: e.target.value,
                                  }))
                                }
                                placeholder="답변을 입력하세요..."
                              />
                              <button
                                className="text-gray-500 border-2 border-solid border-gray-400 bg-white px-6 rounded hover:border-black hover:text-black transition duration-300"
                                onClick={() =>
                                  handleResponseSubmit(inquiry.inquiryNo)
                                }
                              >
                                등록
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyInquiryListComponent;
