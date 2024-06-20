import { Suspense, lazy } from "react";
const Loading = <div>Loading...</div>
const BoardRead = lazy(() => import("../pages/board/BoardReadPage"))
const BoardAdd = lazy(() => import("../pages/board/BoardAddPage"))
const BoardList = lazy(() => import("../pages/board/BoardListPage"))
const BoardModify = lazy(() => import("../pages/board/BoardModifyPage"))
const boardRouter = () => {
    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><BoardList /></Suspense>
          },
        {
            path:"read/:boardNo",
            element: <Suspense fallback={Loading}><BoardRead/></Suspense>
        },
        {
            path:"add",
            element: <Suspense fallback={Loading}><BoardAdd/></Suspense>
        },
        {
            path:"modify/:boardNo",
            element: <Suspense fallback={Loading}><BoardModify/></Suspense>
        }
    ]
}

export default boardRouter;