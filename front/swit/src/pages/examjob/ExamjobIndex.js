import { Outlet, useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";

const ExamjobIndex = () => {
    const navigate = useNavigate()
    const handleClickExamList = useCallback(()=>{
        navigate({pathname:'../../exam'})
    })
    const handleClickJobList= useCallback(()=>{
        navigate({pathname:'../../job'})
    })
    return(
        <BasicLayout>
            <div className="w-full flex justify-center">
                <div className="text-xl mx-1 -my-10 p-2 w-20 text-center" onClick={handleClickExamList}>시험</div>
                <div className="text-xl mx-1 -my-10 p-2 w-20 text-center" onClick={handleClickJobList}>채용</div>
               
            </div>
            <div className="flex flex-wrap w-full">
            <Outlet />
            </div>

        </BasicLayout>
    )
}

export default ExamjobIndex;