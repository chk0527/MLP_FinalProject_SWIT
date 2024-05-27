import myPageRouter from "./myPageRouter";

// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
const { createBrowserRouter } = require("react-router-dom");
// 컴포넌트의 처리가 끝나지 않은 경우 화면에 'Loading…' 메시지 출력
const Loading = <div>Loading...</div>

const Main = lazy(() => import("../pages/MainPage"))
const ExamjobList = lazy(() => import("../pages/examjob/ExamjobList"))
const MyPage = lazy(() => import("../pages/MyPage"))

const root = createBrowserRouter([
    {
        path:"",
        element:<Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path:"/examjob",
        element:<Suspense fallback={Loading}><ExamjobList/></Suspense>
    },
    {
        path:"/mypage",
        element:<Suspense fallback={Loading}><MyPage/></Suspense>,
        children: myPageRouter()
    }
])

export default root;