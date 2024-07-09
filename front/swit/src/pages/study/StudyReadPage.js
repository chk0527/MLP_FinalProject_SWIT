import StudyReadComponent from "../../components/study/StudyReadComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams } from "react-router-dom";
import StudyChatPage from "./StudyChatPage";

const StudyReadPage = () => {
    const { studyNo } = useParams();

    return (      
        <BasicLayout>
            <div className="flex">
                <div className="w-full font-GSans">
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
