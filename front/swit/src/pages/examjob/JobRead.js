
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";
import JobReadComponent from "../../components/examjob/JobReadComponent";
const ExamRead = () => {
    const {jobNo} = useParams()
    const navigate = useNavigate()

    return (
        <div>   
            <JobReadComponent jobNo = {jobNo}></JobReadComponent>
        </div>

    )
}

export default ExamRead;