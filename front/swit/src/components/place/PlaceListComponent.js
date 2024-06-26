import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import { getUserIdFromToken } from "../../util/jwtDecode";
import { FaStar, FaRegStar } from "react-icons/fa";
import {
  isPlaceFavorite,
  addPlaceFavorite,
  removePlaceFavorite,
} from "../../api/PlaceApi";

const PlaceListComponent = ({
  currentPlaces,
  lastPlaceElementRef,
  isLoading,
}) => {
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const navigate = useNavigate();

  //즐겨찾기 기능
  const handleFavorite = async (placeNo) => {
    //로그인x
    const userId = getUserIdFromToken();
    if (!userId) {
      if (
        window.confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")
      ) {
        navigate("/login");
      }
      return;
    }

    //로그인o
    const isFavorite = favoriteStatus[placeNo];
    const request = isFavorite ? removePlaceFavorite : addPlaceFavorite;
    try {
      await request(userId, placeNo);
      setFavoriteStatus({
        ...favoriteStatus,
        [placeNo]: !isFavorite,
      });;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-wrap w-1300 font-GSans mb-20">
      <div className="md:grid place-items-center gap-16 md:grid-cols-3 ">
        {currentPlaces.map((place, index) => {
          if (currentPlaces.length === index + 1) {
            return (
              <div
                ref={lastPlaceElementRef}
                key={place.placeNo}
                className="relative w-350 h-350 text-center mb-8"
              >
                <Link
                  to={{ pathname: `/place/read/${place.placeNo}` }}
                  state={1}
                >
                  <div className="overflow-hidden">
                    <img
                      className="w-400 h-96 object-cover"
                      src={place.placeImg}
                      alt={place.placeName}
                    ></img>
                  </div>
                  <div className="pt-4 text-start">
                    <p className="font-bold my-2">
                      {place.placeAddr.substring(0, 6)}
                    </p>
                    <p className="text-2xl">{place.placeName}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleFavorite(place.placeNo)}
                  className="absolute bottom-0 right-3 mb-5"
                >
                  {favoriteStatus[place.placeNo] ? (
                    <FaStar size={30} color="#FFF06B" />
                  ) : (
                    <FaRegStar size={30} color="#FFF06B" />
                  )}
                </button>
              </div>
            );
          } else {
            return (
              <div
                ref={lastPlaceElementRef}
                key={place.placeNo}
                className="relative w-350 h-350 text-center mb-8"
              >
                <Link
                  to={{ pathname: `/place/read/${place.placeNo}` }}
                  state={1}
                >
                  <div className="overflow-hidden ">
                    <img
                      className="w-400 h-96 object-cover"
                      src={place.placeImg}
                      alt={place.placeName}
                    ></img>
                  </div>
                  <div className="pt-2 text-start">
                    <p className="font-bold my-2">
                      {place.placeAddr.substring(0, 6)}
                    </p>
                    <p className="text-2xl">{place.placeName}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleFavorite(place.placeNo)}
                  className="absolute bottom-0 right-3 mb-5"
                >
                  {favoriteStatus[place.placeNo] ? (
                    <FaStar size={30} color="#FFF06B" />
                  ) : (
                    <FaRegStar size={30} color="#FFF06B" />
                  )}
                </button>
              </div>
            );
          }
        })}
      </div>
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default PlaceListComponent;
