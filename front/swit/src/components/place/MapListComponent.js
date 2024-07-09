import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getPlaceAllList,
  isPlaceFavorite,
  addPlaceFavorite,
  removePlaceFavorite,
} from "../../api/PlaceApi";
import PlaceListComponent from "./PlaceListComponent";
import { getUserIdFromToken } from "../../util/jwtDecode";
import { getMyStudy } from "../../api/StudyApi";
import PostComponent from "./PostComponent";
import { FaStar, FaRegStar } from "react-icons/fa";
import CommonModal from "../common/CommonModal";
import LoginRequireModal from "../common/LoginRequireModal";
import FavoritePlacesModal from "./FavoritePlacesModal";

const MapListComponent = () => {
  const [placeList, setPlaceList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [filteredPlaceList, setFilteredPlaceList] = useState([]);
  const [myStudyData, setMyStudyData] = useState([]);
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [favoritePlaces, setFavoritePlaces] = useState([]);

  const apiKey = "b0eff766121570e5d6bb6985397aed73";

  const navigate = useNavigate();

  useEffect(() => {
    getPlaceAllList().then((data) => {
      setPlaceList(data);

      const userId = getUserIdFromToken();
      const status = {};
      data.forEach((place) => {
        if (userId) {
          isPlaceFavorite(userId, place.placeNo).then((isFavorite) => {
            status[place.placeNo] = isFavorite;
          });
        } else {
          status[place.placeNo] = false;
        }
      });
      setFavoriteStatus(status);
    });
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCurrentState(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error fetching current location:", error);
          setCurrentState("서울시");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentState("서울시");
    }
  }, []);

  useEffect(() => {
    if (!currentState) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const geocoder = new window.kakao.maps.services.Geocoder();
        const infowindow = new window.kakao.maps.InfoWindow({
          zIndex: 1,
        });

        const [latitude, longitude] = currentState.split(",");
        const coords = new window.kakao.maps.LatLng(latitude, longitude);

        const options = {
          center: coords,
          level: 4,
        };

        const map = new window.kakao.maps.Map(container, options);

        geocoder.addressSearch(searchText, function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            const moveLatLon = new window.kakao.maps.LatLng(
              result[0].y,
              result[0].x
            );
            map.setCenter(moveLatLon);
            console.log(moveLatLon);
          }
        });

        const displayMarkers = (bounds) => {
          const promises = [];

          placeList.forEach((place, index) => {
            promises.push(
              new Promise((resolve) => {
                setTimeout(() => {
                  geocoder.addressSearch(
                    place.placeAddr,
                    function (result, status) {
                      if (status === window.kakao.maps.services.Status.OK) {
                        const coords = new window.kakao.maps.LatLng(
                          result[0].y,
                          result[0].x
                        );
                        if (bounds.contain(coords)) {
                          const marker = new window.kakao.maps.Marker({
                            map: map,
                            position: coords,
                          });

                          window.kakao.maps.event.addListener(
                            marker,
                            "click",
                            () => {
                              infowindow.setContent(
                                `<div style="text-align:center;padding:6px 0;">${place.placeName}</div>`
                              );
                              infowindow.open(map, marker);
                            }
                          );

                          resolve(place);
                        } else {
                          resolve(null);
                        }
                      } else {
                        resolve(null);
                      }
                    }
                  );
                }, index * 10);
              })
            );
          });

          Promise.all(promises).then((results) => {
            const filteredPlaces = results.filter((place) => place !== null);
            setFilteredPlaceList(filteredPlaces);
          });
        };

        window.kakao.maps.event.addListener(map, "dragend", () => {
          const bounds = map.getBounds();
          displayMarkers(bounds);
        });

        window.kakao.maps.event.addListener(map, "zoom_changed", () => {
          const bounds = map.getBounds();
          displayMarkers(bounds);
        });

        displayMarkers(map.getBounds());
      });
    });
  }, [searchText, placeList]);

  const observer = useRef();
  const lastPlaceElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
            setIsLoading(false);
          }, 3000);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      getMyStudy(userId).then((data) => {
        setMyStudyData(data);
      });
    } else {
      setMyStudyData([]);
    }
  }, []);

  const myStudyList = myStudyData.map((myStudy) => ({
    no: myStudy.studyNo,
    value: myStudy.studyAddr,
    name: myStudy.studyTitle,
  }));

  const selectStudy = (e) => {
    const value = e.target.value;
    handleAddrChange(value);
  };

  // 즐겨찾기 추가/제거 함수
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
      setModalMessage(isFavorite ? "즐겨찾기에서 삭제했습니다." : "즐겨찾기에 추가했습니다.");
      setShowModal(true);

      // Update favoritePlaces
      if (isFavorite) {
        setFavoritePlaces((prevPlaces) =>
          prevPlaces.filter((place) => place.placeNo !== placeNo)
        );
      } else {
        const newFavoritePlace = placeList.find((place) => place.placeNo === placeNo);
        setFavoritePlaces((prevPlaces) => [...prevPlaces, newFavoritePlace]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowFavorites = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    const favorites = [];
    for (const placeNo in favoriteStatus) {
      if (favoriteStatus[placeNo]) {
        const place = placeList.find((place) => place.placeNo === parseInt(placeNo));
        if (place) {
          favorites.push(place);
        }
      }
    }
    setFavoritePlaces(favorites);
    setShowFavoriteModal(true);
  };

  const handleAddrChange = (address) => {
    setSearchText(address);
  };

  return (
    <div className="relative w-full font-GSans z-0">
      {showLoginModal && <LoginRequireModal callbackFn={() => setShowLoginModal(false)} />}
      {showModal && (
        <CommonModal modalMessage={modalMessage} callbackFn={() => setShowModal(false)} closeMessage="확인" />
      )}
      {showFavoriteModal && (
        <FavoritePlacesModal
          favoritePlaces={favoritePlaces}
          onClose={() => setShowFavoriteModal(false)}
          handleFavorite={handleFavorite} // 추가된 함수
          favoriteStatus={favoriteStatus} // 추가된 상태
        />
      )}
      <div className="flex w-full justify-between px-8">
        <div className="text-5xl pb-16 font-blackHans">
          <div>스터디 장소</div>
        </div>
        <div>
          <div className="flex justify-end">
            <PostComponent setAddress={handleAddrChange}></PostComponent>
          </div>
          <div className="flex text-2xl">
            <button onClick={handleShowFavorites}>즐겨찾기</button>
            {myStudyData ? (
              <select
                className="w-36 text-gray-900 rounded-lg focus:ring-none block p-2 mx-4"
                onChange={selectStudy}
              >
                <option value="">내 스터디</option>
                {myStudyList.map((study) => (
                  <option key={study.no} value={study.value}>
                    {study.name}
                  </option>
                ))}
              </select>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      <div id="map" className="w-full h-650 border-2 border-black mb-16"></div>
      <PlaceListComponent
        currentPlaces={filteredPlaceList}
        lastPlaceElementRef={lastPlaceElementRef}
        isLoading={isLoading}
        favoriteStatus={favoriteStatus}
        handleFavorite={handleFavorite}
      />
    </div>
  );
};

export default MapListComponent;
