import StudyGroupComponent from "../../components/study/StudyGroupComponent";
import BasicLayout from "../../layouts/BasicLayout";

const StudyGroupPage = () => {
    return(
        <BasicLayout>
        <div className="text-3xl">
            <div>스터디 그룹 페이지</div>
        </div>
        <StudyGroupComponent />
    </BasicLayout>  
    );
}

export default StudyGroupPage;