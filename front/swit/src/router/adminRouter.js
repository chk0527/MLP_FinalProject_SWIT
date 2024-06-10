// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
// 컴포넌트의 처리가 끝나지 않은 경우 화면에 'Loading…' 메시지 출력
const Loading = <div>Loading...</div>
const AdminUserPage = lazy(() => import("../pages/admin/AdminUserPage"))
const AdminStudyPage = lazy(() => import("../pages/admin/AdminStudyPage"))
const AdminPostPage = lazy(() => import("../pages/admin/AdminPostPage"))

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