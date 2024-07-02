import React, { useState, useEffect } from "react";
import { getStudy } from "../../api/StudyApi";
import {
  getCalendar,
  addEvent,
  deleteEvent,
  updateEvent,
} from "../../api/CalendarApi";
import { getUserIdFromToken } from "../../util/jwtDecode";
import moment from "moment";

const GroupScheduleComponent = ({ studyNo }) => {
  const [study, setStudy] = useState({}); // 방장 id 추출에 필요한 study 조회
  const [events, setEvents] = useState([]); // 캘린더 - 일정 관리

  const currentUserId = getUserIdFromToken();
  const isManager = currentUserId === study.userId; // 현재 사용자가 방장인지 확인

  // 스터디의 방장 ID 추출
  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const data = await getStudy(studyNo);
        setStudy(data);
      } catch (error) {
        console.error("스터디 데이터를 가져오는 중 오류 발생:", error);
      }
    };
    fetchStudy();
  }, [studyNo]);

  // 컴포넌트가 마운트될 때 캘린더(일정) 데이터 가져오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCalendar(studyNo);
        setEvents(
          data.map((event) => ({
            ...event,
            start: moment(event.startDate).toDate(),
            end: moment(event.endDate).toDate(),
          }))
        );
      } catch (error) {
        console.error("일정 데이터를 가져오는 중 오류 발생:", error);
        setEvents([]); // 해당 스터디의 일정이 하나도 없으면, [] 반환
      }
    };
    fetchEvents();
  }, [studyNo]);

  // 캘린더 - 일정 생성
  const handleCreateEvent = async ({ start, end }) => {
    if (!isManager) {
      alert(
        "방장만 일정을 관리할 수 있습니다.\n" +
          "방장 닉네임 : " +
          study.userNick
      );
      return;
    }
    const title = getNextTitle();
    const newEvent = {
      startDate: moment(start).format("YYYY-MM-DDTHH:mm"),
      endDate: moment(end).format("YYYY-MM-DDTHH:mm"),
      title,
      content: "", // 초기값은 공백, 모달창에서 나중에 작성
      completeChk: false, // 초기값은 false
      color: "#000000", // 기본 색상 설정
    };
    try {
      const data = await addEvent(studyNo, newEvent);
      setEvents([
        ...events,
        {
          ...data,
          start: moment(data.startDate).toDate(),
          end: moment(data.endDate).toDate(),
        },
      ]);
    } catch (error) {
      console.error("일정 추가 중 오류 발생:", error);
    }
  };

  // 캘린더 - 일정 제목(title) 네이밍 규칙
  // "일정1", "일정2", "일정3" ... 순으로 생성
  const getNextTitle = () => {
    const titles = events.map((event) => event.title);
    for (let i = 1; ; i++) {
      const nextTitle = `일정${i}`;
      if (!titles.includes(nextTitle)) return nextTitle;
    }
  };

  // 캘린더 - 일정 삭제
  const handleRemoveEvent = async (eventId) => {
    if (!isManager) {
      alert(
        "방장만 일정을 관리할 수 있습니다.\n" +
          "방장 닉네임 : " +
          study.userNick
      );
      return;
    }
    try {
      await deleteEvent(studyNo, eventId);
      setEvents(events.filter((event) => event.calendarNo !== eventId));
    } catch (error) {
      console.error("일정 삭제 중 오류 발생:", error);
    }
  };

  // 캘린더 - 일정 완료 상태 업데이트
  const handleCompleteEvent = async (eventId, completeChk) => {
    if (!isManager) {
      alert(
        "방장만 일정을 관리할 수 있습니다.\n" +
          "방장 닉네임 : " +
          study.userNick
      );
      return;
    }
    try {
      const updatedEvent = await updateEvent(studyNo, eventId, { completeChk });
      setEvents(
        events.map((event) =>
          event.calendarNo === eventId
            ? { ...event, completeChk: updatedEvent.completeChk }
            : event
        )
      );
    } catch (error) {
      console.error("일정 완료 상태 업데이트 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <div className="pl-4">
        <div className="my-4">
          <ul>
            {events.map((event, index) => (
              <li
                key={index}
                className="flex justify-between items-center my-2"
              >
                <input
                  type="checkbox"
                  checked={event.completeChk}
                  // 일정 완료 상태 업데이트
                  onChange={() =>
                    handleCompleteEvent(event.calendarNo, !event.completeChk)
                  }
                  className="mr-2"
                />
                <p
                  onClick={() =>
                    handleCompleteEvent(event.calendarNo, !event.completeChk)
                  }
                  className={
                    event.completeChk
                      ? "line-through grow flex justify-between items-center cursor-pointer"
                      : "grow flex justify-between items-center cursor-pointer"
                  }
                >
                  <span>{event.title}</span>
                  <span className="text-xs">
                    {moment(event.startDate).format("MM월 DD일 HH시mm분")}
                  </span>
                </p>
                {/*일정 제거 이벤트*/}
                <button
                  onClick={() => handleRemoveEvent(event.calendarNo)}
                  className="text-red-300 p-1 rounded"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GroupScheduleComponent;
