import React, { useEffect, useState } from "react";
import { isLeader } from "../../api/GroupApi"; // 방장 여부를 확인하는 함수 가져오기
import { getUserIdFromToken } from "../../util/jwtDecode"; // 사용자 ID를 가져오는 함수 가져오기
import GroupCalendarComponent from "../group/GroupCalendarComponent";
import GroupJoinConfirmComponent from "../group/GroupJoinConfirmComponent";
import StudyListBtnComponent from "./StudyListBtnComponent";
import StudyInquiryListComponent from "./StudyInquiryListComponent";
import MemberManagementComponent from "../group/MemberManagementComponent";
import GroupTotalTimerComponent from "../group/GroupTotalTimerComponent";
import { fetchInquiries } from "../../api/StudyApi";

const StudyGroupComponent = ({ studyNo }) => {
  const [view, setView] = useState("calendar");
  const [inquiries, setInquiries] = useState([]);
  const [isLeaderState, setIsLeaderState] = useState(false); // 방장 여부 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      const inquiriesData = await fetchInquiries(studyNo);
      setInquiries(inquiriesData);
    };

    fetchData();
  }, [studyNo]);

  useEffect(() => {
    const checkUserRole = async () => {
      const isLeaderCheck = await isLeader(studyNo);
      console.log(isLeaderCheck+"@@@@@@@@@@")
      setIsLeaderState(isLeaderCheck);
    };

    checkUserRole();
  }, [studyNo]);

  return (
    <div className="p-4 flex flex-col items-center font-GSans">
      {/* 타이머 항목 */}
      
      <hr className="border border-black mt-8 mb-8 w-full" />
      <div className="flex justify-center my-3 w-full">
        <span
          onClick={() => setView("calendar")}
          className={`mx-2 px-4 cursor-pointer ${
            view === "calendar" ? "font-bold text-red-500" : "text-gray-500"
          }`}
        >
          캘린더
        </span>
        <span className="mx-5">|</span>
        <span
          onClick={() => setView("chat")}
          className={`mx-2 px-4 cursor-pointer ${
            view === "chat" ? "font-bold text-red-500" : "text-gray-500"
          }`}
        >
          문의 및 신청
        </span>
        {isLeaderState && (
          <>
            <span className="mx-5">|</span>
            <span
              onClick={() => setView("memberManagement")}
              className={`mx-2 px-4 cursor-pointer ${
                view === "memberManagement" ? "font-bold text-red-500" : "text-gray-500"
              }`}
            >
              회원 관리
            </span>
          </>
        )}
      </div>

      {/* 뷰 - 캘린더 항목 */}
      {view === "calendar" && <GroupCalendarComponent studyNo={studyNo} />}

      {/* 뷰 - 문의 및 신청내역 항목 */}
      {view === "chat" && (
        <div className="">
          <StudyInquiryListComponent studyNo={studyNo}
          inquiries={inquiries}
          setInquiries={setInquiries} />
          <GroupJoinConfirmComponent />
        </div>
      )}

      {/* 뷰 - 회원 관리 항목 (방장만 볼 수 있음) */}
      {view === "memberManagement" && isLeaderState && (
        <div>
        <GroupTotalTimerComponent studyNo={studyNo}/>
        <MemberManagementComponent studyNo={studyNo} />
        </div>
      )}

      {/* 목록으로 돌아가기 */}
      <StudyListBtnComponent />
    </div>
  );
};

export default StudyGroupComponent;
