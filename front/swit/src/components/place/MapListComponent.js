import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import { getPlaceAllList, isPlaceFavorite, addPlaceFavorite, removePlaceFavorite } from "../../api/PlaceApi";
import searchIcon from "../../img/search-icon.png";
import PlaceListComponent from "./PlaceListComponent";
import { getUserIdFromToken } from "../../util/jwtDecode";
import { getMyStudy } from "../../api/StudyApi"; // isMember 함수를 가져옴
import PostComponent from "./PostComponent";
import { FaStar, FaRegStar } from "react-icons/fa";
import CommonModal from "../common/CommonModal";
import LoginRequireModal from "../common/LoginRequireModal";

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
  const apiKey = "b0eff766121570e5d6bb6985397aed73";
  const navigate = useNavigate(); // Initialize navigate
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  useEffect(() => {
    // 장소 목록 가져오기
    getPlaceAllList().then((data) => {
      setPlaceList(data);

      // 각 장소에 대한 즐겨찾기 상태 판별
      const userId = getUserIdFromToken();
      const status = {};
      data.forEach((place) => {
        if (userId) {
          isPlaceFavorite(userId, place.placeNo).then((isFavorite) => {
            status[place.placeNo] = isFavorite;
          });
        } else {
          status[place.placeNo] = false; // 비로그인 상태에서는 모두 즐겨찾기하지 않은 상태로 설정
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
          }, 1000);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, isLoading]
  );

  const currentPlaces = filteredPlaceList.slice(0, page * 9);

  useEffect(() => {
    setHasMore(filteredPlaceList.length > currentPlaces.length);
  }, [currentPlaces, filteredPlaceList]);

  const handleAddrChange = (address) => {
    setSearchText(address);
  };

  // 내 스터디 검색
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      getMyStudy(userId).then((data) => {
        setMyStudyData(data);
      });
    }
    else {
      setMyStudyData([])
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
      setModalMessage(isFavorite ? '즐겨찾기에서 삭제했습니다.' : '즐겨찾기에 추가했습니다.');
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative w-full font-GSans z-0">

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

      <div className="flex w-full justify-between px-8">
        <div className="text-5xl pb-16 font-blackHans">
          <div>스터디 장소</div>
        </div>
        <div>
          <div className="flex justify-end">
            <PostComponent setAddress={handleAddrChange}></PostComponent>
          </div>
          <div className="flex text-2xl">
            <button>즐겨찾기</button>
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
        currentPlaces={currentPlaces}
        lastPlaceElementRef={lastPlaceElementRef}
        isLoading={isLoading}
        favoriteStatus={favoriteStatus}
        handleFavorite={handleFavorite}
      />
    </div>
  );
};

export default MapListComponent;
