import BasicLayout from "../../layouts/BasicLayout";
import { useParams } from "react-router-dom";

const BoardReadPage = () => {
    const { boardNo } = useParams();

    return (      
        <BasicLayout>
            <div className="text-3xl">
                <div>게시글 상세 페이지</div>
            </div>
            <div className="flex">
                <div className="w-full pr-2">
                    {/* <StudyReadComponent studyNo={studyNo} /> */}
                </div>
            </div>
        </BasicLayout>       
    );
};

export default BoardReadPage;