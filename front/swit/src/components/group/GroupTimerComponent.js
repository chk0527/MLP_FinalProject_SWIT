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
  const handleStartTimer = (autoStart = false) => {
    try {
      if (!autoStart && !currentTimer.name) {
        alert("타이머 이름을 입력해주세요.");
        return;
      }
      if (!autoStart && currentTimer.time <= 0) {
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
    <div>
      {/* 타이머 개인화면 */}
      <div className="border shadow bg-yellow-100 p-4 flex flex-col items-center rounded">
        <div className="w-full space-y-4">
          {currentTimer ? (
            <>
              {currentTimer.running ? (
                <>
                  {formatTimerTime(currentTimer.time)}
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={handlePauseTimer}
                      className="bg-yellow-300 text-white py-2 px-4 rounded hover:bg-yellow-400"
                    >
                      일시정지
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <input
                      type="number"
                      value={Math.floor(currentTimer.time / 3600)}
                      onChange={(e) => {
                        const hours = Math.max(0, e.target.value);
                        setCurrentTimer((prev) => ({
                          ...prev,
                          time: hours * 3600 + (prev ? prev.time % 3600 : 0),
                        }));
                      }}
                      className="w-20 p-2 border border-gray-300 rounded"
                      disabled={currentTimer.running}
                    />
                    <p>시</p>
                    <input
                      type="number"
                      value={Math.floor((currentTimer.time % 3600) / 60)}
                      onChange={(e) => {
                        const minutes = Math.max(0, e.target.value);
                        setCurrentTimer((prev) => ({
                          ...prev,
                          time:
                            Math.floor(prev ? prev.time / 3600 : 0) * 3600 +
                            minutes * 60 +
                            (prev ? prev.time % 60 : 0),
                        }));
                      }}
                      className="w-20 p-2 border border-gray-300 rounded"
                      disabled={currentTimer.running}
                    />
                    <p>분</p>
                    <input
                      type="number"
                      value={currentTimer.time % 60}
                      onChange={(e) => {
                        const seconds = Math.max(0, e.target.value);
                        setCurrentTimer((prev) => ({
                          ...prev,
                          time:
                            Math.floor(prev ? prev.time / 3600 : 0) * 3600 +
                            Math.floor((prev ? prev.time % 3600 : 0) / 60) * 60 +
                            seconds,
                        }));
                      }}
                      className="w-20 p-2 border border-gray-300 rounded"
                      disabled={currentTimer.running}
                    />
                    <p>초</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={handleStartTimer}
                      className="shadow bg-yellow-300 text-white py-2 px-4 rounded hover:bg-yellow-400"
                    >
                      시작
                    </button>
                    <button
                      onClick={handleStopTimer}
                      className="shadow bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
                    >
                      초기화
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
  );
};

export default GroupTimerComponent;