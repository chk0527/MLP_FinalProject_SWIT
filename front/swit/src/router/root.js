import myPageRouter from "./myPageRouter";
import loginRouter from "./loginRouter";

// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
const { createBrowserRouter } = require("react-router-dom");
// 컴포넌트의 처리가 끝나지 않은 경우 화면에 'Loading…' 메시지 출력
const Loading = <div>Loading...</div>

const Main = lazy(() => import("../pages/MainPage"))
const ExamjobList = lazy(() => import("../pages/examjob/ExamjobList"))
const MyPage = lazy(() => import("../pages/MyPage"))
const Login = lazy(() => import("../pages/login/Login"))
const Callback = lazy(() => import("../pages/login/Callback"))

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
    },
    {
        path:"/login",
        element:<Suspense fallback={Loading}><Login /></Suspense>,
        // children: loginRouter()
    },
    {
        path:"/callback",
        element:<Suspense fallback={Loading}><Callback /></Suspense>,
    }

])

export default root;