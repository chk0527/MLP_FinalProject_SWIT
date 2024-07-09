// src/components/common/FavoritePlacesModal.jsx
import React, { useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/CustomScroll.css"; // 커스텀 스크롤바 스타일을 위한 CSS 파일 임포트

const FavoritePlacesModal = ({
  favoritePlaces,
  onClose,
  handleFavorite,
  favoriteStatus,
}) => {
  useEffect(() => {}, [favoritePlaces]);

  return (
    <div className="fixed top-0 left-0 z-[1054] flex h-full w-full justify-center items-center bg-black bg-opacity-50">
      <div className="max-h-550 w-550 overflow-auto p-10 custom-scrollbar bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-8 flex items-center shadow-highlight">
          즐겨찾기 목록
        </h2>

        {favoritePlaces.map((place, index) => (
          <div
            key={place.placeNo}
            className="relative flex justify-between items-center text-center mb-8"
          >
            <div className="px-2">{index + 1}.</div>
            <Link to={`/place/read/${place.placeNo}`} state={1}>
              <div className=" text-start">
                <p className="text-2xl">
                  [{place.placeAddr.substring(3, 5)}] {place.placeName}
                </p>
              </div>
            </Link>
            <button
              onClick={() => handleFavorite(place.placeNo)}
              className="pb-2"
            >
              {favoriteStatus[place.placeNo] ? (
                <FaStar size={30} color="#FFF06B" />
              ) : (
                <FaRegStar size={30} color="#FFF06B" />
              )}
            </button>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="rounded bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 text-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoritePlacesModal;
