
import { useSearchParams, useNavigate, Outlet } from "react-router-dom";
import ListComponent from "../../components/examjob/ExamListComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";

const ExamjobList = () => {
    // const [queryParams] = useSearchParams()
    // const page=queryParams.get("page")?parseInt(queryParams.get("page")):1
    // const size = queryParams.get("size")?parseInt(queryParams.get("size")):5


    const navigate = useNavigate()
    const handleClickExam = useCallback(() => {
        navigate({ pathname: '' })
    })
    const handleClickJob = useCallback(() => {
        navigate({ pathname: '../job' })
    })

    return (
        // <BasicLayout>

        //     <div className="text-2xl font-medium ">
        //         <div className="flex"><div onClick={handleClickExam}>시험</div>&nbsp;|&nbsp;<div onClick={handleClickJob}>채용</div></div>
        //     </div>

        //     <ListComponent />

        // </BasicLayout>

        <div className="p-4 w-full">
           <ListComponent/>
        </div>


    )
}

export default ExamjobList;