// import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";



const {createBrowserRouter} = require("react-router-dom");
const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const ExamjobList = lazy(() => import("../pages/examjob/ExamjobList"))
const MyPageProfile = lazy(() => import("../pages/MyPage"))

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
        element:<Suspense fallback={Loading}><MyPageProfile/></Suspense>
    }
])

export default root;