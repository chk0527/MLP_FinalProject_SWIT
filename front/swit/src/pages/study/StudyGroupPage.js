import StudyGroupComponent from "../../components/study/StudyGroupComponent";
import StudyInfoComponent from "../../components/study/StudyInfoComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isMember } from "../../api/GroupApi";
import { getUserIdFromToken } from "../../util/jwtDecode";
import StudyChatPage from "./StudyChatPage";
import GroupMeetingComponent from "../../components/group/GroupMeetingComponent";
import StudyTimerPage from "./StudyTimerPage";
import { isLeader } from "../../api/GroupApi"; // 방장 여부를 확인하는 함수 가져오기
import StudyListBtnComponent from "../../components/study/StudyListBtnComponent";
import StudyModifyButtonComponent from "../../components/study/StudyModifyButton";
import StudyTodoPage from "./StudyTodoPage";

const StudyGroupPage = () => {
  const { studyNo } = useParams();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLeaderState, setIsLeaderState] = useState(false); // 방장 여부 상태 추가

  useEffect(() => {
    const checkUserRole = async () => {
      const isLeaderCheck = await isLeader(studyNo);
      console.log(isLeaderCheck + "@@@@@@@@@@");
      setIsLeaderState(isLeaderCheck);
    };

    checkUserRole();
  }, [studyNo]);

  useEffect(() => {
    const checkAccess = async () => {
      const userId = getUserIdFromToken(); // 사용자 ID 가져오기
      if (userId === null) {
        alert("비정상적인 접근입니다.");
        navigate("/");
        return;
      }
      const memberStatus = await isMember(userId, studyNo);
      if (memberStatus !== 1) {
        alert("비정상적인 접근입니다.");
        navigate("/");
        return;
      }
      setIsAuthorized(true);
    };

    checkAccess();
  }, [studyNo, navigate]);

  if (!isAuthorized) {
    return null; // 또는 로딩 상태를 표시할 수 있습니다.
  }

  return (
    <BasicLayout>
      <div className="flex gap-10">
        <div className="font-GSans">
          <StudyInfoComponent
            studyNo={studyNo}
            ActionComponent={GroupMeetingComponent}
          />
          <StudyGroupComponent studyNo={studyNo} />
        </div>
        <div className="flex flex-col gap-8">
          <StudyChatPage />
          <StudyTimerPage studyNo={studyNo} />
          <StudyTodoPage studyNo={studyNo}/>
        </div>
      </div>
      {/* 목록으로 돌아가기 */}
      <div className="flex justify-center w-full">
        <StudyListBtnComponent />
        <StudyModifyButtonComponent
          studyNo={studyNo}
          isLeader={isLeaderState}
        />
      </div>
    </BasicLayout>
  );
};

export default StudyGroupPage;
