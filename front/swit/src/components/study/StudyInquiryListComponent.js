import React, { useState, useEffect } from "react";
import {
  responseSubmit,
  fetchInquiries,
  deleteInquiry,
} from "../../api/StudyApi";
import { isLeader } from "../../api/GroupApi";
import reply from "../../img/reply.png";
import CommonModal from "../common/CommonModal";

const StudyInquiryListComponent = ({ studyNo, inquiries, setInquiries }) => {
  const [responseContent, setResponseContent] = useState({});
  const [isResponseOpen, setIsResponseOpen] = useState({});
  const [isLeaderStatus, setIsLeaderStatus] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [selectedInquiry, setSelectedInquiry] = useState(null); 

  useEffect(() => {
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

  const handleDeleteInquiry = (inquiryNo) => {
    setSelectedInquiry(inquiryNo);
    setShowModal(true);
  };

  const confirmDeleteInquiry = async () => {
    try {
      await deleteInquiry(selectedInquiry);
      const inquiriesData = await fetchInquiries(studyNo);
      setInquiries(inquiriesData);
      setShowModal(false);
      setShowConfirmModal(true);
    } catch (error) {
      console.error(error);
      setShowModal(false);
      alert("삭제에 실패했습니다.");
    }
  };

  const openResponse = (inquiryNo) => {
    setIsResponseOpen((prev) => ({ ...prev, [inquiryNo]: true }));
  };

  const closeResponse = (inquiryNo) => {
    setIsResponseOpen((prev) => ({ ...prev, [inquiryNo]: false }));
  };

  //엔터키이벤트
  const pressEnter = (e, inquiryNo) => {
    if (e.nativeEvent.isComposing) {
      // isComposing 이 true 이면 조합 중이므로 동작을 막는다.
      return;
    }
    if (e.key === "Enter" && e.shiftKey) {
      return;
    } else if (e.key === "Enter") {
      handleResponseSubmit(inquiryNo);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-1000">
        <p className="text-xl font-semibold p-2 text-gray-900"> 가입 문의</p>
        <hr className="border-4 border-gray-500 mb-4 w-40" />
      </div>

      <div className="flex justify-center w-full">
        <div className="px-4 w-full max-w-1000 h-fit max-h-450 bg-white rounded border border-gray-200 overflow-auto custom-scrollbar">
          {inquiries == "" ? (
            <p className="text-center my-44">문의 내역이 없습니다</p>
          ) : (
            inquiries.map((inquiry) => (
              <div key={inquiry.inquiryNo} className="border-t py-8">
                <div>
                  <p className="break-words text-sm text-gray-400 mx-6 mt-4">
                    {inquiry.user.userNick} 님
                  </p>
                  <div className="flex mt-4 mb-10">
                    <div className="border mx-4 border-gray-200 rounded bg-gray-500 text-white h-fit">
                      <p className="break-words py-2 px-4 ">질문</p>
                    </div>
                    <div className="grow w-1 text-black shadow bg-white">
                      <div className="break-words py-2 px-4 whitespace-pre-line">
                        {inquiry.inquiryContent}
                      </div>
                    </div>
                  </div>
                  {inquiry.responseContent && (
                    <div className="flex my-4">
                      <img src={reply} className="w-10 h-8"></img>
                      <div className="border mx-4 border-gray-200 rounded bg-yellow-200 h-fit">
                        <p className="break-words py-2 px-4">답변</p>
                      </div>
                      <div className="grow w-1 text-black shadow bg-white">
                        <p className="break-words py-2 px-4 whitespace-pre-line">
                          {inquiry.responseContent}
                        </p>
                      </div>
                    </div>
                  )}
                  {isLeaderStatus && (
                    <div className="flex justify-end">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteInquiry(inquiry.inquiryNo)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                  {isLeaderStatus &&
                    inquiry.inquiryType === "0" &&
                    !inquiry.responseContent && (
                      <div>
                        {!isResponseOpen[inquiry.inquiryNo] ? (
                          <div className="flex my-4">
                            <img src={reply} className="w-10 h-8"></img>
                            <div className="text-gray-400 rounded h-fit">
                              <p
                                className="break-words py-2 px-4 cursor-pointer"
                                onClick={() => openResponse(inquiry.inquiryNo)}
                              >
                                답변을 작성하려면 클릭하세요.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex my-4 h-10 gap-5">
                            <img src={reply} className="w-10 h-8"></img>
                            <textarea
                              className="grow resize-none h-10 py-1.5 px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              value={responseContent[inquiry.inquiryNo] || ""}
                              onChange={(e) =>
                                setResponseContent((prev) => ({
                                  ...prev,
                                  [inquiry.inquiryNo]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) =>
                                pressEnter(e, inquiry.inquiryNo)
                              }
                              placeholder="답변을 입력하세요."
                            />
                            <button
                              className="m-0 py-2 px-4 text-gray-500 border-2 border-solid border-gray-400 bg-white rounded hover:border-black hover:text-black transition duration-300"
                              onClick={() =>
                                handleResponseSubmit(inquiry.inquiryNo)
                              }
                            >
                              등록
                            </button>
                            <button
                              className="m-0  py-2 px-4 "
                              onClick={() => closeResponse(inquiry.inquiryNo)}
                            >
                              닫기
                            </button>
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

      {showModal && (
        <CommonModal
          modalMessage="문의를 삭제하시겠습니까?"
          callbackFn={()=>setShowModal(false)}
          closeMessage="취소"
          navigateFn={confirmDeleteInquiry}
          navigateMessage="확인"
        />
      )}

      {showConfirmModal && (
        <CommonModal
          modalMessage="삭제되었습니다."
          callbackFn={() => setShowConfirmModal(false)}
          closeMessage="확인"
        />
      )}
    </div>
  );
};

export default StudyInquiryListComponent;
