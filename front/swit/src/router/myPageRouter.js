// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const Loading = (
  <div className="flex justify-center items-center min-h-screen">
      <PulseLoader size={20} color={"#F4CE14"} />
  </div>
);
const MyPage = lazy(() => import("../pages/MyPage"))

const myPageRouter = () => {
    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><MyPage /></Suspense>
        },
        {
            path: ":userId",
            element: <Suspense fallback={Loading}><MyPage /></Suspense>
        },
    ]
}
export default myPageRouter;