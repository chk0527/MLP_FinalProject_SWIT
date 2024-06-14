import { Suspense, lazy } from "react";
const Loading = <div>Loading...</div>
const BoardRead = lazy(() => import("../pages/board/BoardReadPage"))
const BoardAdd = lazy(() => import("../pages/board/BoardAddPage"))

const boardRouter = () => {
    return [
        {
            path:"read/:boardNo",
            element: <Suspense fallback={Loading}><BoardRead/></Suspense>
        },
        {
            path:"add",
            element: <Suspense fallback={Loading}><BoardAdd/></Suspense>
        }
    ]
}

export default boardRouter;