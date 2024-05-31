import myPageRouter from "./myPageRouter";
import loginRouter from "./loginRouter";
import examRouter from "./examRouter";
import jobRouter from "./jobRouter";
import placeRouter from "./placeRouter";


// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
import studyRouter from "./studyRouter";
const { createBrowserRouter } = require("react-router-dom");
// 컴포넌트의 처리가 끝나지 않은 경우 화면에 'Loading…' 메시지 출력
const Loading = <div>Loading...</div>;

const Main = lazy(() => import("../pages/MainPage"))
const ExamList = lazy(() => import("../pages/examjob/ExamList"))
const MyPage = lazy(() => import("../pages/MyPage"))
const DummyPage = lazy(() => import("../pages/study/DummyPage"))
const Login = lazy(() => import("../pages/login/Login"))
const Callback = lazy(() => import("../pages/login/Callback"))
const JobList = lazy(() => import("../pages/examjob/JobList") )
const ExamjobIndex = lazy(() => import("../pages/examjob/ExamjobIndex"))
const PlaceList = lazy(() => import("../pages/place/PlaceList"))


const root = createBrowserRouter([
    {
        path:"",
        element:<Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path:"exam",
        element:<Suspense fallback={Loading}><ExamjobIndex/></Suspense>,
        children: examRouter(),
    },
    {
        path:"/job",
        element:<Suspense fallback={Loading}><ExamjobIndex/></Suspense>,
        children: jobRouter(),
    },
    {
        path:"/mypage",
        element:<Suspense fallback={Loading}><MyPage/></Suspense>,
        children: myPageRouter()
    },
    {
        path:"/placeList",
        element:<Suspense fallback={Loading}><placeList/></Suspense>,
        children: placeRouter()
    },
    {
        path:"/login",
        element:<Suspense fallback={Loading}><Login /></Suspense>,
        // children: loginRouter()
    },
    {
        path: "study",
        element:<Suspense fallback={Loading}><DummyPage/></Suspense>,
        children: studyRouter()
    }
])

export default root;
