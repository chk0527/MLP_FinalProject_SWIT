import { Suspense, lazy } from "react";
import { PulseLoader } from 'react-spinners';

// 로딩 스피너 컴포넌트
const Loading = (
  <div className="flex justify-center items-center min-h-screen">
        <PulseLoader size={20} color={"#F4CE14"} />
    </div>
);

const BoardRead = lazy(() => import("../pages/board/BoardReadPage"));
const BoardAdd = lazy(() => import("../pages/board/BoardAddPage"));
const BoardList = lazy(() => import("../pages/board/BoardListPage"));
const BoardModify = lazy(() => import("../pages/board/BoardModifyPage"));

const boardRouter = () => {
    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><BoardList /></Suspense>
        },
        {
            path: "read/:boardNo",
            element: <Suspense fallback={Loading}><BoardRead /></Suspense>
        },
        {
            path: "add",
            element: <Suspense fallback={Loading}><BoardAdd /></Suspense>
        },
        {
            path: "modify/:boardNo",
            element: <Suspense fallback={Loading}><BoardModify /></Suspense>
        }
    ]
}

export default boardRouter;
