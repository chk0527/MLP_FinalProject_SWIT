import React, { useState, useEffect } from "react";
import { getAllTimers, getUserTimers } from "../../api/TimerApi";
import { getUserNickFromToken } from "../../util/jwtDecode";
import { isLeader } from "../../api/GroupApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DetailTimerModal from "./DetailTimerModal";

const GroupTotalTimerComponent = ({ studyNo }) => {
  const [stopwatches, setStopwatches] = useState([]);
  const [currentStopwatch, setCurrentStopwatch] = useState(null);
  const [userIsLeader, setUserIsLeader] = useState(false);
  const [userNick, setUserNick] = useState(getUserNickFromToken());
  const [totalStudyTime, setTotalStudyTime] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserTimers, setModalUserTimers] = useState([]);

  useEffect(() => {
    const fetchTimers = async () => {
      try {
        const userNickFromToken = getUserNickFromToken();
        setUserNick(userNickFromToken);

        const isAdmin = await isLeader(studyNo);
        setUserIsLeader(isAdmin);

        const res = isAdmin
          ? await getAllTimers(studyNo)
          : await getUserTimers(studyNo, userNickFromToken);

        setStopwatches(res);

        const savedStopwatches =
          JSON.parse(
            localStorage.getItem(`stopwatches_${studyNo}_${userNickFromToken}`)
          ) || [];
        const updatedStopwatches = res.map((timer) => {
          const savedTimer =
            savedStopwatches.find((t) => t.timerNo === timer.timerNo) || {};
          return {
            ...timer,
            time: savedTimer.time ?? timer.time,
            running: savedTimer.running,
            elapsedTime: savedTimer.elapsedTime,
          };
        });
        setStopwatches(updatedStopwatches);

        setTotalStudyTime(calculateTotalStudyTime(updatedStopwatches));

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
        // 에러 처리를 여기에 추가할 수 있습니다.
      }
    };

    fetchTimers();
  }, [studyNo, userNick]);

  const userStopwatches = stopwatches.filter((sw) => sw.userNick === userNick);

  const filterStopwatchesByDateRange = (stopwatches, startDate, endDate) => {
    if (!startDate || !endDate) return [];

    const startOfDay = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const endOfDay = (date) => {
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

  const formatStopWatchTime = (time) => {
    const hours = String(Math.floor(time / 3600000)).padStart(2, "0");
    const minutes = String(Math.floor((time % 3600000) / 60000)).padStart(
      2,
      "0"
    );
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatStopWatchAdmin = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  };

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

  const openTotalDetail = (userTimers) => {
    setModalUserTimers(userTimers);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative w-full space-y-4">
      <div className="">
        <p className="text-xl font-semibold mt-8 p-2 text-gray-900">
          회원별 공부 시간
        </p>
        <hr className="border-4 border-gray-500 mb-4 w-40" />
      </div>
      <div className="absolute flex gap-4 justify-end -top-1 right-0">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="p-2 border rounded cursor-pointer"
          dateFormat="yyyy-MM-dd"
          placeholderText="시작 날짜"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="p-2 border rounded cursor-pointer"
          dateFormat="yyyy-MM-dd"
          placeholderText="끝 날짜"
        />
      </div>
      <div>
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr key={userNick}>
              <th className="py-2 border-b">닉네임</th>
              <th className="py-2 border-b">구분</th>
              <th className="py-2 border-b">상세시간</th>
              <th className="py-2 border-b">총 공부시간</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupByuserNick(filteredStopwatches))
              .sort(([a], [b]) =>
                a === userNick ? -1 : b === userNick ? 1 : 0
              )
              .map(([userNick, userTimers], index) => (
                <tr key={userNick}>
                  <td className="py-2 border-b text-center">{userNick}</td>
                  <td className="py-2 border-b text-center">
                    {userNick === getUserNickFromToken() ? "스터디장" : "일반"}
                  </td>
                  <td
                    className="py-2 border-b text-center cursor-pointer"
                    onClick={() => openTotalDetail(userTimers)}
                  >
                    보기
                  </td>
                  <td className="py-2 border-b text-center">
                    {formatStopWatchTime(
                      (totalStudyTime[userNick] || 0) * 1000
                    )}
                  </td>
                </tr>
              ))}
            <DetailTimerModal
              userNick={userNick}
              userTimers={modalUserTimers}
              isOpen={isModalOpen}
              onClose={closeModal}
              formatStopWatchAdmin={formatStopWatchAdmin}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupTotalTimerComponent;
