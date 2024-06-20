import { Suspense, lazy } from "react";


const Loading = <div>Loading...</div>
const Login = lazy(() => import("../pages/login/Login"))
const SearchId = lazy(() => import("../pages/login/SearchId"))
const SearchPw = lazy(() => import("../pages/login/SearchPw"))

const loginRouter = () => {
    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><Login /></Suspense>
        },
        {
            path: "searchId",
            element: <Suspense fallback={Loading}><SearchId /></Suspense>
        },
        {
            path: "searchPw",
            element: <Suspense fallback={Loading}><SearchPw /></Suspense>
        }
    ]
}
export default loginRouter;