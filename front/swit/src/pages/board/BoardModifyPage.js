import BoardModifyComponent from "../../components/board/BoardModifyComponent";
import BasicLayout from "../../layouts/BasicLayout";
import { useNavigate, useParams } from "react-router-dom";

const BoardModifyPage = () => {
  const { boardNo } = useParams();
  return (
    <BasicLayout>
      <BoardModifyComponent boardNo={boardNo} />
    </BasicLayout>
  );
};

export default BoardModifyPage;
