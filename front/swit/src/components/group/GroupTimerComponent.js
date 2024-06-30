import { useState, useEffect, useRef } from "react";
import {
  getAllTimers,
  getUserTimers,
  addTimer,
  deleteTimer,
  updateTimer,
} from "../../api/TimerApi";
import {
  FaStopwatch,
  FaClock,
  FaBell,
  FaChevronDown,
  FaRedo,
  FaBookReader,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserNickFromToken } from "../../util/jwtDecode"; // JWT 디코딩 유틸리티 함수
import { isLeader } from "../../api/GroupApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GroupTimerComponent = ({ studyNo }) => {
  const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수
  const [stopwatches, setStopwatches] = useState([]); // 스톱워치 객체 관리
  const [currentTimer, setCurrentTimer] = useState(null); // 현재 타이머 값 관리
  const [currentStopwatch, setCurrentStopwatch] = useState(null); // 현재 스톱워치 값 관리
  const intervalTimerIds = useRef({}); // 각 타이머의 인터벌 ID 관리
  const intervalStopWatchIds = useRef({}); // 각 스톱워치의 인터벌 ID 관리
  const [isEditing, setIsEditing] = useState(false); // 제목 입력창 활성화 상태 관리
  const [isTimerEditing, setIsTimerEditing] = useState(false); // 제목 입력창 활성화 상태 관리
  const [userIsLeader, setUserIsLeader] = useState(false); // 방장 여부 식별
  const [userNick, setUserNick] = useState(getUserNickFromToken()); // 로그인한 유저의 닉네임 관리
  const [totalStudyTime, setTotalStudyTime] = useState({}); // 그룹원별 총 공부 시간

  // 날짜 범위 계산에 필요한 관리(방장 화면)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredStudyTimes, setFilteredStudyTimes] = useState({});

  // 닉네임별로 스탑워치 리스트 구분
  const userStopwatches = stopwatches.filter((sw) => sw.userNick === userNick);
  //조회 날짜 지정
  const filterStopwatchesByDateRange = (stopwatches, startDate, endDate) => {
    if (!startDate || !endDate) return [];

    // 시간 부분을 무시하고 날짜 부분만 비교하도록 startDate와 endDate를 설정
    const startOfDay = (date) => {
      //시작 시간은 0시 기준
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const endOfDay = (date) => {
      //끝 시간은 23시59분 기준
      const newDate = new Date(date);
      newDate.setHours(23, 59, 59, 999);
      return newDate;
    };

    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    return stopwatches.filter((stopwatch) => {
      const stopwatchStart = new Date(stopwatch.startAt);
      const stopwatchEnd = new Date(stopwatch.stopAt);
      return (
        (stopwatchStart >= start && stopwatchStart <= end) ||
        (stopwatchEnd >= start && stopwatchEnd <= end) ||
        (stopwatchStart <= start && stopwatchEnd >= end)
      );
    });
  };

  const filteredStopwatches = filterStopwatchesByDateRange(
    stopwatches,
    startDate,
    endDate
  );

  useEffect(() => {
    // studyNo에 따른 타이머/스톱워치 불러오기
    const fetchTimers = async () => {
      const userNickFromToken = getUserNickFromToken(); // 로그아웃 후 로그인 시 값을 다시 가져옴
      setUserNick(userNickFromToken); // 유저 닉네임 업데이트
      try {
        const isAdmin = await isLeader(studyNo);
        console.log("현재 당신은 리더입니까? : " + isAdmin);
        setUserIsLeader(isAdmin);

        // 방장이면 그룹원 전체의 스톱워치 조회
        // 그룹원이면 그룹원 본인 꺼만 조회
        const res = isAdmin
          ? await getAllTimers(studyNo)
          : await getUserTimers(studyNo, userNickFromToken);
        // 스톱워치들 설정
        setStopwatches(res);

        const savedStopwatches =
          JSON.parse(
            localStorage.getItem(`stopwatches_${studyNo}_${userNickFromToken}`)
          ) || [];
        const updatedStopwatches = res.map((timer) => {
          const savedTimer = savedStopwatches.find(
            (t) => t.timerNo === timer.timerNo
          );
          if (savedTimer) {
            // 로컬 스토리지의 time 값을 우선 적용
            return {
              ...timer,
              time: savedTimer.time ?? timer.time,
              running: savedTimer.running,
              elapsedTime: savedTimer.elapsedTime,
            };
          }
          return timer;
        });
        setStopwatches(updatedStopwatches);

        // 총 공부 시간 계산 및 설정
        setTotalStudyTime(calculateTotalStudyTime(updatedStopwatches));

        // 현재 작업 중인 스톱워치 설정
        // 다른 유저로 로그인하면 해당 유저의 currentStopwatch을 로컬에서 불러오기
        let initialStopwatch = null;
        updatedStopwatches.forEach((stopwatch) => {
          const savedStopwatch = JSON.parse(
            localStorage.getItem(`currentStopwatch_${stopwatch.timerNo}`)
          );
          if (savedStopwatch) {
            const fetchedStopwatch = updatedStopwatches.find(
              (timer) => timer.timerNo === savedStopwatch.timerNo
            );
            if (
              fetchedStopwatch &&
              fetchedStopwatch.userNick === userNickFromToken
            ) {
              initialStopwatch = {
                ...fetchedStopwatch,
                time: savedStopwatch.time,
              };
              if (fetchedStopwatch.running) {
                handleStartStopwatch({
                  ...fetchedStopwatch,
                  time: savedStopwatch.time,
                });
              }
            } else {
              localStorage.removeItem(`currentStopwatch_${stopwatch.timerNo}`);
            }
          }
        });
        if (!initialStopwatch && updatedStopwatches.length > 0) {
          initialStopwatch = updatedStopwatches.find(
            (sw) => sw.userNick === userNickFromToken
          );
        }
        setCurrentStopwatch(initialStopwatch);
      } catch (error) {
        console.error("타이머를 불러오는 데 실패했습니다:", error);
      }
    };
    fetchTimers();
  }, [studyNo, userNick]);

  // 타이머 및 스톱워치 상태 저장
  // 상태가 바뀔 때마다 로컬스토리지에 저장
  useEffect(() => {
    const saveState = () => {
      localStorage.setItem(
        `stopwatches_${studyNo}_${userNick}`,
        JSON.stringify(stopwatches)
      );
      if (currentStopwatch) {
        localStorage.setItem(
          `currentStopwatch_${currentStopwatch.timerNo}`,
          JSON.stringify(currentStopwatch)
        );
      }
    };
    saveState();
  }, [stopwatches, currentStopwatch, studyNo, userNick]);

  // 사용자가 작동 중에 서버 끄거나 페이지 나갈 때 일시정지 처리
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentTimer, currentStopwatch, stopwatches]);

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
    return `${hours}:${minutes}:${seconds}`;
  };

  // 개인 스톱워치 기록란 포맷팅
  const formatStopWatchTime = (time) => {
    const hours = String(Math.floor(time / 3600000)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600000) / 60000)).padStart(
      2,
      "0"
    );
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // ===================== 기록란 처리 ==============================

  // 방장 전용 전체 기록란 포맷팅
  const formatStopWatchAdmin = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}시간${minutes}분${seconds}초`;
  };

  // 기록란에 남길 스톱워치 데이터를 로컬에 저장
  const addRecord = (stopwatch) => {
    const updatedStopwatches = stopwatches.map((t) =>
      t.timerNo === stopwatch.timerNo
        ? { ...t, running: false, time: stopwatch.time }
        : t
    );
    setStopwatches(updatedStopwatches);
    localStorage.setItem(
      `stopwatches_${studyNo}_${userNick}`,
      JSON.stringify(updatedStopwatches)
    );
    localStorage.setItem(
      `currentStopwatch_${stopwatch.timerNo}`,
      JSON.stringify(stopwatch)
    );
  };

  // 그룹원 전체 기록 표시할 때, 그룹원별로 나열해주는 함수
  const groupByuserNick = (array) => {
    return array.reduce((result, item) => {
      const userNick = item.userNick;
      if (!result[userNick]) {
        result[userNick] = [];
      }
      result[userNick].push(item);
      return result;
    }, {});
  };

  const calculateTotalStudyTime = (stopwatches) => {
    const userTotalTime = {};
    stopwatches.forEach((sw) => {
      if (!userTotalTime[sw.userNick]) {
        userTotalTime[sw.userNick] = 0;
      }
      userTotalTime[sw.userNick] += sw.elapsedTime || 0;
    });
    return userTotalTime;
  };

  // ================== "스톱워치" 기능 핸들러 =========================

  // 기록된 스톱워치를 불러오는 함수
  // 사용자 본인의 스톱워치만 조작 가능
  const handleLoadStopwatch = (timerNo) => {
    const selectedStopwatch = userStopwatches.find(
      (sw) => sw.timerNo === timerNo
    );
    if (selectedStopwatch) {
      setCurrentStopwatch(selectedStopwatch);
      setIsEditing(false); // 기존 스톱워치 불러오기 시 제목 입력창 비활성화
    }
  };

  // 스톱워치 생성
  const handleCreateStopwatch = async (isNext = false) => {
    if (!userNick) {
      alert("로그인 후 이용해주세요");
      navigate("/login");
      return;
    }
    const newTimer = {
      name: "",
      time: 0,
      running: false,
      elapsedTime: 0,
    };
    try {
      // isNext가 true이고 현재 스톱워치가 존재하면
      if (isNext && currentStopwatch) {
        // 현재 스톱워치 기록을 추가
        const updatedStopwatches = stopwatches.map((t) =>
          t.timerNo === currentStopwatch.timerNo ? { ...t, running: false } : t
        );
        setStopwatches(updatedStopwatches);
        localStorage.setItem(
          `stopwatches_${studyNo}_${userNick}`,
          JSON.stringify(updatedStopwatches)
        );
        setCurrentStopwatch(null); // 다음 스톱워치 생성을 위해 현재 스톱워치는 초기화
      }
      const res = await addTimer(studyNo, userNick, newTimer);
      setStopwatches([...stopwatches, res]);
      setCurrentStopwatch(res);
      setIsEditing(true); // 새로운 스톱워치 생성 시 제목 입력창 활성화
    } catch (error) {
      console.error("타이머 생성 실패 : ", error);
    }
  };

  // 스톱워치 삭제
  const handleDeleteStopwatch = async (timer) => {
    try {
      clearInterval(intervalStopWatchIds.current[timer.timerNo]);
      await deleteTimer(studyNo, timer.timerNo);
      const updatedStopwatches = stopwatches.filter(
        (t) => t.timerNo !== timer.timerNo
      );
      setStopwatches(updatedStopwatches);
      if (currentStopwatch && currentStopwatch.timerNo === timer.timerNo) {
        if (updatedStopwatches.length > 0) {
          setCurrentStopwatch(
            updatedStopwatches.find(
              (t) => t.userNick === getUserNickFromToken()
            )
          );
        } else {
          setCurrentStopwatch(null);
        }
        localStorage.removeItem(`currentStopwatch_${timer.timerNo}`);
      }

      // 총 공부 시간 업데이트
      setTotalStudyTime((prev) => ({
        ...prev,
        [timer.userNick]:
          (prev[timer.userNick] || 0) - Math.floor(timer.time / 1000),
      }));
    } catch (error) {
      console.error("타이머 삭제 실패 : ", error);
    }
  };

  // 스톱워치 시작
  const handleStartStopwatch = async (timer) => {
    try {
      if (intervalStopWatchIds.current[timer.timerNo]) {
        clearInterval(intervalStopWatchIds.current[timer.timerNo]);
      }
      const updatedTimer = {
        ...timer,
        running: true,
        startAt: timer.startAt || new Date().toISOString().replace("Z", ""),
      };
      setStopwatches((stopwatches) =>
        stopwatches.map((t) => (t.timerNo === timer.timerNo ? updatedTimer : t))
      );
      setCurrentStopwatch(updatedTimer);
      setIsEditing(false); // 스톱워치 시작 시 제목 입력란 비활성화

      const startTime = Date.now() - (timer.time || 0);
      intervalStopWatchIds.current[timer.timerNo] = setInterval(() => {
        const updatedTime = Date.now() - startTime;
        setStopwatches((prev) =>
          prev.map((t) =>
            t.timerNo === timer.timerNo ? { ...t, time: updatedTime } : t
          )
        );
        setCurrentStopwatch((prev) => ({ ...prev, time: updatedTime }));
        localStorage.setItem(
          `currentStopwatch_${timer.timerNo}`,
          JSON.stringify({ ...updatedTimer, time: updatedTime })
        );
      }, 10);
      await updateTimer(studyNo, timer.timerNo, updatedTimer);
    } catch (error) {
      console.error("스톱워치 시작 오류 : ", error);
    }
  };

  // 스톱워치 일시정지(현재 작동한 시간만큼 업데이트 후 저장)
  const handlePauseStopwatch = async (timer) => {
    try {
      clearInterval(intervalStopWatchIds.current[timer.timerNo]);

      // 업데이트된 타이머 객체
      const updatedTimer = {
        ...timer,
        running: false,
        stopAt: new Date().toISOString().replace("Z", ""),
        time: timer.time,
        elapsedTime: Math.floor(timer.time / 1000),
      };
      // 이전에 저장된 elapsedTime
      const previousElapsedTime =
        stopwatches.find((t) => t.timerNo === timer.timerNo)?.elapsedTime || 0;
      const addedTime = Math.floor(timer.time / 1000) - previousElapsedTime;

      // 1. 로컬 업데이트(순서 어긋나면 충돌!!)
      setStopwatches((stopwatches) =>
        stopwatches.map((t) => (t.timerNo === timer.timerNo ? updatedTimer : t))
      );
      setCurrentStopwatch(updatedTimer);
      localStorage.setItem(
        `currentStopwatch_${timer.timerNo}`,
        JSON.stringify(updatedTimer)
      ); // 로컬 스토리지에 상태 저장

      // 2. DB 업데이트(순서 어긋나면 충돌!!)
      await updateTimer(studyNo, timer.timerNo, updatedTimer);

      // 총 공부 시간 업데이트
      setTotalStudyTime((prev) => ({
        ...prev,
        [timer.userNick]: (prev[timer.userNick] || 0) + addedTime,
      }));
    } catch (error) {
      console.error("스톱워치 일시정지 실패 : ", error);
    }
  };

  // 스톱워치 중지(초기화)
  const handleStopStopwatch = async (timer) => {
    try {
      clearInterval(intervalStopWatchIds.current[timer.timerNo]);

      // 업데이트된 타이머 객체
      const updatedTimer = {
        ...timer,
        running: false,
        time: timer.time,
        stopAt: new Date().toISOString().replace("Z", ""),
        elapsedTime: Math.floor(timer.time / 1000),
      };
      // 1. 로컬 업데이트(순서 어긋나면 충돌!!)
      setStopwatches((stopwatches) =>
        stopwatches.map((t) => (t.timerNo === timer.timerNo ? updatedTimer : t))
      );
      setCurrentStopwatch(updatedTimer);

      // 2. db 업데이트(순서 어긋나면 충돌!!)
      await updateTimer(studyNo, timer.timerNo, updatedTimer);
    } catch (error) {
      console.error("스톱워치 정지 실패 : ", error);
    }
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
      if (!currentTimer.name) {
        alert("타이머 이름을 입력해주세요.");
        return;
      }
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
