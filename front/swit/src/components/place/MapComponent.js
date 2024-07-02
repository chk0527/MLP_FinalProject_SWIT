import { useEffect } from "react";

const MapComponent = ({ placeAddr }) => {
  const apiKey = "312e4647a38431cd979b5ac0e76d0051";

  useEffect(() => {
    if (!placeAddr || placeAddr.trim() === "") {
      console.error("Invalid place address");
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(placeAddr, function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            const options = {
              center: coords,
              level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);

            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });
          } else {
            console.error("Failed to search address", status);
          }
        });
      });
    });

    return () => {
      document.head.removeChild(script);
    };
  }, [placeAddr]);

  return <div id="map" className="w-450 h-450 rounded shadow"></div>;
};

export default MapComponent;
