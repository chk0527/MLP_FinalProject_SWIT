import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import searchIcon from "../../img/search-icon.png";
import placeImg from "../../img/placeEx.jpg";

const PlaceListComponent = () => {
  return (
    //검색창
    <div className="relative w-full">
      <div className="absolute right-0 -top-28 text-right">
        <div className="text-xl">
          <input
            className="focus:outline-none"
            type="text"
            placeholder="이름검색"
          />
          <button>
            <img className="size-6" src={searchIcon}></img>
          </button>
        </div>
        <div className="text-2xl">
          <select className="focus:outline-none p-2">
            <option>지역</option>
            <option>서울</option>
            <option>경기도</option>
          </select>
        </div>
      </div>
      <div className="flex flex-row flex-wrap w-full justify-center">
        <div className="w-72 h-64 my-4 mx-8 border-solid border-2 border-gray-200 text-center">
          <div>
            <img src={placeImg}></img>
          </div>
          <div className="p-1">
            <p className="font-bold">경기도 부천시</p>
            <p>브리즈 스터디 카페 신중동점</p>
          </div>
        </div>
        <div className="w-72 h-64 my-4 mx-8 border-solid border-2 border-gray-200 text-center">
          <div>
            <img src={placeImg}></img>
          </div>
          <div className="p-1">
            <p className="font-bold">경기도 부천시</p>
            <p>브리즈 스터디 카페 신중동점</p>
          </div>
        </div>
        <div className="w-72 h-64 my-4 mx-8 border-solid border-2 border-gray-200 text-center">
          <div>
            <img src={placeImg}></img>
          </div>
          <div className="p-1">
            <p className="font-bold">경기도 부천시</p>
            <p>브리즈 스터디 카페 신중동점</p>
          </div>
        </div>
        <div className="w-72 h-64 my-4 mx-8 border-solid border-2 border-gray-200 text-center">
          <div>
            <img src={placeImg}></img>
          </div>
          <div className="p-1">
            <p className="font-bold">경기도 부천시</p>
            <p>브리즈 스터디 카페 신중동점</p>
          </div>
        </div>
        <div className="w-72 h-64 my-4 mx-8 border-solid border-2 border-gray-200 text-center">
          <div>
            <img src={placeImg}></img>
          </div>
          <div className="p-1">
            <p className="font-bold">경기도 부천시</p>
            <p>브리즈 스터디 카페 신중동점</p>
          </div>
        </div>
        <div className="w-72 h-64 my-4 mx-8 border-solid border-2 border-gray-200 text-center">
          <div>
            <img src={placeImg}></img>
          </div>
          <div className="p-1">
            <p className="font-bold">경기도 부천시</p>
            <p>브리즈 스터디 카페 신중동점</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceListComponent;
