import BoardReadComponent from "../../components/board/BoardReadComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useParams } from "react-router-dom";

const BoardReadPage = () => {
    const { boardNo } = useParams();

    return (      
        <BasicLayout>
                <div className="w-full font-GSans">
                    <BoardReadComponent boardNo={boardNo}/>
                </div>
        </BasicLayout>       
    );
};

export default BoardReadPage;