import StudyAddComponent from "../../components/study/StudyAddComponent";
import BasicLayout from "../../layouts/BasicLayout";

const StudyAddPage = () => {
    return (
      <BasicLayout>
        <div className="p-4 w-full bg-white">
        <div className="text-3xl font-extrabold">
            Study Add Page Component
        </div>
        <StudyAddComponent/>
        </div>
      </BasicLayout>
    );
}

export default StudyAddPage;