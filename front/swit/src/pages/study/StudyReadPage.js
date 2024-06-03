import StudyReadComponent from "../../components/study/StudyReadComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams } from "react-router-dom";

const StudyReadPage = () => {
    const { studyNo } = useParams();

    return (      
        <BasicLayout>
            <div className="text-3xl">
                <div>스터디 상세 페이지</div>
            </div>
            <StudyReadComponent studyNo={studyNo} />
        </BasicLayout>       
    );
};

export default StudyReadPage;
