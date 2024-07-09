import { Suspense, lazy } from "react"
import { PulseLoader } from "react-spinners";

const Loading = (
  <div className="flex justify-center items-center min-h-screen">
      <PulseLoader size={20} color={"#F4CE14"} />
  </div>
);
const PlaceList = lazy(() => import("../pages/place/PlaceListPage"))
const PlaceDetail = lazy(() => import("../pages/place/PlaceDetailPage"))

const placeRouter = () => {
    return [
        {
            path: "list",
            element: <Suspense fallback={Loading}><PlaceList /></Suspense>
        },
        {
            path: ":read/:placeNo",
            element: <Suspense fallback={Loading}><PlaceDetail /></Suspense>
        },
    ]
}

export default placeRouter;