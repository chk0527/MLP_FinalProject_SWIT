import React, { useState, useEffect } from "react";
import { API_SERVER_HOST, getStudy } from "../../api/StudyApi";
import { useNavigate } from "react-router-dom";
import StudyMeetingComponent from "./StudyMeetingComponent";
import StudyCardComponent from "./StudyCardComponent";
import GroupForm from "../group/GroupForm";
import StudyInfoComponent from "./StudyInfoComponent";

const initState = {
  studyNo: 0,
  user_id: "user_id",
  studyTitle: "읽기",
  studyContent: "콘텐츠",
  studyType: "스터디",
  studyStartDate: null,
  studyEndDate: null,
  studyHeadcount: 1,
  studyOnline: false,
  studySubject: "개발",
  studyComm: "오픈채팅",
  studyLink: "kakao.com",
  studyUuid: "전용 링크",
  uploadFileNames: []
};

const host = API_SERVER_HOST

const StudyReadComponent = ({ studyNo }) => {
  const [study, setStudy] = useState(initState);
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수

  useEffect(() => {
    getStudy(studyNo).then((data) => {
      console.log(data);
      setStudy(data);
    });
  }, [studyNo]);

  // studyList 페이지로 이동하는 함수


  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">

      <div className="w-full justify-center flex  flex-col m-auto items-center">
        {study.uploadFileNames.map((imgFile, i) =>
          <img
            alt="StudyImage"
            key={i}
            className="p-4 w-1/2"
            src={`${host}/api/study/display/${imgFile}`} />
        )}
      </div>
{/* 
      {makeDiv("studyNo", study.studyNo)}
      {makeDiv("user_id", study.user_id)}
      {makeDiv("title", study.studyTitle)}
      {makeDiv("studyContent", study.studyContent)}
      {makeDiv("studyType", study.studyType)}
      {makeDiv("studyStartDate", study.studyStartDate)}
      {makeDiv("studyEndDate", study.studyEndDate)}
      {makeDiv("studyHeadcount", study.studyHeadcount)}
      {makeDiv(
        "studyOnlineChk",
        study.studyOnlineChk ? "온라인" : "오프라인"
      )}
      {makeDiv("studyHeadcount", study.studySubject)}
      {makeDiv("studyComm", study.studyComm)}
      {makeDiv("studyUuid", study.studyUuid)} */}
      {/* studyList 페이지로 돌아가는 버튼 */}
      <div className="flex justify-between mt-4">
        <StudyInfoComponent studyNo={studyNo}/>
      </div>  
        <StudyMeetingComponent studyUuid={study.studyUuid} />
        
        <GroupForm studyNo={studyNo}/>
      

    </div>
  );
};

const makeDiv = (title, value) => (
  <div className="flex justify-center">
    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
      <div className="w-1/5 p-4 text-right font-bold">{title}</div>
      <div className="w-4/5 p-4 rounded-r border border-solid shadow-md">
        {value}
      </div>
    </div>
  </div>
);

export default StudyReadComponent;
