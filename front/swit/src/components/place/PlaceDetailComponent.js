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
      if (
        window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")
      ) {
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
      <div className="flex justify-center border-gray-700 border-b-2">
        <h1 className="text-3xl font-bold mb-4">
          [{place.placeAddr.substring(0, 2)}] {place.placeName}
        </h1>
        <button
          onClick={() => handleFavorite(place.placeNo)}
          className="m-0 ml-3 p-0 -mt-7"
        >
          {favoriteStatus[place.placeNo] ? (
            <FaStar size={30} color="#FFF06B" />
          ) : (
            <FaRegStar size={30} color="#FFF06B" />
          )}
        </button>
      </div>
      <div className="flex justify-center mt-20 gap-20">
        <div className="flex flex-col gap-20">
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
        <table className="h-full w-450">
          <tbody>
            <tr>
              <th className="text-2xl p-2 pr-4">· 위치</th>
            </tr>
            <tr>
              <td align="center" className="text-xl p-2">
                {place.placeAddr}
              </td>
            </tr>
            <tr>
              <th className="text-2xl p-2 pt-10 pr-4">· 전화번호</th>
            </tr>
            <tr>
              <td align="center" className="text-xl  p-2">
                {place.placeTel || "전화번호 정보가 없습니다."}
              </td>
            </tr>
            <tr>
              <th className="text-2xl p-2 pt-10 pr-4">· 운영시간</th>
            </tr>
            <tr>
              <td align="center" className="text-xl  p-2">
                {place.placeTime || "시간 정보가 없습니다."}
              </td>
            </tr>
            <tr>
              <th className="text-2xl p-2 pt-10 pr-4">· 메뉴</th>
            </tr>
            <tr>
              <td align="center" className="text-xl  whitespace-pre-line p-2">
                {place.placeDetail || "메뉴 정보가 없습니다."}
              </td>
            </tr>
          </tbody>
        </table>
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
