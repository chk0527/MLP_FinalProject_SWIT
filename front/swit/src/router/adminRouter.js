// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
import { PulseLoader } from 'react-spinners';

// 로딩 스피너 컴포넌트
const Loading = (
  <div className="flex justify-center items-center min-h-screen">
        <PulseLoader size={20} color={"#F4CE14"} />
    </div>
);

const AdminUserPage = lazy(() => import("../pages/admin/AdminUserPage"));
const AdminStudyPage = lazy(() => import("../pages/admin/AdminStudyPage"));
const AdminPostPage = lazy(() => import("../pages/admin/AdminPostPage"));

const adminRouter = () => {
    return [
        {
            path: "user",
            element: <Suspense fallback={Loading}><AdminUserPage /></Suspense>
        },
        {
            path: "study",
            element: <Suspense fallback={Loading}><AdminStudyPage /></Suspense>
        },
        {
            path: "post",
            element: <Suspense fallback={Loading}><AdminPostPage /></Suspense>
        },
    ]
}
export default adminRouter;
