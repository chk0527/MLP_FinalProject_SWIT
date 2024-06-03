import BasicLayout from "../../layouts/BasicLayout";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import PlaceDetailComponent from "../../components/place/PlaceDetailComponent";
import { useCallback } from "react";

const PlaceDetail = () => {
  const { placeNo } = useParams();

  return (
    <BasicLayout>
      <div className="text-5xl pb-16 font-blackHans">
        <div>스터디 {placeNo}</div>
      </div>
      <PlaceDetailComponent placeNo={placeNo} />
    </BasicLayout>
  );
};

export default PlaceDetail;
