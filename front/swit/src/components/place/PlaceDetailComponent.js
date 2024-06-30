import { useEffect, useState } from "react";
import {
  getPlaceDetail,
  isPlaceFavorite,
  addPlaceFavorite,
  removePlaceFavorite,
} from "../../api/PlaceApi";
import { Link, useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import { FaStar, FaRegStar } from "react-icons/fa";
import { getUserIdFromToken } from "../../util/jwtDecode";

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
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getPlaceDetail(placeNo).then((data) => {
      setPlace(data);

      const userId = getUserIdFromToken();
      const status = {};

      if (userId) {
        isPlaceFavorite(userId, placeNo).then((isFavorite) => {
          status[placeNo] = isFavorite;
          setFavoriteStatus(status);
        });
      } else {
        status[placeNo] = false;
        setFavoriteStatus(status);
      }
    });
  }, [placeNo]);

  const handleFavorite = async (placeNo) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      if (window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
        navigate("/login");
      }
      return;
    }

    const isFavorite = favoriteStatus[placeNo];
    const request = isFavorite ? removePlaceFavorite : addPlaceFavorite;
    try {
      await request(userId, placeNo);
      setFavoriteStatus({
        ...favoriteStatus,
        [placeNo]: !isFavorite,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="font-GSans">
      <div className="w-1000 font-bold text-3xl text-center">
        [{place.placeAddr.substring(0, 2)}] {place.placeName}
        <button
          onClick={() => handleFavorite(place.placeNo)}
          className="absolute top-72 mt-7 ml-4"
        >
          {favoriteStatus[place.placeNo] ? (
            <FaStar size={30} color="#FFF06B" />
          ) : (
            <FaRegStar size={30} color="#FFF06B" />
          )}
        </button>
      </div>
      <hr className="border border-black mt-4 mb-8 w-full" />
      <div className="flex justify-between">
        <div className="md:flex flex-col gap-20">
          <img
            className="object-cover rounded shadow w-450 h-450"
            src={place.placeImg}
          ></img>
          {place.placeAddr && place.placeAddr.trim() !== "" ? (
            <MapComponent placeAddr={place.placeAddr} />
          ) : (
            <p>주소 정보가 없습니다.</p>
          )}
        </div>
        <div className="w-450">
          <div className="text-xl whitespace-pre-line flex flex-col gap-10 ">
            <div>
              <p className="text-2xl py-2">위치</p>
              <div className="flex">
                - <div className="ml-4">{place.placeAddr}</div>
              </div>
            </div>
            <div>
              <p className="text-2xl py-2">전화번호</p>
              <div className="flex">
                -
                <div className="ml-4">
                  {place.placeTel || "전화번호 정보가 없습니다."}
                </div>
              </div>
            </div>
            <div>
              <p className="text-2xl py-2">운영시간</p>
              <div className="flex">
                -
                <div className="ml-4">
                  {place.placeTime || "시간 정보가 없습니다."}
                </div>
              </div>
            </div>
            <div className=" text-xl whitespace-pre-line">
              <p className="text-2xl py-2">메뉴</p>
              <div className="flex">
                -
                <div className="ml-4">
                  {place.placeDetail || "메뉴 정보가 없습니다."}
                </div>
              </div>
            </div>
          </div>
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
