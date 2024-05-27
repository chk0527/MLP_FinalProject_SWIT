// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
// 컴포넌트의 처리가 끝나지 않은 경우 화면에 'Loading…' 메시지 출력
const Loading = <div>Loading...</div>
const MyPage = lazy(() => import("../pages/MyPage"))

const myPageRouter = () => {
    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><MyPage /></Suspense>
        },
        {
            path: ":user_id",
            element: <Suspense fallback={Loading}><MyPage /></Suspense>
        },
    ]
}
export default myPageRouter;