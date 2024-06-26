import { Link } from "react-router-dom";

const PlaceListComponent = ({ currentPlaces, lastPlaceElementRef, isLoading }) => {
  return (
    <div className="flex-wrap w-1300 font-GSans mb-20">
      <div className="md:grid place-items-center gap-16 md:grid-cols-3 ">
        {currentPlaces.map((place, index) => {
          if (currentPlaces.length === index + 1) {
            return (
              <div
                ref={lastPlaceElementRef}
                key={place.placeNo}
                className="w-350 h-350 text-center mb-8"
              >
                <Link to={{ pathname: `/place/read/${place.placeNo}` }} state={1}>
                  <div className="overflow-hidden">
                    <img
                      className="w-400 h-96 object-cover"
                      src={place.placeImg}
                      alt={place.placeName}
                    ></img>
                  </div>
                  <div className="pt-4 text-start">
                    <p className="font-bold my-2">{place.placeAddr.substring(0, 6)}</p>
                    <p className="text-2xl">{place.placeName}</p>
                  </div>
                </Link>
              </div>
            );
          } else {
            return (
              <div key={place.placeNo} className="w-350 h-350 text-center mb-8">
                <Link to={{ pathname: `/place/read/${place.placeNo}` }} state={1}>
                  <div className="overflow-hidden ">
                    <img
                      className="w-400 h-96 object-cover"
                      src={place.placeImg}
                      alt={place.placeName}
                    ></img>
                  </div>
                  <div className="pt-2 text-start">
                    <p className="font-bold my-2">{place.placeAddr.substring(0, 6)}</p>
                    <p className="text-2xl">{place.placeName}</p>
                  </div>
                </Link>
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
