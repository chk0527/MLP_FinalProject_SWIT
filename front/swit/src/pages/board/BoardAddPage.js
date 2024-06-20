import BoardAddComponent from "../../components/board/BoardAddComponent";
import BasicLayout from "../../layouts/BasicLayout";

const BoardAddPage = () => {
    return (      
        <BasicLayout>
            <div className="text-3xl">
                <div>게시글 작성 페이지</div>
            </div>
            <div className="flex">
                <div className="w-full pr-2">
                    <BoardAddComponent/>
                </div>
            </div>
        </BasicLayout>       
    );
};

export default BoardAddPage;