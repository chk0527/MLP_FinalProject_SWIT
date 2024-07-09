// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { PulseLoader } from 'react-spinners';

// 로딩 스피너 컴포넌트
const Loading = (
  <div className="flex justify-center items-center min-h-screen">
        <PulseLoader size={20} color={"#F4CE14"} />
    </div>
);

const JobList = lazy(() => import("../pages/examjob/JobList"));
const JobRead = lazy(() => import("../pages/examjob/JobRead"));

const jobRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><JobList /></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list" />
        },
        {
            path: "read/:jobNo",
            element: <Suspense fallback={Loading}><JobRead /></Suspense>
        },
    ]
}
export default jobRouter;
