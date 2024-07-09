import { Suspense, lazy } from "react";
import { PulseLoader } from "react-spinners";

const Loading = (
  <div className="flex justify-center items-center min-h-screen">
      <PulseLoader size={20} color={"#F4CE14"} />
  </div>
);
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