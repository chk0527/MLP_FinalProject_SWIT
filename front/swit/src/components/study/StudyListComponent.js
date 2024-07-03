import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import defaultImg from "../../img/defaultImage.png";
import { API_SERVER_HOST } from "../../api/StudyApi";
const host = API_SERVER_HOST;

const StudyListComponent = ({
  handleReadStudy,
  getStatusText,
  getStatusClass,
  studyList,
  loading,
}) => {
  //리스트 목록 애니메이션
  const [isHovered, setHovered] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (!currentItem) {
      setHovered(false);
    } else {
      setHovered(true);
    }
  }, [currentItem]);

  if (loading) {
    return <div>로딩</div>;
  }
  return (
    <div className="grid place-items-center grid-cols-4">
      {/* 스터디 목록을 카드 형식으로 출력 */}
      <AnimatePresence>
        {studyList.dtoList.map((study) => (
          <div
            key={study.studyNo}
            onMouseEnter={() => setCurrentItem(study.studyNo)}
            onMouseLeave={() => setCurrentItem(null)}
            onClick={() => handleReadStudy(study.studyNo,study.currentMemberCount)}
            className="relative w-full max-w-72 h-72 mb-8 rounded"
          >
            <img
              src={
                study.imageList && study.imageList.length > 0
                  ? `/api/study/display/${study.imageList[0].fileName}`
                  : defaultImg
              }
              className="w-full max-w-72 h-72 bg-cover rounded"
              alt={study.studyTitle}
            ></img>
            <div className="absolute w-full max-w-72 h-72 top-0 bg-black/50 text-white cursor-pointer rounded">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{
                  opacity:
                    isHovered && `${study.studyNo}` == currentItem ? 0 : 1,
                }}
              >
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
                <div className="absolute w-full bottom-0 p-8">
                  <p className="text-xl py-2">
                    #{study.studyOnline ? "비대면" : "대면"}
                    <br />#{study.studyAddr}
                  </p>
                  <p className="w-full max-w-60 truncate text-2xl text-ellipsis overflow-hidden">{study.studyTitle}</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: isHovered && `${study.studyNo}` == currentItem ? 1 : 0,
                border: "4px solid rgb(253 230 138)",
                scale: 0.8,
              }}
              className="absolute w-full max-w-72 h-72 bottom-0 p-10 cursor-pointer"
            >
              <div className="line-clamp-8 text-center text-white">
                {study.studyContent}
              </div>
            </motion.div>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default StudyListComponent;
