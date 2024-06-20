import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { getPlaceAllList } from "../../api/PlaceApi";
import searchIcon from "../../img/search-icon.png";

const MapListComponent = () => {
  // 스터디 장소 전체 리스트
  const [placeList, setPlaceList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPlaceAllList().then((data) => {
      setPlaceList(data);
    });
  }, []);

  // 주소 검색 관련 상태 및 이벤트 핸들러
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState(""); //검색주소
  const [currentState, setCurrentState] = useState(""); //현재위치주소

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  const handleButton = () => {
    setSearchText(inputText);
  };

  // 필터링된 장소 목록 상태
  const [filteredPlaceList, setFilteredPlaceList] = useState([]);

  // 카카오맵 관련 상태 및 이펙트
  const apiKey = "b0eff766121570e5d6bb6985397aed73";
  let map = null;

  useEffect(() => {
    // Geolocation API를 사용하여 현재 위치를 가져옵니다.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCurrentState(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error fetching current location:", error);
          setCurrentState("서울시"); // 오류 발생 시 기본값으로 서울시 설정
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentState("서울시"); // Geolocation을 지원하지 않는 경우 기본값으로 서울시 설정
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

        map = new window.kakao.maps.Map(container, options);

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

        // 경계 내의 주소에 대해 마커를 표시하는 함수
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

                          resolve(place); // 해당 장소를 promise resolve에 전달
                        } else {
                          resolve(null); // 경계 내에 없는 경우 null을 resolve
                        }
                      } else {
                        resolve(null); // 검색 결과가 없는 경우 null을 resolve
                      }
                    }
                  );
                }, index * 10); // 일정 시간 간격 (10ms)으로 요청을 보냅니다.
              })
            );
          });

          Promise.all(promises).then((results) => {
            // 결과를 필터링하여 null이 아닌 장소만 필터드 장소 리스트에 추가
            const filteredPlaces = results.filter((place) => place !== null);
            setFilteredPlaceList(filteredPlaces);
            console.log("확인용 : ", filteredPlaces); // 정상적으로 필터링된 장소들을 출력
          });
        };

        // 지도 이동 및 줌 변경 이벤트
        window.kakao.maps.event.addListener(map, "dragend", () => {
          const bounds = map.getBounds();
          displayMarkers(bounds);
        });

        window.kakao.maps.event.addListener(map, "zoom_changed", () => {
          const bounds = map.getBounds();
          displayMarkers(bounds);
        });

        // 초기 마커 표시
        displayMarkers(map.getBounds());
      });
    });
  }, [searchText, placeList]); // searchText 또는 placeList가 변경될 때마다 지도를 업데이트합니다.

  // 무한 스크롤 관련 로직
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
          }, 700);
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
              placeholder="주소 검색"
              onChange={handleInput}
            />
            <button type="button" onClick={handleButton}>
              <img className="size-6" src={searchIcon} alt="Search"></img>
            </button>
          </div>
        </div>
      </div>
      {/* 맵 */}
      <div id="map" className="w-full h-650 border-2 border-black mb-16"></div>
      {/* 목록 */}
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
                </div>
              );
            } else {
              return (
                <div
                  key={place.placeNo}
                  className="w-350 h-350 text-center mb-8"
                >
                  <Link
                    to={{ pathname: `/place/read/${place.placeNo}` }}
                    state={1}
                  >
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
    </div>
  );
};

export default MapListComponent;
