import { useState, useEffect } from "react";
import { API_SERVER_HOST, getStudy } from "../../api/StudyApi";
import { useNavigate } from "react-router-dom";

const initState = {
  studyNo: 0,
  studyTitle: "",
  userId: "",
  studyContent: "",
  studyType: "",
  studyStartDate: null,
  studyEndDate: null,
  studyOnline: false,
  studySubject: "",
  studyComm: "",
  studyHeadcount: 0,
  uploadFileNames: []
};
const host = API_SERVER_HOST;
const StudyInfoComponent = ({ studyNo, ActionComponent }) => {
  const [study, setStudy] = useState(initState);
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수

  useEffect(() => {
    getStudy(studyNo).then((data) => {
      setStudy(data);
    });
  }, [studyNo]);

  return (
    <div className="p-4 flex flex-col items-center">
      {/*스터디 정보란*/}
      <div className="bg-gray-200 p-4 rounded-lg relative max-w-screen-lg w-full">
        <h1 className="text-2xl font-bold text-center">
          {study.studyTitle}
        </h1>
        <div className="flex items-start mt-4">
          <div className="w-64 h-64 rounded-lg mr-6 bg-gray-500 border border-none flex items-center justify-center">
            {study.uploadFileNames.map((imgFile, i) => (
              <img
                alt="StudyImage"
                key={i}
                className="w-full h-full"
                src={`${host}/api/study/display/${imgFile}`}
              />
            ))}
          </div>
          <div className="text-left flex flex-col justify-center h-64">
            <p>
              <strong>소개:</strong> {study.studyTitle}
            </p>
            <p>
              <strong>주제:</strong> {study.studySubject}
            </p>
            <p>
              <strong>진행방식:</strong> {study.studyComm}
            </p>
            <p>
              <strong>최대 인원:</strong> {study.studyHeadcount}
            </p>
            <p>
              <strong>날짜:</strong> {study.studyStartDate} ~{" "}
              {study.studyEndDate}
            </p>
            <p>
              <strong>방장:</strong> {study.userId}
            </p>
          </div>
        </div>
        <div className="flex justify-start ml-24 mt-4">
          {ActionComponent && <ActionComponent studyUuid={study.studyUuid} />}
        </div>
        <div className="mt-4 p-4 border border-gray-300 bg-yellow-100 text-left">
          <p>
            {study.studyContent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyInfoComponent;
