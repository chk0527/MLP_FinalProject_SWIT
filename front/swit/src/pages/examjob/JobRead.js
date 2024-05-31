
import { useSearchParams, useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";

const ExamRead = () => {

    const navigate = useNavigate()

    return (
        <BasicLayout>

            <div className="text-2xl font-medium ">
                <h1>채용상세페이지</h1>
            </div>

        </BasicLayout>

    )
}

export default ExamRead;