import { Link,useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import searchIcon from "../../img/search-icon.png";
import {
  getPlaceDetail,
  getPlaceList,
  getPlaceSearch,
} from "../../api/PlaceApi";
import useCustomMove from "../../hooks/useCustomMove";
import PlacePageComponent from "./PlacePageComponent ";
import Cookies from 'js-cookie';

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



    // 쿠키에서 jwt 토큰 가져오기
    const accessToken = Cookies.get("accessToken")
    console.info(`accessToken : ${accessToken}`);
    const token = `Bearer ${accessToken}`

    try {
        // getPlaceList(accessToken, placeName, placeAddr, { PlacePage, PlaceSize }).then(
        getPlaceList(token, placeName, placeAddr, { PlacePage:'1', PlaceSize:'10' }).then(  
        (data) => {
          console.log(data);
          setServerData(data);
        });
    } catch (error) {
        console.log(`error : ${error}`)
        // console.log(`status : ${response.status}`)
        return
    }

    
    
  }, [placeName, placeAddr, PlacePage, PlaceSize]);



  return (
    <div className="relative w-full">
      {/* 검색창 */}
      <div className="flex w-full justify-between px-8">
        <div className="text-5xl pb-16 font-blackHans">
          <div>스터디 장소</div>
        </div>
        <div className="text-right">
          <div className="text-xl">
            <input
              className="focus:outline-none"
              type="text"
              placeholder="이름검색"
              onChange={handleInput}
            />
            <button type="button" onClick={handleButton} value={placeName}>
              <img className="size-6" src={searchIcon}></img>
            </button>
          </div>
          <div className="text-2xl">
            <select
              onChange={handleSelect}
              value={placeAddr}
              className="focus:outline-none p-2"
            >
              <option value="">전체</option>
              {selectList.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
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
