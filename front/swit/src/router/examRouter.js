// 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩
import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { PulseLoader } from 'react-spinners';
import ExamCalender from "../pages/examjob/ExamCalendar";

// 로딩 스피너 컴포넌트
const Loading = (
  <div className="flex justify-center items-center min-h-screen">
        <PulseLoader size={20} color={"#F4CE14"} />
    </div>
);

const ExamList = lazy(() => import("../pages/examjob/ExamList"));
const ExamRead = lazy(() => import("../pages/examjob/ExamRead"));

const examRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><ExamList /></Suspense>
        },
        {
            path: "",
            element: <Navigate replace to="list/calendar" />
        },
        {
            path: "read/:examNo",
            element: <Suspense fallback={Loading}><ExamRead /></Suspense>
        },
        {
            path: "list/calendar",
            element: <Suspense fallback={Loading}><ExamCalender /></Suspense>
        }
    ];
}

export default examRouter;
