import StudyModifyComponent from "../../components/study/StudyModifyComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams } from "react-router-dom";

const StudyModifyPage = () => {
    const { studyNo } = useParams();

    return (
      <BasicLayout>
        <div className="p-4 w-full bg-white">
        <StudyModifyComponent  studyNo={studyNo}/>
        </div>
      </BasicLayout>
    );
}

export default StudyModifyPage;