
import { useSearchParams } from "react-router-dom";
import ListComponent from "../../components/examjob/ListComponent";
import BasicLayout from "../../layouts/BasicLayout";


const ExamjobList = () => {
    // const [queryParams] = useSearchParams()
    // const page=queryParams.get("page")?parseInt(queryParams.get("page")):1
    // const size = queryParams.get("size")?parseInt(queryParams.get("size")):5

    return (
        <BasicLayout>

            <div className="text-2xl font-medium ">
                <div>시험 | 채용</div>
            </div>
            <ListComponent />
        </BasicLayout>

    )
}

export default ExamjobList;