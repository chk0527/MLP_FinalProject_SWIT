import StudyGroupComponent from "../../components/study/StudyGroupComponent";
import StudyInfoComponent from "../../components/study/StudyInfoComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams } from "react-router-dom";

const StudyGroupPage = () => {
    const { studyNo } = useParams();

    return(
        <BasicLayout>
        <div className="text-3xl">
            <div>스터디 그룹 페이지</div>
        </div>
        <StudyInfoComponent studyNo={studyNo}/>
        <StudyGroupComponent studyNo={studyNo} />
    </BasicLayout>  
    );
}

export default StudyGroupPage;