import StudyReadComponent from "../../components/study/StudyReadComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams } from "react-router-dom";
import StudyChatPage from "./StudyChatPage";

const StudyReadPage = () => {
    const { studyNo } = useParams();

    return (      
        <BasicLayout>
            <div className="text-3xl">
                <div>스터디 상세 페이지</div>
            </div>
            <div className="flex">
                <div className="w-3/4 pr-2">
                    <StudyReadComponent studyNo={studyNo} />
                </div>
                {/* <div className="w-1/4 pl-2 ">
                    <StudyChatPage />
                </div> */}
            </div>
        </BasicLayout>       
    );
};

export default StudyReadPage;
