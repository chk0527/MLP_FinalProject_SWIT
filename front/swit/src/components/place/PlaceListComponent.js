import { Link,useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import searchIcon from "../../img/search-icon.png";
import {
  getPlaceList,
} from "../../api/PlaceApi";
import useCustomMove from "../../hooks/useCustomMove";
import PlacePageComponent from "./PlacePageComponent ";


const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const PlaceListComponent = (filteredPlaceList) => {
  //page정보를 가지고 page 이동
  const { PlacePage, PlaceSize, moveToPlaceList } = useCustomMove();
  const [serverData, setServerData] = useState(initState);

  //이름 검색
  const [inputText, setInputText] = useState("");
  const [placeName, setPlaceName] = useState("");
  const handleInput = (e) => {
    setInputText(e.target.value);
  };
  const handleButton = () => {
    setPlaceName(inputText);
  };

  //지역 검색
  const selectList = ["서울", "경기"];
  const [placeAddr, setPlaceAddr] = useState("");

  const handleSelect = (e) => {
    setPlaceAddr(e.target.value);
  };

  useEffect(() => {
    getPlaceList(placeName, placeAddr, { PlacePage, PlaceSize }).then(
      (data) => {
        console.log(data);
        setServerData(data);
      }
    );
  }, [placeName, placeAddr, PlacePage, PlaceSize]);


  return (
    <div className="relative w-full">

      {/* 목록 */}
      <div className="flex-wrap w-1300 font-GSans">
        <div className="md:grid place-items-center md:grid-cols-3 ">
          {serverData.dtoList.map((place) => (
            <div
              key={place.placeNo}
              className="w-350 h-350 text-center mb-8"
            >
              <Link to={{ pathname: `/place/read/${place.placeNo}`}} state={1}>
                <div className="overflow-hidden ">
                  <img
                    className="w-400 h-96 object-cover"
                    src={place.placeImg}
                  ></img>
                </div>
                <div className="pt-2 text-start">
                  <p className="font-bold my-2">
                    {place.placeAddr.substring(0, 6)}
                  </p>
                  <p className="text-2xl">{place.placeName}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <PlacePageComponent serverData={serverData} movePage={moveToPlaceList} />
    </div>
  );
};

export default PlaceListComponent;
