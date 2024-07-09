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
import LoginRequireModal from "../common/LoginRequireModal";
import CommonModal from "../common/CommonModal";

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
      setShowLoginModal(true);
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
      setModalMessage(isFavorite ? '즐겨찾기에서 삭제했습니다.' : '즐겨찾기에 추가했습니다.');
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="font-GSans min-h-screen bg-white">
      {showLoginModal && (
        <LoginRequireModal callbackFn={() => setShowLoginModal(false)} />
      )}

      {showModal && (
        <CommonModal
          modalMessage={modalMessage}
          callbackFn={() => setShowModal(false)}
          closeMessage="확인"
        />
      )}

      {/* <div className="py-6 flex justify-center items-center bg-yellow-100 shadow-md"> */}
      <div className="py-6 flex justify-center items-center border-gray-400 border-b-4">
        <h1 className="text-4xl font-bold text-gray-800">
          [{place.placeAddr.substring(0, 2)}] {place.placeName}
        </h1>
        <button onClick={() => handleFavorite(place.placeNo)} className="ml-4 mb-2">
          {favoriteStatus[place.placeNo] ? (
            <FaStar size={30} color="#FFD700" />
          ) : (
            <FaRegStar size={30} color="#FFD700" />
          )}
        </button>
      </div>
      <div className="container mx-auto p-6 flex flex-col items-center gap-12 mt-10">
        <img
          className="object-cover rounded shadow-md w-650 h-96 transition-transform duration-300 transform hover:scale-105"
          src={place.placeImg}
          alt={place.placeName}
        />
        <div className="bg-white rounded  p-8 w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-4 rounded">
            <h2 className="text-2xl font-semibold shadow-highlight mb-2 flex items-center">
              <img
                src={`${process.env.PUBLIC_URL}/icon_map.png`}
                className="w-7 mr-2 relative bottom-1"
                alt="• "
              />
              위치
            </h2>
            <p className="text-xl">{place.placeAddr}</p>
          </div>
          <div className="p-4 rounded">
            <h2 className="text-2xl font-semibold shadow-highlight mb-2 flex items-center">
              <img
                src={`${process.env.PUBLIC_URL}/icon_phone.png`}
                className="w-7 mr-2 relative bottom-1"
                alt="• "
              />
              전화번호
            </h2>
            <p className="text-xl">
              {place.placeTel || "전화번호 정보가 없습니다."}
            </p>
          </div>
          <div className="p-4 rounded">
            <h2 className="text-2xl font-semibold shadow-highlight mb-2 flex items-center">
              <img
                src={`${process.env.PUBLIC_URL}/icon_clock.png`}
                className="w-7 mr-2 relative bottom-1"
                alt="• "
              />
              운영 시간
            </h2>
            <p className="text-xl">
              {place.placeTime || "시간 정보가 없습니다."}
            </p>
          </div>
          <div className="p-4 rounded">
            <h2 className="text-2xl font-semibold shadow-highlight mb-2 flex items-center">
              <img
                src={`${process.env.PUBLIC_URL}/icon_info.png`}
                className="w-7 mr-2 relative bottom-1"
                alt="• "
              />
              상세 정보
            </h2>

            <p className="text-xl whitespace-pre-line">
              {place.placeDetail || "메뉴 정보가 없습니다."}
            </p>
          </div>
        </div>
        <div className="w-full md:w-3/4 mt-8">
          <h2 className="text-2xl text-start font-semibold text-gray-800 py-4 border-b-2 border-gray-400 ">
            상세 위치
          </h2>
          {place.placeAddr && place.placeAddr.trim() !== "" ? (
            <div className="flex justify-center mt-4">
              <MapComponent placeAddr={place.placeAddr} />
            </div>
          ) : (
            <p>주소 정보가 없습니다.</p>
          )}
        </div>
        <div className="flex justify-center my-12 w-full md:w-3/4">
          <Link to={{ pathname: "/place/list" }} state={1}>
            <button
              type="button"
              className="rounded p-3 m-2 text-xl w-32 text-white bg-yellow-500 hover:bg-yellow-600 shadow-md"
            >
              목록
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailComponent;
