import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { getMainStudies,getAllStudies, getMyStudy, API_SERVER_HOST } from "../../api/StudyApi";
import { getUserIdFromToken } from "../../util/jwtDecode";
import roundGradient from "../../img/Rectangle23.png";
import { isMember, isLeader, memberCount } from "../../api/GroupApi";
import defaultImg from "../../img/defaultImage.png";
import { motion, AnimatePresence } from "framer-motion";
import useCustomMove from "../../hooks/useCustomMove";
import "./Banner.css";

const MyStudy = () => {
  const { StudyPage, StudySize, moveToStudy } = useCustomMove();
  const [studyList, setStudyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const userId = getUserIdFromToken();
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (!currentItem) {
      setHovered(false);
    } else {
      setHovered(true);
    }
  }, [currentItem]);

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
          // const allStudies = await getMainStudies('', '', '', userId, { StudyPage, StudySize });
          const allStudies = await getAllStudies('', '', '',null, userId, { StudyPage, StudySize });
          const studyListWithMemberCount = await Promise.all(
            allStudies.dtoList.map(async (study) => {
              const currentMemberCount = await memberCount(study.studyNo);
              return {
                ...study,
                currentMemberCount,
              };
            })
          );
          studies = studyListWithMemberCount;
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
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: true,  
    centerMode: false,
    draggable: false,
    spaceBetween: 0, // 슬라이드 사이 여백
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-GSans -my-52 h-dvh bg-gray-200">
      <div className="flex justify-center">
        <div className="w-full z-0">
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
                      className="relative w-550 h-550 mb-8 rounded StudySlide"
                    >
                      <div className="flex justify-center items-center w-550 h-550">
                        <img
                          src={
                            study.imageList && study.imageList.length > 0
                              ? `/api/study/display/${study.imageList[0].fileName}`
                              : defaultImg
                          }
                          className="w-550 h-550 bg-cover rounded"
                          alt={study.studyTitle}
                        />
                      </div>
                      <div className="absolute w-550 h-550 top-0 bg-black/50 text-white cursor-pointer rounded">
                        <motion.div
                          initial={{ opacity: 1 }}
                          animate={{
                            opacity:
                              hovered && `${study.studyNo}` == currentItem
                                ? 0
                                : 1,
                          }}
                        >
                          <div className="flex justify-between p-8">
                            <div className="flex gap-4">
                              <p
                                className={`px-2 rounded pt-1 ${getStatusClass(
                                  study
                                )}`}
                              >
                                {getStatusText(study)}
                              </p>
                              <p className="px-2 pt-1 rounded bg-gray-500/50">
                                {study.studySubject}
                              </p>
                            </div>
                            <p>
                              {study.currentMemberCount}/{study.studyHeadcount}
                              명
                            </p>
                          </div>
                          <div className="absolute bottom-0 p-8">
                            <p className="text-xl py-2">
                              #{study.studyOnline ? "비대면" : "대면"}
                              <br />#{study.studyAddr}
                            </p>
                            <p className="w-60 truncate text-2xl">
                              {study.studyTitle}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                      {hovered === study.studyNo && (
                        <div className="absolute w-550 h-550 bottom-0 p-10 cursor-pointer border-4 border-yellow-200 scale-75">
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
                      onMouseEnter={() => setCurrentItem(study.studyNo)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleReadStudy(study.studyNo)}
                      className="relative w-550 h-550 mb-8 mx-4 rounded"
                    >
                      <div className="flex justify-center items-center w-550 h-550">
                        <img
                          src={
                            study.imageList && study.imageList.length > 0
                              ? `/api/study/display/${study.imageList[0].fileName}`
                              : defaultImg
                          }
                          className="w-550 h-550 bg-cover rounded"
                          alt={study.studyTitle}
                        />
                      </div>
                      <div className="absolute w-550 h-550 top-0 bg-black/50 text-white cursor-pointer rounded">
                        <motion.div
                          initial={{ opacity: 1 }}
                          animate={{
                            opacity:
                              hovered && `${study.studyNo}` == currentItem
                                ? 0
                                : 1,
                          }}
                        >
                          <div className="flex justify-between p-8">
                            <div className="flex gap-4">
                              <p
                                className={`px-2 rounded pt-1 ${getStatusClass(
                                  study
                                )}`}
                              >
                                {getStatusText(study)}
                              </p>
                              <p className="px-2 pt-1 rounded bg-gray-500/50">
                                {study.studySubject}
                              </p>
                            </div>
                            <p>
                              {study.currentMemberCount}/{study.studyHeadcount}
                              명
                            </p>
                          </div>
                          <div className="absolute bottom-0 p-8">
                            <p className="text-xl py-2">
                              #{study.studyOnline ? "비대면" : "대면"}
                              <br />#{study.studyAddr}
                            </p>
                            <p className="w-60 truncate text-2xl">
                              {study.studyTitle}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                      {hovered === study.studyNo && (
                        <div className="absolute w-550 h-550 bottom-0 p-10 cursor-pointer border-4 border-yellow-200 scale-75">
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
              <p className="text-center">가입된 스터디가 없습니다.</p>
            )
          ) : (
            <Slider {...settings} className="slider-container">
              {studyList.map((study) => (
                <div
                  key={study.studyNo}
                  onMouseEnter={() => setCurrentItem(study.studyNo)}
                  onMouseLeave={() => setCurrentItem(null)}
                  onClick={() => handleReadStudy(study.studyNo)}
                  className="relative w-550 h-550 mb-8 mx-1 rounded"
                >
                  <div className="flex justify-center items-center w-550 h-550">
                    <img
                      src={
                        study.imageList && study.imageList.length > 0
                          ? `/api/study/display/${study.imageList[0].fileName}`
                          : defaultImg
                      }
                      className="w-550 h-550 bg-cover rounded"
                      alt={study.studyTitle}
                    />
                  </div>
                  <div className="absolute w-550 h-550 top-0 bg-black/50 text-white cursor-pointer rounded">
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{
                        opacity:
                          hovered && `${study.studyNo}` == currentItem ? 0 : 1,
                      }}
                    >
                      <div className="flex justify-between p-8">
                        <div className="flex gap-4">
                          <p
                            className={`px-2 rounded pt-1 ${getStatusClass(
                              study
                            )}`}
                          >
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
                        <p className="w-full max-w-60 truncate text-2xl text-ellipsis overflow-hidden">
                          {study.studyTitle}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity:
                        hovered && `${study.studyNo}` == currentItem ? 1 : 0,
                      border: "4px solid rgb(253 230 138)",
                      scale: 0.8,
                    }}
                    className="absolute w-550 h-550 bottom-0 p-10 cursor-pointer border-4 border-yellow-200 scale-75"
                  >
                    <div className="line-clamp-8 text-center text-white">
                      {study.studyContent}
                    </div>
                  </motion.div>
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
