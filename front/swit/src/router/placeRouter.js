import { lazy } from "react"

const Loading = <div>Loading...</div>
const PlaceList = lazy(() => import("../pages/place/PlaceList"))

const PlaceDetail = lazy(() => import("../pages/place/PlaceDetail"))

const placeRouter = () => {
    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><PlaceList /></Suspense>
        },
        {
            path: ":place_no",
            element: <Suspense fallback={Loading}><PlaceDetail /></Suspense>
        },
    ]
}

export default placeRouter;