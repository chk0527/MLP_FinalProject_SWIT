import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
const Loading = <div>Loading...</div>
const StudyRead = lazy(() => import("../pages/study/StudyReadPage"))
const StudyAddPage = lazy(() => import("../pages/study/StudyAddPage"))
const StudyList = lazy(() => import("../pages/study/StudyList"))
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
    }
  ];
};

export default studyRouter;