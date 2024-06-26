import { useEffect, useState } from "react";

const MapComponent = ({ placeAddr }) => {
  //카카오맵 api
  const apiKey = "312e4647a38431cd979b5ac0e76d0051";
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        var coords = null;
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(`${placeAddr}`, function (result, status) {
          // 정상적으로 검색이 완료됐으면
          if (status === window.kakao.maps.services.Status.OK) {
            coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new window.kakao.maps.InfoWindow({
              content:
                '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>',
            });
            infowindow.open(map, marker);

            var options = {
              center: coords, // 초기 중심 좌표 (위도, 경도)
              level: 3, // 지도 확대 레벨
            };
            var map = new window.kakao.maps.Map(container, options);
            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });
          }
        });
      });
    });
  }, [placeAddr]);

  return <div id="map" className="w-450 h-450"></div>;
};

export default MapComponent;
