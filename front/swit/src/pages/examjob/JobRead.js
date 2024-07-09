import { useParams } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import JobReadComponent from "../../components/examjob/JobReadComponent";
const ExamRead = () => {
    const { jobNo } = useParams()


    return (

        <BasicLayout>
            <JobReadComponent jobNo={jobNo}></JobReadComponent>


        </BasicLayout>

    )
}

export default ExamRead;