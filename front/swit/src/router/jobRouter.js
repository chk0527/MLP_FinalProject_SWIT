// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>
const JobList = lazy(() => import("../pages/examjob/JobList"))
const JobRead = lazy(() => import("../pages/examjob/JobRead"))

const jobRouter = () => {
    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><JobList /></Suspense>
        },
        {
            path: ":jobNo",
            element: <Suspense fallback={Loading}><JobRead /></Suspense>
        },
    ]
}
export default jobRouter;