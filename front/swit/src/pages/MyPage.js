import BasicLayout from "../layouts/BasicLayout";
import React, { useEffect, useState } from "react";
import MyProfileComponent from "../components/myPage/MyProfileComponent";
import MyStudyComponent from "../components/myPage/MyStudyComponent";
import MyFavoritesComponent from "../components/myPage/MyFavoritesComponent";
import MyPostComponent from "../components/myPage/MyPostComponent";
import MyInfoModifyComponent from "../components/myPage/MyInfoModifyComponent";
import { useParams, useNavigate } from "react-router-dom";

const MyPage = () => {
  const { userId } = useParams();
  const [view, setView] = useState("calendar");
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <BasicLayout>
      <div className="flex flex-col items-center font-GSans ">
        <MyProfileComponent userId={userId} />
        <div className="flex justify-center my-3 w-full text-2xl font-bold my-16">
          <span
            onClick={() => setView("MyProfile")}
            className={`mx-2 px-4 cursor-pointer ${
              view === "MyProfile" ? "text-2xl text-yellow-400" : "text-gray-500"
            }`}
          >
            내 정보 수정
          </span>
          <span className="mx-5">|</span>
          <span
            onClick={() => setView("MyStudy")}
            className={`mx-2 px-4 cursor-pointer ${
              view === "MyStudy" ? "text-2xl text-yellow-400" : "text-gray-500"
            }`}
          >
            스터디
          </span>
          <span className="mx-5">|</span>
          <span
            onClick={() => setView("MyFavorites")}
            className={`mx-2 px-4 cursor-pointer ${
              view === "MyFavorites"
                ? "text-2xl text-yellow-400"
                : "text-gray-500"
            }`}
          >
            즐겨찾기
          </span>
          <span className="mx-5">|</span>
          <span
            onClick={() => setView("MyPost")}
            className={`mx-2 px-4 cursor-pointer ${
              view === "MyPost" ? "text-2xl text-yellow-400" : "text-gray-500"
            }`}
          >
            작성글
          </span>
        </div>

        {view === "MyProfile" && (
          <div className="w-full">
            <MyInfoModifyComponent userId={userId}/>
          </div>
        )}
        {view === "MyStudy" && (
          <div className="w-full">
            <MyStudyComponent />
          </div>
        )}
        {view === "MyFavorites" && (
          <div className="w-full">
            <MyFavoritesComponent />
          </div>
        )}
        {view === "MyPost" && (
          <div className="w-full">
            <MyPostComponent />
          </div>
        )}
      </div>
    </BasicLayout>
  );
};

export default MyPage;
