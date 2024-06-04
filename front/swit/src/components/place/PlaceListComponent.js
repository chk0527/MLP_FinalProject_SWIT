import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import searchIcon from "../../img/search-icon.png";
import { getPlaceList } from "../../api/PlaceApi";
import useCustomMove from "../../hooks/useCustomMove";
import PlacePageComponent from "../common/PlacePageComponent ";

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

const PlaceListComponent = () => {
  const { PlacePage, PlaceSize, moveToPlaceList } = useCustomMove();
  const [serverData, setServerData] = useState(initState);

  useEffect(() => {
    getPlaceList({ PlacePage, PlaceSize }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [PlacePage, PlaceSize]);

  return (
    <div className="relative w-full">
      {/* 검색창 */}
      <div className="absolute right-0 -top-28 text-right">
        <div className="text-xl">
          <input
            className="focus:outline-none"
            type="text"
            placeholder="이름검색"
          />
          <button>
            <img className="size-6" src={searchIcon}></img>
          </button>
        </div>
        <div className="text-2xl">
          <select className="focus:outline-none p-2">
            <option>지역</option>
            <option>서울</option>
            <option>경기도</option>
          </select>
        </div>
      </div>
      {/* 목록 */}
      <div className="flex flex-row flex-wrap w-full justify-center">
        {serverData.dtoList.map((place) => (
          <div
            key={place.placeNo}
            className="w-76 h-64 my-4 mx-8 border-solid border-2 border-gray-200 text-center"
          >
            <Link to={{pathname:`/place/read/${place.placeNo}`}}>
              <div className="overflow-hidden ">
                <img className="w-72 h-48 object-cover" src={place.placeImg}></img>
              </div>
              <div className="p-1">
                <p className="font-bold">{place.placeAddr.substring(0, 6)}</p>
                <p>{place.placeName}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <PlacePageComponent serverData={serverData} movePage={moveToPlaceList} />
    </div>
  );
};

export default PlaceListComponent;
