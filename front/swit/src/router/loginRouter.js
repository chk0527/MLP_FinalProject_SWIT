import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";


const Loading = <div>Loading...</div>
const Login = lazy(() => import("../pages/login/Login"))
const Callback = lazy(() => import("../pages/login/Callback"))
const Success = lazy(() => import("../pages/login/Success"))

const loginRouter = () => {
    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><Login /></Suspense>
        }
        // },
        // {
        //     path: "/callback",
        //     element: <Suspense fallback={Loading}><Callback /></Suspense>
        // },
        // {
        //     path: "/success",
        //     element: <Suspense fallback={Loading}><Success /></Suspense>
        // }
    ]
}
export default loginRouter;