import { getPlaceDetail, getPlaceAllList } from "../../api/PlaceApi";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";
// 배너 배경

import banner2 from "../../img/banner2.jpg";
import banner3 from "../../img/banner3.jpg";
import roundGradient from "../../img/Rectangle23.png";

const initState = {
  placeNo: 0,
  placeName: "",
  placeAddr: "",
  placeTime: "",
  placeTel: "",
  placeDetail: "",
  placeImg: "",
};

function getRandomNumbers(max) {
  const numbers = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * max) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const PlaceRecommend = () => {
  const [places, setPlaces] = useState([
    initState,
    initState,
    initState,
    initState,
    initState,
    initState,
  ]);
  const [addrHashtags, setAddrHashtags] = useState([]); //주소->지역해시태그
  const [randomHashtags, setRandomHashtags] = useState([]);
  const [randomSentences, setRandomSentences] = useState([]);

  const hashtags = [
    "#공부하기좋은곳",
    "#조용한카페",
    "#자습실",
    "#편안한공간",
    "#집중력향상",
    "#프리미엄스터디카페",
    "#쾌적",
  ];

  const sentences = [
    "조용하고 집중하기 좋은 스터디카페",
    "효율적인 공부를 위한 완벽한 공간",
    "편안한 분위기에서 학습을",
    "집중력을 높이는 최적의 장소",
    "스터디카페에서 공부 효율을 높여보세요",
    "쾌적한 환경에서 공부를",
    "집중력이 필요한 순간, 스터디카페에서",
    "프리미엄 학습 공간, 스터디카페",
    "스터디카페에서 편안하게 자습하세요",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const allPlaces = await getPlaceAllList();
      const randomNumbers = getRandomNumbers(allPlaces.length);
      const placeDetails = await Promise.all(
        randomNumbers.map((num) => getPlaceDetail(num))
      );
      setPlaces(placeDetails);

      const tags = placeDetails.map((place) => {
        const parts = place.placeAddr.split(" ");
        if (parts[0] === "서울") {
          return parts
            .slice(0, 2)
            .map((part) => `#${part}`)
            .join(" ");
        } else if (parts[0] === "경기") {
          return parts
            .slice(0, 3)
            .map((part) => `#${part}`)
            .join(" ");
        } else {
          return parts
            .slice(0, 2)
            .map((part) => `#${parts[0]} ${parts[1]}`)
            .join(" ");
        }
      });
      setAddrHashtags(tags);

      const randomTags = placeDetails.map(() => getRandomElement(hashtags));
      setRandomHashtags(randomTags);

      const randomSentencesList = placeDetails.map(() =>
        getRandomElement(sentences)
      );
      setRandomSentences(randomSentencesList);
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,

    appendDots: (dots) => (
      <div
        style={{
          width: "100%",
          bottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ul> {dots} </ul>
      </div>
    ),
    dotsClass: "dots_custom",
  };

  return (
    <div className="font-GSans h-dvh">
      <div className="flex justify-center">
        <div className="overflow-hidden px-10 pb-10 w-1900">
          <p className=" text-5xl text-center font-blackHans my-14">
            스터디 장소 추천
          </p>
          <Slider {...settings}>
            {places.map((place, index) => (
              <div key={index}>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <p className="text-5xl font-blackHans">{place.placeName}</p>
                    <p className="text-3xl">{randomSentences[index]}</p>
                    <p className="text-3xl">
                      {addrHashtags[index]} {randomHashtags[index]}
                    </p>
                  </div>
                  <Link
                    to={{ pathname: `/place/read/${place.placeNo}` }}
                    state={1}
                  >
                    <div className="shadow text-2xl text-black bg-yellow-200 px-12 py-5 rounded">
                      보러가기
                    </div>
                  </Link>
                  <img
                    className="w-750 h-450 object-cover rounded"
                    src={place.placeImg}
                  ></img>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default PlaceRecommend;

