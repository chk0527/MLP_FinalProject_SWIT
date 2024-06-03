import { useEffect, useState } from "react";
import { getPlaceDetail } from "../../api/PlaceApi";
import useCustomMove from "../../hooks/useCustomMove"

const initState = {
  placeNo: 0,
  placeName: "",
  placeAddr: "",
  placeTime: "",
  placeTel: "",
  PlaceDetail: "",
  placeImg: "",
};

const PlaceDetailComponent = ({ placeNo }) => {
  const [place, setPlace] = useState(initState);

  //no가 변하면 내부 데이터 변경 후 렌더링
  useEffect(() => {
    getPlaceDetail(placeNo).then((data) => {
      setPlace(data);
    });
  }, [placeNo]);

  //전체목록으로 이동
  const {moveToPlaceList} = useCustomMove()

  return (
    <div>
      {place.placeNo} {place.placeName} {place.placeAddr}
      <button
        type="button"
        className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
        onClick={() => moveToPlaceList()}
      >
        List
      </button>
    </div>
  );
};

export default PlaceDetailComponent;
