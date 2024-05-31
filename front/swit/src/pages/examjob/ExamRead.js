
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";

const ExamRead = () => {
    const {examNo} = useParams()
    const navigate = useNavigate()

    return (
        <BasicLayout>

            <div className="text-2xl font-medium ">
                <h1>시험상세페이지 {examNo}</h1>
            </div>

        </BasicLayout>

    )
}

export default ExamRead;