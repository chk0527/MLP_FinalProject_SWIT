
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";
import ExamReadComponent from "../../components/examjob/ExamReadComponent";
import { createRoot } from "react-dom/client";
const ExamRead = () => {
    const {examNo} = useParams()
    const navigate = useNavigate()

    return (
        <div>
            <ExamReadComponent examNo={examNo}></ExamReadComponent>
        </div>
       
    )
}

export default ExamRead;