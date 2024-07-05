import { getBoardList } from "../../api/BoardApi";
import React, { useState, useEffect } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import "./Banner.css";
import defaultImg from "../../img/defaultImage.png";
import { getUserIdFromToken } from "../../util/jwtDecode";
import bg from "../../img/boardBg.png";
import { motion, useAnimation } from "framer-motion"; // Framer Motion 라이브러리에서 motion과 useAnimation 임포트

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const BoardRecommend = () => {
  const { page, size, moveToBoardList, moveToBoardRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const userId = getUserIdFromToken();
  const controls = useAnimation(); // Framer Motion의 useAnimation 훅 사용

  useEffect(() => {
    // 페이지 크기를 4로 설정
    getBoardList({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const defaultHeight = (2.6 * windowHeight) / 5;

      if (position > 3 * windowHeight - defaultHeight) {
        // 스크롤 위치가 특정 지점에 도달하면 애니메이션 실행
        controls.start({
          opacity: 1,
          transition: { duration: 1 },
        });
      } else {
        // 스크롤 위치가 해당 지점을 벗어나면 애니메이션 초기화
        controls.start({
          opacity: 0,
          transition: { duration: 0.5 },
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls]);

  return (
    <div className="font-GSans bg-gray-200 w-full h-dvh relative">
      <div className="flex flex-col items-center justify-center">
        <p className="text-5xl text-center font-blackHans mb-16">최근 게시물</p>
        <div className="absolute top-20 text-3xl text-center">
          다양한 주제와 관심사를 공유하고 토론할 수 있는 <br />
          SWit 에서 자유롭게 이야기를 나누세요.
        </div>
        <img src={bg} className="absolute top-44 z-0 w-1300" />
        <motion.div // Framer Motion의 motion.div로 감싸서 애니메이션을 적용
          className="grid grid-cols-2 gap-x-650 gap-y-20"
          initial={{ opacity: 0 }} // 초기 상태 설정
          animate={controls} // 애니메이션을 controls 변수로 전달
        >
          {serverData.dtoList.slice(0, 4).map((board, index) => (
            <motion.div
              key={board.boardNo}
              onClick={() => moveToBoardRead(board.boardNo)}
              className="flex flex-col gap-4 p-8 w-96 h-96 bg-white shadow rounded-lg z-10"
              whileHover={{ scale: 1.05 }} // 호버 시 애니메이션
              whileTap={{ scale: 0.95 }} // 탭 시 애니메이션
            >
              <div className="flex items-center gap-8">
                <img
                  className="w-24 h-24 rounded-full shadow border"
                  src={defaultImg}
                  alt="user avatar"
                />
                <div className="font-bold text-gray-600">
                  <p className="text-xl">[ {board.boardCategory}게시판 ]</p>
                  <p>{board.userNick} 님</p>
                </div>
              </div>
              <div>
                <div className="w-fit max-w-full text-xl text-ellipsis shadow-highlight overflow-hidden whitespace-nowrap">
                  {board.boardTitle}
                </div>
                <div className="min-h-32 line-clamp-5">
                  <p className="mt-2">{board.boardContent}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => moveToBoardRead(board.boardNo)}
                  className="bg-black text-white w-32 text-center py-2 px-4 rounded"
                >
                  자세히보기
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BoardRecommend;
