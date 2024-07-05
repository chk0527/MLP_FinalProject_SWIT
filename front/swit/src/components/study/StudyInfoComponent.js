import { useState, useEffect } from "react";
import { API_SERVER_HOST, getStudy, deleteOne } from "../../api/StudyApi";
import { isMember, isLeader, memberCount } from "../../api/GroupApi"; 
import { useNavigate } from "react-router-dom";
import defaultImg from "../../img/defaultImage.png";
import StudyRemoveButtonComponent from "./StudyRemoveButtonComponent";
import StudyModifyButtonComponent from "../../components/study/StudyModifyButton";
import StudyDeleteConfirmModal from "./StudyDeleteConfirmModal"; //삭제 확인 컴포넌트


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
  const [result, setResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 표시 여부를 관리하는 상태
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수
  const [isLeaderState, setIsLeaderState] = useState(false); // 방장 여부 상태 추가

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
        console.error("스터디 데이터를 가져오는 중 오류 발생:", error);
      }
    };
    const checkUserRole = async () => {
      const isLeaderCheck = await isLeader(studyNo);
      console.log(isLeaderCheck + "@@@@@@@@@@");
      setIsLeaderState(isLeaderCheck);
    };
    fetchStudyData();
    checkUserRole();
  }, [studyNo]);

  const handleDeleteClick = () => {
    setIsModalOpen(true); // 삭제 버튼 클릭 시 모달 열기
  };

  const moveToList = () => {
    navigate({ pathname: `/study` });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteOne(studyNo);
      setResult({ action: "삭제" });
      setIsModalOpen(false); // 삭제 후 모달을 닫고
      moveToList() //리스트로 이동
    } catch (error) {
      console.error("스터디 삭제 중 오류 발생:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false); // 삭제 취소 시 모달을 닫기
  };

  return (
    <div className="w-full max-w-1000 flex flex-col items-center">
      {/*스터디 정보란*/}
      <div className="flex w-full items-center">
        <h1 className="text-2xl flex-grow text-center">{study.studyTitle}</h1>
        <div className="flex justify-end">
          <div className="mr-5">
          <StudyModifyButtonComponent
          studyNo={studyNo}
          isLeader={isLeaderState}
        />
        </div>
          <StudyRemoveButtonComponent onClick={handleDeleteClick} isLeader={isLeaderState} />
        </div>
      </div>
      <hr className="border border-black mt-4 mb-8 w-full" />

      <div className="flex gap-20">
        <div className=" w-64 rounded">
          {study.uploadFileNames.length > 0 ? (
            study.uploadFileNames.map((imgFile, i) => (
              <img
                alt="StudyImage"
                key={i}
                className="max-w-64 h-64 rounded"
                src={`${host}/api/study/display/${imgFile}`}
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
              <strong>인원: </strong> {study.currentMemberCount}명/
              {study.studyHeadcount}명
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
      <div className="w-full h-52 my-4 p-4 border border-gray-300 bg-yellow-100 text-left whitespace-pre-line">
        <p>{study.studyContent}</p>
      </div>
      <hr className="border border-black my-8 w-full" />
      {isModalOpen && (
        <StudyDeleteConfirmModal
          content="삭제"
          callbackFn={handleConfirmDelete}
          cancelFn={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default StudyInfoComponent;
