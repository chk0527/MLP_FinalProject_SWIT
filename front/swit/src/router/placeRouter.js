import { Suspense, lazy } from "react"

const Loading = <div>Loading...</div>
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