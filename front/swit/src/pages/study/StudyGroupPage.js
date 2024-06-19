import StudyGroupComponent from "../../components/study/StudyGroupComponent";
import StudyInfoComponent from "../../components/study/StudyInfoComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isMember } from "../../api/GroupApi";
import { getUserIdFromToken } from "../../util/jwtDecode";
import StudyChatPage from "./StudyChatPage";
import GroupMeetingComponent from "../../components/group/GroupMeetingComponent"

const StudyGroupPage = () => {
    const { studyNo } = useParams();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            const userId = getUserIdFromToken(); // 사용자 ID 가져오기
            if (userId === null) {
                alert("비정상적인 접근입니다.");
                navigate('/');
                return;
            }
            const memberStatus = await isMember(userId, studyNo);
            if (memberStatus !== 1) {
                alert("비정상적인 접근입니다.");
                navigate('/');
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
            <div className="text-3xl mb-4">
                <div>스터디 그룹 페이지</div>
            </div>
            <div className="absolute top-96 -right-96 w-1/3 h-1/4 pl-2">
                    <StudyChatPage />
            </div>    
            <div className="flex">
                <div className="w-full">
                    <StudyInfoComponent studyNo={studyNo} ActionComponent={GroupMeetingComponent} />
                </div>
            </div>
            
            <StudyGroupComponent studyNo={studyNo} />
        </BasicLayout>
    );
}

export default StudyGroupPage;
