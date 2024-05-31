
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";
import JobReadComponent from "../../components/examjob/JobReadComponent";
const ExamRead = () => {
    const {jobNo} = useParams()
    const navigate = useNavigate()

    return (
        // <BasicLayout>

        //     <div className="text-2xl font-medium ">
        //         <h1>채용상세페이지</h1>
        //     </div>

        // </BasicLayout>
        <div>
            채용상세페이지 {jobNo}
            <JobReadComponent jobNo = {jobNo}></JobReadComponent>
        </div>

    )
}

export default ExamRead;