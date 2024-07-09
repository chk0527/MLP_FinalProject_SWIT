import myPageRouter from "./myPageRouter";
import loginRouter from "./loginRouter";
import studyRouter from "./studyRouter";
import adminRouter from "./adminRouter";
import examRouter from "./examRouter";
import jobRouter from "./jobRouter";
import placeRouter from "./placeRouter";
import boardRouter from "./boardRouter";
import { PulseLoader } from "react-spinners";


// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
const { createBrowserRouter } = require("react-router-dom");
// 컴포넌트의 처리가 끝나지 않은 경우 화면에 'Loading…' 메시지 출력
const Loading = (
  <div className="flex justify-center items-center min-h-screen">
      <PulseLoader size={20} color={"#F4CE14"} />
  </div>
);

const Main = lazy(() => import("../pages/MainPage"))
const MyPage = lazy(() => import("../pages/MyPage"))
const AdminPage = lazy(() => import("../pages/admin/AdminPage"))
const DummyPage = lazy(() => import("../pages/study/DummyPage"))
const StudyList = lazy(() => import("../pages/study/StudyList"))
const Login = lazy(() => import("../pages/login/Login"))
const Callback = lazy(() => import("../pages/login/Callback"))
const PlaceList = lazy(() => import("../pages/place/PlaceListPage"))
const Join = lazy(() => import("../pages/join/Join"))
const SearchId = lazy(() => import("../pages/login/SearchId"))



const root = createBrowserRouter([
    {
        path:"",
        element:<Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path:"exam",
        children: examRouter(),
    },
    {
        path:"/job",
        children: jobRouter(),
    },
    {
        path:"/admin",
        element:<Suspense fallback={Loading}><AdminPage/></Suspense>,
        children: adminRouter()
    },
    {
        path:"/mypage",
        element:<Suspense fallback={Loading}><MyPage/></Suspense>,
        children: myPageRouter()
    },
    {
        path:"/place",
        children: placeRouter()
    },
    {
        path:"/login",
        children: loginRouter()
    },
    {
        path:"/join",
        element:<Suspense fallback={Loading}><Join /></Suspense>,
    },
    {
      path: "study",
      children: studyRouter()
    },
    {
        path: "board",
        children: boardRouter()
      },
    {
        path:"/callback",
        element:<Suspense fallback={Loading}><Callback /></Suspense>,
        // children: loginRouter()
    },
    {
        path:"/searchId",
        element:<Suspense fallback={Loading}><SearchId /></Suspense>,
        // children: loginRouter()
    },
])

export default root;
