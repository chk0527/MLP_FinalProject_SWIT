import { useSearchParams } from "react-router-dom";
import BoardListComponent from "../../components/board/BoardListComponent";
import BasicLayout from "../../layouts/BasicLayout";

const BoardListPage = () => {
  const [queryParams] = useSearchParams();
  const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1;
  const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10;
  return (
    <BasicLayout>
          <BoardListComponent />
    </BasicLayout>
  );
};

export default BoardListPage;
