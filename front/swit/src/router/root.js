// import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";



const {createBrowserRouter} = require("react-router-dom");
const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/MainPage"))
const ExamjobList = lazy(() => import("../pages/examjob/ExamjobList"))
const Login = lazy(() => import("../pages/login/Login"))

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
        path:"/login",
        element:<Suspense fallback={Loading}><Login/></Suspense>,
        // children:[
        //     {
        //         path:"",
        //         element:<Suspense fallback={Loading}><LoginLocal/></Suspense>
        //     }
        // ]
    }
])

export default root;