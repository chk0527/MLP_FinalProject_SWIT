
import { useSearchParams, useNavigate } from "react-router-dom";
import JobListComponent from "../../components/examjob/JobListComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";

const ExamjobList = () => {
    // const [queryParams] = useSearchParams()
    // const page=queryParams.get("page")?parseInt(queryParams.get("page")):1
    // const size = queryParams.get("size")?parseInt(queryParams.get("size")):5


    const navigate = useNavigate()
    const handleClickExam = useCallback(()=>{
        navigate({pathname:'../exam'})
    })
    const handleClickJob = useCallback(()=>{
        navigate({pathname:''})
    })

    return (
        <BasicLayout>

            <div className="text-2xl font-medium ">
                <div className="flex"><div onClick={handleClickExam}>시험</div>&nbsp;|&nbsp;<div onClick={handleClickJob}>채용</div></div>
            </div>
            <JobListComponent />
        </BasicLayout>

    )
}

export default ExamjobList;