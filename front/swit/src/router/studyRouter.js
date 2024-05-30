import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
const Loading = <div>Loading...</div>
const StudyRead = lazy(() => import("../pages/study/StudyReadPage"))
const StudyAddPage = lazy(() => import("../pages/study/StudyAddPage"))
const studyRouter = () => {
    return [
        // {
        //     path: "list",
        //     element: <Suspense fallback={Loading}><TodoList/></Suspense>
        // },
        // {
        //     path: "",
        //     element: <Navigate replace to="list"/>
        // },
        {
            path:"read/:studyNo",
            element: <Suspense fallback={Loading}><StudyRead/></Suspense>
        },
        {
            path:"add",
            element: <Suspense fallback={Loading}><StudyAddPage/></Suspense>
        }
        // {
        //     path:"modify/:tno",
        //     element: <Suspense fallback={Loading}><TodoModify/></Suspense>
        // }
    ]
}

export default studyRouter;