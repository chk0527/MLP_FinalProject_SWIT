import StudyGroupComponent from "../../components/study/StudyGroupComponent";
import StudyInfoComponent from "../../components/study/StudyInfoComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams } from "react-router-dom";
import StudyChatPage from "./StudyChatPage";

const StudyGroupPage = () => {
    const { studyNo } = useParams();

    return (
        <BasicLayout>
            <div className="text-3xl mb-4">
                <div>스터디 그룹 페이지</div>
            </div>
            <div className="flex">
                <div className="w-3/4">
                    <StudyInfoComponent studyNo={studyNo} />
                </div>
                <div className="w-1/4 pl-2">
                  <StudyChatPage />
                </div>
            </div>
            <StudyGroupComponent studyNo={studyNo} />
        </BasicLayout>
    );
}

export default StudyGroupPage;
