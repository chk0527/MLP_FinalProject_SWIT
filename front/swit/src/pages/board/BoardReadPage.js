import BoardReadComponent from "../../components/board/BoardReadComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams } from "react-router-dom";

const BoardReadPage = () => {
    const { boardNo } = useParams();

    return (      
        <BasicLayout>
            <div className="text-3xl">
                {/* <div>게시판</div> */}
            </div>
            <div className="flex">
                <div className="w-full pr-2">
                    <BoardReadComponent boardNo={boardNo}/>
                </div>
            </div>
        </BasicLayout>       
    );
};

export default BoardReadPage;