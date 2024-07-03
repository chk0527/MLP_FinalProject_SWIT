import { useState, useEffect } from "react";
import { API_SERVER_HOST, getStudy } from "../../api/StudyApi";
import { isMember, isLeader, memberCount } from "../../api/GroupApi"; // isMember 함수를 가져옴
import { useNavigate } from "react-router-dom";
import defaultImg from "../../img/defaultImage.png";

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
  uploadFileNames: [],
};
const host = API_SERVER_HOST;
const StudyInfoComponent = ({ studyNo, ActionComponent }) => {
  const [study, setStudy] = useState(initState);
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        const studyData = await getStudy(studyNo);
        const currentMemberCount = await memberCount(studyNo);

        setStudy({
          ...studyData,
          currentMemberCount,
        });
      } catch (error) {
        console.error("Error fetching study data:", error);
      }
    };

    fetchStudyData();
  }, [studyNo]);

  return (
    <div className="w-full max-w-1000 flex flex-col items-center">
      {/*스터디 정보란*/}
      <h1 className="text-2xl">{study.studyTitle}</h1>
      <hr className="border border-black mt-4 mb-8 w-full" />

      <div className="flex gap-20">
        <div className=" w-64 rounded">
          {study.uploadFileNames.length > 0 ? (
            study.uploadFileNames.map((imgFile, i) => (
              <img
                alt="StudyImage"
                key={i}
                className="w-64 h-64 rounded"
                src={`/api/study/display/${imgFile}`}
              />
            ))
          ) : (
            <img
              alt="StudyImage"
              className="max-w-64 h-64 rounded"
              src={defaultImg}
            />
          )}
          <div className="flex justify-center">
            {ActionComponent && <ActionComponent studyUuid={study.studyUuid} />}
          </div>
        </div>
        <div className="border p-8 text-left flex flex-col gap-8 justify-center gap-2">
          <div className="w-full text-ellipsis overflow-hidden">
            <strong>소개: </strong> {study.studyTitle}
          </div>
          <div className="flex gap-20">
            <p className="max-w-40">
              <strong>주제: </strong> {study.studySubject}
            </p>
            <p className="max-w-40">
              <strong>대면/비대면: </strong>
              {study.studyOnline ? "비대면" : "대면"}
            </p>
          </div>
          <div className="flex gap-20">
            <p className="max-w-40">
              <strong>인원: </strong> {study.currentMemberCount}명/{study.studyHeadcount}명
            </p>
            <p className="max-w-40">
              <strong>날짜: </strong>
              {study.studyStartDate} -
            </p>
          </div>
          <div>
            <strong>방장: </strong> {study.userNick}
          </div>
        </div>
      </div>
      <div className="w-full h-52 my-4 p-4 border border-gray-300 bg-yellow-100 text-left">
        <p>{study.studyContent}</p>
      </div>
      <hr className="border border-black my-8 w-full" />
    </div>
  );
};

export default StudyInfoComponent;
