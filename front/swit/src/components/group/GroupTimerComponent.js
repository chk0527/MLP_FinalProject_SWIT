import { useState, useEffect, useRef } from "react";
import {
  updateTimer,
} from "../../api/TimerApi";
import { getUserNickFromToken } from "../../util/jwtDecode"; // JWT 디코딩 유틸리티 함수
import "react-datepicker/dist/react-datepicker.css";

const GroupTimerComponent = ({ studyNo }) => {
  const [stopwatches, setStopwatches] = useState([]); // 스톱워치 객체 관리
  const [currentTimer, setCurrentTimer] = useState(null); // 현재 타이머 값 관리
  const [currentStopwatch, setCurrentStopwatch] = useState(null); // 현재 스톱워치 값 관리
  const intervalTimerIds = useRef({}); // 각 타이머의 인터벌 ID 관리
  const [isTimerEditing, setIsTimerEditing] = useState(false); // 제목 입력창 활성화 상태 관리
  const [userNick, setUserNick] = useState(getUserNickFromToken()); // 로그인한 유저의 닉네임 관리

  // 서버 끄거나 페이지 나갈 때 일시정지 처리 기능함수
  const handleBeforeUnload = async () => {
    // 스톱워치가 작동 중일 때 처리
    if (currentStopwatch && currentStopwatch.running) {
      const updatedTimer = { ...currentStopwatch, running: false };
      await updateTimer(studyNo, currentStopwatch.timerNo, updatedTimer);
      setCurrentStopwatch(updatedTimer);
      localStorage.setItem(
        `currentStopwatch_${currentStopwatch.timerNo}`,
        JSON.stringify(updatedTimer)
      );

      const updatedStopwatches = stopwatches.map((t) =>
        t.timerNo === currentStopwatch.timerNo
          ? { ...t, running: false, time: currentStopwatch.time }
          : t
      );
      setStopwatches(updatedStopwatches);
      localStorage.setItem(
        `stopwatches_${studyNo}_${userNick}`,
        JSON.stringify(updatedStopwatches)
      );
    }
  };

  // 타이머를 로컬에서 불러오기(페이지 로드 시)
  useEffect(() => {
    const savedTimer = JSON.parse(
      localStorage.getItem(`currentTimer_${studyNo}_${userNick}`)
    );
    if (savedTimer) {
      setCurrentTimer(savedTimer);
      if (savedTimer.running) {
        const remainingTime = (savedTimer.endTime - Date.now()) / 1000;
        if (remainingTime > 0) {
          setCurrentTimer((prev) => ({
            ...prev,
            time: Math.ceil(remainingTime),
          }));
          handleStartTimer(); // 타이머 다시 시작
        } else {
          setCurrentTimer({ ...savedTimer, time: 0, running: false });
          localStorage.setItem(
            `currentTimer_${studyNo}_${userNick}`,
            JSON.stringify({ ...savedTimer, time: 0, running: false })
          );
        }
      }
    }
  }, []);

  // 타이머 작동 중에 페이지,서버 꺼지면 일시정지한 채로 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (intervalTimerIds.current) {
        clearInterval(intervalTimerIds.current);
      }
      if (currentTimer) {
        localStorage.setItem(
          `currentTimer_${studyNo}_${userNick}`,
          JSON.stringify({ ...currentTimer, running: false })
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentTimer, studyNo, userNick]);

  // ===================== 시간 포맷팅 처리 ==============================

  // 타이머 시간 계산 포맷팅
  const formatTimerTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return (
      <div className="flex justify-between items-center font-GSans">
        <p className="w-20 p-2 border border-yellow-100">{hours}</p>
        <p>시</p>
        <p className="w-20 p-2 border border-yellow-100">{minutes}</p>
        <p>분</p>
        <p className="w-20 p-2 border border-yellow-100">{seconds}</p>
        <p>초</p>
      </div>
    );
  };

  // ================== "타이머" 기능 핸들러 =========================

  // 타이머 생성
  const handleCreateTimer = () => {
    try {
      if (currentTimer) {
        alert("현재 실행 중인 타이머가 있습니다.");
        return;
      }
      const newTimer = { name: "", time: 1800, running: false }; // 기본값 30분
      setCurrentTimer(newTimer);
      setIsTimerEditing(true);
      localStorage.setItem(
        `currentTimer_${studyNo}_${userNick}`,
        JSON.stringify(newTimer)
      );
    } catch (error) {
      console.error("타이머 생성 실패 : ", error);
    }
  };

  // 타이머 삭제
  const handleDeleteTimer = () => {
    try {
      if (intervalTimerIds.current) {
        clearInterval(intervalTimerIds.current);
      }
      setCurrentTimer(null);
      localStorage.removeItem("currentTimer");
    } catch (error) {
      console.error("타이머 삭제 실패 : ", error);
    }
  };

  // 타이머 시작
  const handleStartTimer = () => {
    try {
      if (currentTimer.time <= 0) {
        alert("시간은 0보다 커야 합니다.");
        return;
      }
      if (intervalTimerIds.current) {
        clearInterval(intervalTimerIds.current);
      }
      const endTime = Date.now() + currentTimer.time * 1000;
      setCurrentTimer((prev) => ({ ...prev, running: true }));
      setIsTimerEditing(false); // 타이머 시작 시 제목 입력란 비활성화
      localStorage.setItem(
        `currentTimer_${studyNo}_${userNick}`,
        JSON.stringify({
          ...currentTimer,
          running: true,
          endTime,
        })
      );
      intervalTimerIds.current = setInterval(() => {
        const remainingTime = (endTime - Date.now()) / 1000;
        if (remainingTime <= 0) {
          clearInterval(intervalTimerIds.current);
          setCurrentTimer({ ...currentTimer, time: 0, running: false });
          localStorage.setItem(
            `currentTimer_${studyNo}_${userNick}`,
            JSON.stringify({
              ...currentTimer,
              time: 0,
              running: false,
            })
          );
          alert("타이머가 종료되었습니다.");
        } else {
          setCurrentTimer((prev) => ({
            ...prev,
            time: Math.ceil(remainingTime),
          }));
        }
      }, 1000);
    } catch (error) {
      console.error("타이머 시작 실패 : ", error);
    }
  };

  // 타이머 일시정지
  const handlePauseTimer = () => {
    try {
      if (intervalTimerIds.current) {
        clearInterval(intervalTimerIds.current);
      }
      setCurrentTimer((prev) => ({ ...prev, running: false }));
      localStorage.setItem(
        `currentTimer_${studyNo}_${userNick}`,
        JSON.stringify({
          ...currentTimer,
          running: false,
        })
      );
    } catch (error) {
      console.error("타이머 일시정지 실패 : ", error);
    }
  };

  // 타이머 정지(초기화)
  const handleStopTimer = () => {
    try {
      if (intervalTimerIds.current) {
        clearInterval(intervalTimerIds.current);
      }
      setCurrentTimer((prev) => ({ ...prev, time: 0, running: false }));
      localStorage.setItem(
        `currentTimer_${studyNo}_${userNick}`,
        JSON.stringify({
          ...currentTimer,
          time: 0,
          running: false,
        })
      );
    } catch (error) {
      console.error("타이머 정지/초기화 실패 : ", error);
    }
  };

  // ================== "날짜 범위로 검색" 기능 핸들러 =========================

  return (
    <div className="w-full space-y-4">
      {/* 오늘의 공부 시간 | 누적 공부 시간 */}
      {/* <div className="text-center my-4">
                {Object.entries(userStudyTimes).map(([userId, times]) => (
                    <div key={userId} className="mb-4">
                        <h3 className="text-2xl font-semibold">
                            {getUserNickFromToken(userId)}님의 오늘 공부한 시간: {formatStudyTime(times.today)}
                        </h3>
                        <h3 className="text-2xl font-semibold">
                            {getUserNickFromToken(userId)}님의 누적 공부 시간: {formatTotalStudyTime(times.total)}
                        </h3>
                    </div>
                ))}
            </div> */}

      {/*스톱워치 개인화면 */}
      <div className="flex flex-col md:flex-row justify-between w-full space-y-4 md:space-y-0 md:space-x-4 items-stretch">
        {/* 타이머 개인화면 */}
        <div className="flex flex-col w-full">
          <div className="bg-green-200 p-4 flex flex-col items-center rounded-lg">
            <FaClock className="text-4xl mb-2" />
            <h2 className="text-2xl font-semibold mb-4">타이머</h2>
            <div className="space-y-4 w-full">
              {currentTimer ? (
                <>
                  <input
                    type="text"
                    placeholder="타이머 이름"
                    value={currentTimer.name}
                    onChange={(e) =>
                      setCurrentTimer((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={currentTimer.running}
                  />
                  {!currentTimer.running ? (
                    <>
                      <div className="grid grid-cols-3 gap-2 justify-center">
                        <label className="flex flex-col items-center">
                          시
                          <input
                            type="number"
                            value={Math.floor(currentTimer.time / 3600)}
                            onChange={(e) => {
                              const hours = Math.max(0, e.target.value);
                              setCurrentTimer((prev) => ({
                                ...prev,
                                time:
                                  hours * 3600 + (prev ? prev.time % 3600 : 0),
                              }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                            disabled={currentTimer.running}
                          />
                        </label>
                        <label className="flex flex-col items-center">
                          분
                          <input
                            type="number"
                            value={Math.floor((currentTimer.time % 3600) / 60)}
                            onChange={(e) => {
                              const minutes = Math.max(0, e.target.value);
                              setCurrentTimer((prev) => ({
                                ...prev,
                                time:
                                  Math.floor(prev ? prev.time / 3600 : 0) *
                                    3600 +
                                  minutes * 60 +
                                  (prev ? prev.time % 60 : 0),
                              }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                            disabled={currentTimer.running}
                          />
                        </label>
                        <label className="flex flex-col items-center">
                          초
                          <input
                            type="number"
                            value={currentTimer.time % 60}
                            onChange={(e) => {
                              const seconds = Math.max(0, e.target.value);
                              setCurrentTimer((prev) => ({
                                ...prev,
                                time:
                                  Math.floor(prev ? prev.time / 3600 : 0) *
                                    3600 +
                                  Math.floor(
                                    (prev ? prev.time % 3600 : 0) / 60
                                  ) *
                                    60 +
                                  seconds,
                              }));
                            }}
                            className="w-full p-2 border border-gray-300 rounded"
                            disabled={currentTimer.running}
                          />
                        </label>
                      </div>
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={handleStartTimer}
                          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
                        >
                          시작
                        </button>
                        <button
                          onClick={handleStopTimer}
                          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                          초기화
                        </button>
                        <button
                          onClick={handleDeleteTimer}
                          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-mono text-center">
                        {formatTimerTime(currentTimer.time)}
                      </div>
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={handlePauseTimer}
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                          일시정지
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={handleCreateTimer}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    생성하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupTimerComponent;
