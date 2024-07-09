import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
const Loading = (
  <div className="flex justify-center items-center min-h-screen">
      <PulseLoader size={20} color={"#F4CE14"} />
  </div>
);
const StudyRead = lazy(() => import("../pages/study/StudyReadPage"))
const StudyAddPage = lazy(() => import("../pages/study/StudyAddPage"))
const StudyModifyPage = lazy(() => import("../pages/study/StudyModifyPage"))

const StudyList = lazy(() => import("../pages/study/StudyList"))
const StudyGroupPage = lazy(() => import("../pages/study/StudyGroupPage"))
const studyRouter = () => {
  return [
    {
      path: "",
      element: <Suspense fallback={Loading}><StudyList /></Suspense>
    },
    {
      path: "read/:studyNo",
      element: <Suspense fallback={Loading}><StudyRead /></Suspense>
    },
    {
      path: "add",
      element: <Suspense fallback={Loading}><StudyAddPage /></Suspense>
    },
    {
      path: "modify/:studyNo",
      element: <Suspense fallback={Loading}><StudyModifyPage /></Suspense>
    },
    {
      path: "group/:studyNo",
      element: <Suspense fallback={Loading}><StudyGroupPage /></Suspense>
    }
  ];
};

export default studyRouter;