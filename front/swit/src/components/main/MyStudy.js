import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { getAllStudies, getMyStudy, API_SERVER_HOST } from "../../api/StudyApi";
import { getUserIdFromToken } from "../../util/jwtDecode";
import roundGradient from "../../img/Rectangle23.png";
import { isMember, isLeader, memberCount } from "../../api/GroupApi";
import defaultImg from "../../img/defaultImage.png";
import useCustomMove from "../../hooks/useCustomMove";


const MyStudy = () => {
  const { StudyPage, StudySize, moveToStudy } = useCustomMove();
  const [studyList, setStudyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchStudies = async () => {
      setLoading(true);
      let studies = [];
      try {
        if (userId) {
          const userStudies = await getMyStudy(userId);
          const studyListWithStatus = await Promise.all(
            userStudies.map(async (study) => {
              let leaderStatus = false;
              let memberStatus = userId ? -1 : -2;
              let currentMemberCount = 0;
              if (userId) {
                leaderStatus = await isLeader(study.studyNo);
                memberStatus = await isMember(userId, study.studyNo);
              }
              currentMemberCount = await memberCount(study.studyNo);
              return {
                ...study,
                isLeader: leaderStatus,
                isMemberStatus: memberStatus,
                currentMemberCount,
              };
            })
          );

          studies = studyListWithStatus.sort((a, b) => {
            if (a.isLeader && !b.isLeader) return -1;
            if (!a.isLeader && b.isLeader) return 1;
            if (a.isMemberStatus === 1 && b.isMemberStatus !== 1) return -1;
            if (a.isMemberStatus !== 1 && b.isMemberStatus === 1) return 1;
            if (a.isMemberStatus === 0 && b.isMemberStatus !== 0) return -1;
            if (a.isMemberStatus !== 0 && b.isMemberStatus === 0) return 1;
            return 0;
          });
        } else {
          const allStudies = await getAllStudies('', '', '', false, userId, { StudyPage, StudySize });
          studies = allStudies.dtoList;
        }
        setStudyList(studies);
      } catch (error) {
        console.error("Error fetching studies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, [userId, StudyPage, StudySize]);

  const getStatusText = (study) => {
    if (study.isLeader) {
      return "방장";
    }
    switch (study.isMemberStatus) {
      case 1:
        return "참여중";
      case 0:
        return "승인대기";
      case 2:
        return "승인거절";
      case 3:
        return "추방";
      default:
        return "미가입";
    }
  };

  const getStatusClass = (study) => {
    if (study.isLeader) {
      return "bg-blue-500";
    }
    switch (study.isMemberStatus) {
      case 1:
        return "bg-green-500";
      case 0:
        return "bg-yellow-500";
      case 2:
        return "bg-red-500";
      case 3:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleReadStudy = async (studyNo) => {
    try {
      if (!userId) {
        navigate(`/study/read/${studyNo}`, { state: 0 });
        return;
      }
      const isLeaderStatus = await isLeader(studyNo);
      if (isLeaderStatus) {
        navigate(`/study/group/${studyNo}`, { state: 0 });
        return;
      }
      const isMemberStatus = await isMember(userId, studyNo);
      if (isMemberStatus === 1) {
        navigate(`/study/group/${studyNo}`, { state: 0 });
      } else {
        navigate(`/study/read/${studyNo}`, { state: 0 });
      }
    } catch (error) {
      console.error("Error handling study click:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: false,
    centerMode: false,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-GSans">
      <div className="flex justify-center">
        <div className="overflow-hidden px-10 pt-28 pb-10 w-1900">
          <p
            className="mx-24 my-5 text-2xl w-56 py-4 text-center bg-mainBg"
            style={{ backgroundImage: `url(${roundGradient})` }}
          >
            나의 스터디
          </p>
          {userId ? (
            studyList.length > 0 ? (
              //스터디 4개 이상
              studyList.length >= 4 ? (
                <Slider {...settings} className="slider-container">
                  {studyList.map((study) => (
                    <div
                      key={study.studyNo}
                      onMouseEnter={() => setHovered(study.studyNo)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleReadStudy(study.studyNo)}
                      className="relative w-72 h-72 mb-8 rounded"
                    >
                      <div className="flex justify-center items-center w-72 h-72">
                        <img
                          src={
                            study.imageList && study.imageList.length > 0
                              ? `${API_SERVER_HOST}/api/study/display/${study.imageList[0].fileName}`
                              : defaultImg
                          }
                          className="w-72 h-72 bg-cover rounded"
                          alt={study.studyTitle}
                        />
                      </div>
                      <div className="absolute w-72 h-72 top-0 bg-black/50 text-white cursor-pointer rounded">
                        <div className="flex justify-between p-8">
                          <div className="flex gap-4">
                            <p className={`px-2 rounded pt-1 ${getStatusClass(study)}`}>
                              {getStatusText(study)}
                            </p>
                            <p className="px-2 pt-1 rounded bg-gray-500/50">
                              {study.studySubject}
                            </p>
                          </div>
                          <p>
                            {study.currentMemberCount}/{study.studyHeadcount}명
                          </p>
                        </div>
                        <div className="absolute bottom-0 p-8">
                          <p className="text-xl py-2">
                            #{study.studyOnline ? "비대면" : "대면"}
                            <br />#{study.studyAddr}
                          </p>
                          <p className="w-60 truncate text-2xl">{study.studyTitle}</p>
                        </div>
                      </div>
                      {hovered === study.studyNo && (
                        <div className="absolute w-72 h-72 bottom-0 p-10 cursor-pointer border-4 border-yellow-200 scale-75">
                          <div className="line-clamp-8 text-center text-white">
                            {study.studyContent}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </Slider>
              ) : (
                //스터디 3개 이하
                <div className="flex flex-wrap justify-start ml-24 mt-10">
                  {studyList.map((study) => (
                    <div
                      key={study.studyNo}
                      onMouseEnter={() => setHovered(study.studyNo)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleReadStudy(study.studyNo)}
                      className="relative w-72 h-72 mb-8 mx-4 rounded"
                    >
                      <div className="flex justify-center items-center w-72 h-72">
                        <img
                          src={
                            study.imageList && study.imageList.length > 0
                              ? `${API_SERVER_HOST}/api/study/display/${study.imageList[0].fileName}`
                              : defaultImg
                          }
                          className="w-72 h-72 bg-cover rounded"
                          alt={study.studyTitle}
                        />
                      </div>
                      <div className="absolute w-72 h-72 top-0 bg-black/50 text-white cursor-pointer rounded">
                        <div className="flex justify-between p-8">
                          <div className="flex gap-4">
                            <p className={`px-2 rounded pt-1 ${getStatusClass(study)}`}>
                              {getStatusText(study)}
                            </p>
                            <p className="px-2 pt-1 rounded bg-gray-500/50">
                              {study.studySubject}
                            </p>
                          </div>
                          <p>
                            {study.currentMemberCount}/{study.studyHeadcount}명
                          </p>
                        </div>
                        <div className="absolute bottom-0 p-8">
                          <p className="text-xl py-2">
                            #{study.studyOnline ? "비대면" : "대면"}
                            <br />#{study.studyAddr}
                          </p>
                          <p className="w-60 truncate text-2xl">{study.studyTitle}</p>
                        </div>
                      </div>
                      {hovered === study.studyNo && (
                        <div className="absolute w-72 h-72 bottom-0 p-10 cursor-pointer border-4 border-yellow-200 scale-75">
                          <div className="line-clamp-8 text-center text-white">
                            {study.studyContent}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p className="text-center">스터디가 없습니다.</p>
            )
          ) : (
            <Slider {...settings} className="slider-container">
              {studyList.map((study) => (
                <div
                  key={study.studyNo}
                  onMouseEnter={() => setHovered(study.studyNo)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleReadStudy(study.studyNo)}
                  className="relative w-72 h-72 mb-8 rounded"
                >
                  <div className="flex justify-center items-center w-72 h-72">
                    <img
                      src={
                        study.imageList && study.imageList.length > 0
                          ? `${API_SERVER_HOST}/api/study/display/${study.imageList[0].fileName}`
                          : defaultImg
                      }
                      className="w-72 h-72 bg-cover rounded"
                      alt={study.studyTitle}
                    />
                  </div>
                  <div className="absolute w-72 h-72 top-0 bg-black/50 text-white cursor-pointer rounded">
                    <div className="flex justify-between p-8">
                      <div className="flex gap-4">
                        <p className={`px-2 rounded pt-1 ${getStatusClass(study)}`}>
                          {getStatusText(study)}
                        </p>
                        <p className="px-2 pt-1 rounded bg-gray-500/50">
                          {study.studySubject}
                        </p>
                      </div>
                      <p>
                        {study.currentMemberCount}/{study.studyHeadcount}명
                      </p>
                    </div>
                    <div className="absolute bottom-0 p-8">
                      <p className="text-xl py-2">
                        #{study.studyOnline ? "비대면" : "대면"}
                        <br />#{study.studyAddr}
                      </p>
                      <p className="w-60 truncate text-2xl">{study.studyTitle}</p>
                    </div>
                  </div>
                  {hovered === study.studyNo && (
                    <div className="absolute w-72 h-72 bottom-0 p-10 cursor-pointer border-4 border-yellow-200 scale-75">
                      <div className="line-clamp-8 text-center text-white">
                        {study.studyContent}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStudy;
