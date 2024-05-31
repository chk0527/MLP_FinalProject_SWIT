
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";
import ExamReadComponent from "../../components/examjob/ExamReadComponent";
import { createRoot } from "react-dom/client";
const ExamRead = () => {
    const {examNo} = useParams()
    const navigate = useNavigate()

    return (
        // <BasicLayout>

        //     <div className="text-2xl font-medium ">
        //         <h1>시험상세페이지 {examNo}</h1>
        //     </div>

        // </BasicLayout>
        <div>
             시험상세페이지 - pk:  {examNo}
            <ExamReadComponent examNo={examNo}></ExamReadComponent>
        </div>
       
    )
}

export default ExamRead;