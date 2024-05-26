
import ListComponent from "../../components/examjob/ListComponent";
import BasicLayout from "../../layouts/BasicLayout";

const ExamjobList = () => {
    return (
        <BasicLayout>
            <div className="text-2xl font-medium ">
                <div>시험 및 채용</div>
            </div>
            <ListComponent/>
        </BasicLayout>
        
    )
}

export default ExamjobList;