import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const PlaceListComponent = ({
  currentPlaces,
  lastPlaceElementRef,
  isLoading,
  favoriteStatus,
  handleFavorite,
}) => {
  return (
    <div className="flex-wrap max-w-1300 font-GSans mb-20">
      <div className="md:grid place-items-center gap-16 md:grid-cols-3 ">
        {currentPlaces.map((place, index) => (
          <div
            ref={index === currentPlaces.length - 1 ? lastPlaceElementRef : null}
            key={place.placeNo}
            className="relative w-350 h-350 text-center mb-8"
          >
            <Link to={{ pathname: `/place/read/${place.placeNo}` }} state={1}>
              <div className="overflow-hidden">
                <img
                  className="w-400 h-96 object-cover"
                  src={place.placeImg}
                  alt={place.placeName}
                />
              </div>
              <div className="pt-4 text-start">
                <p className="font-bold my-2">{place.placeAddr.substring(0, 6)}</p>
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
        ))}
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
