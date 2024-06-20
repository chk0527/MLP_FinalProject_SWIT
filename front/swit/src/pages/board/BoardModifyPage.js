import BoardModifyComponent from "../../components/board/BoardModifyComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useNavigate, useParams } from "react-router-dom"

const BoardModifyPage = () => {
    const { boardNo } = useParams()
    return (
        <BasicLayout>
            <div className="text-3xl">
                <div>게시글 상세 페이지{boardNo}</div>
            </div>
            <div className="flex">
                <div className="w-full pr-2">
                    <BoardModifyComponent boardNo={boardNo} />
                </div>
            </div>
        </BasicLayout>
    );
}

export default BoardModifyPage;