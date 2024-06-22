import { useEffect, useState } from "react";
import { getPlaceDetail } from "../../api/PlaceApi";
import { Link } from "react-router-dom";
import MapComponent from "./MapComponent";
import star1 from "../../img/star1.png";

const initState = {
  placeNo: 0,
  placeName: "",
  placeAddr: "",
  placeTime: "",
  placeTel: "",
  placeDetail: "",
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

  return (
    <div className="font-GSans">
      <div className="font-bold text-3xl text-center mb-16 pb-4 border-soild border-gray-400 border-b-4">
        [{place.placeAddr.substring(0, 2)}] {place.placeName}
        <button>
          <img className="absolute top-72 mt-5 ml-4" src={star1}></img>
        </button>
      </div>

      <div className="w-full md:flex justify-center gap-24">
        <img className="object-cover w-450 h-450" src={place.placeImg}></img>
        {/* <div id="map" className="w-96 h-96"></div> */}
        <MapComponent placeAddr={place.placeAddr}></MapComponent>
      </div>
      <div className="md:flex pt-16 mt-8 border">
        <div className="w-450 text-xl whitespace-pre-line mr-24">
          <p className="text-2xl pt-2">위치</p>
          <p className="p-4">{place.placeAddr}</p>
          <p className="text-2xl pt-2">전화번호</p>
          <p className="p-4">
            {place.placeTel === ""
              ? "전화번호 정보가 없습니다."
              : place.placeTel}
          </p>
          <p className="text-2xl pt-2">운영시간</p>
          <p className="p-4">
            {place.placeTime === "" ? "시간 정보가 없습니다." : place.placeTime}
          </p>
        </div>
        <div className="w-450 text-xl whitespace-pre-line">
          <p className="text-2xl pt-2">메뉴</p>
          <p className="p-4">
            {place.placeDetail === ""
              ? "메뉴 정보가 없습니다."
              : place.placeDetail}
          </p>
        </div>
      </div>
      <div className="flex justify-center my-24">
        <Link to={{ pathname: "/place/list" }} state={1}>
        <button
          type="button"
          className="rounded p-3 m-2 text-xl w-28 text-white bg-gray-500"
        >
          목록
        </button>
        </Link>
      </div>
    </div>
  );
};

export default PlaceDetailComponent;
