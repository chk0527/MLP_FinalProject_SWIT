
import { useParams } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import ExamReadComponent from "../../components/examjob/ExamReadComponent";
const ExamRead = () => {
    const { examNo } = useParams()

    return (
        <BasicLayout>
            <ExamReadComponent examNo={examNo}></ExamReadComponent>
        </BasicLayout>
    )
}

export default ExamRead;