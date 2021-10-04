/* global kakao */
import React, { useEffect } from "react";
import cn from "classnames";
import "../styles/Map.scss";

const { kakao } = window;

const Map = () => {
  useEffect(() => {
    let container = document.getElementById("map");

    let options = {
      center: new window.kakao.maps.LatLng(35.85133, 127.734086),
      level: 13,
    };

    let map = new window.kakao.maps.Map(container, options);

    console.log("loading kakaomap");
  }, []);

  return (
    <div className={cn("Map")}>
      <div className={cn("MapContainer")} id="map">
      </div>
    </div>
  );
};

export default Map;