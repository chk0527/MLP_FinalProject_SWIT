import { useState, useEffect } from 'react';
import { getCalendar, addEvent, deleteEvent, updateEvent } from "../../api/CalendarApi";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

//Momonet로 로컬 시간대 설정
const localizer = momentLocalizer(moment);

const StudyGroupComponent = ({studyNo}) => {
  const [events, setEvents] = useState([]); // 캘린더 - 일정 관리
  const [tasks, setTasks] = useState([]); // 캘린더 - 할 일 저장
  const [taskInput, setTaskInput] = useState(''); // 캘린더 - 할 일 입력
  const [chatMessages, setChatMessages] = useState([]); // 신청 - 채팅 화면
  const [chatInput, setChatInput] = useState(''); // 신청 - 채팅 입력창
  const [view, setView] = useState('calendar'); // 뷰 설정(캘린더|신청)
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalStartDate, setModalStartDate] = useState('');
  const [modalEndDate, setModalEndDate] = useState('');

  // 컴포넌트가 마운트될 때 캘린더(일정) 데이터 가져오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCalendar(studyNo);
        setEvents(data.map(event => ({
          ...event,
          start: moment(event.startDate).local().toDate(),
          end: moment(event.endDate).local().toDate(),
        })))
      } catch (error) {
        console.error('일정 데이터를 가져오는 중 오류 발생:', error);
        setEvents([]);  // 해당 스터디의 일정이 하나도 없으면, [] 반환
      }
    };
    fetchEvents();
  }, [studyNo]);

  // 캘린더 - 일정 생성
  const handleCreateEvent = async ({ start, end }) => {
    const content = prompt('일정을 새로 작성하세요');
    if (content) {
      const newEvent = {
        startDate: moment(start).format('YYYY-MM-DDTHH:mm'),
        endDate: moment(end).format('YYYY-MM-DDTHH:mm'),
        content,
        completeChk: false // 새로 만든 일정의 기본값은 false
      };
      try {
        const data = await addEvent(studyNo, newEvent);
        setEvents([...events, {
          ...data,
          start: moment(data.startDate).toDate(),
          end: moment(data.endDate).toDate(),
        }]);
      } catch (error) {
        console.error('일정 추가 중 오류 발생:', error);
      }
    }
  };

  // 캘린더 - 일정 삭제
  const handleRemoveEvent = async (eventId) => {
    try {
      await deleteEvent(studyNo, eventId);
      setEvents(events.filter(event => event.calendarNo !== eventId));
    } catch (error) {
      console.error('일정 삭제 중 오류 발생:', error);
    }
  };

  // 캘린더 - 일정 완료 상태 업데이트
  const handleCompleteEvent = async (eventId, completeChk) => {
    try {
      const updatedEvent
        = await updateEvent(studyNo, eventId, completeChk);
      setEvents(events.map(event =>
        event.calendarNo === eventId ? { ...event, completeChk: updatedEvent.completeChk } : event
      ));
    } catch (error) {
      console.error('일정 완료 상태 업데이트 중 오류 발생:', error);
    }
  };

  //==============================================================

  // 캘린더 - 할 일 추가
  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskInput.trim()) {
      // 새로운 할 일을 state에 추가
      setTasks([...tasks, { text: taskInput, completed: false }]);
      setTaskInput(''); // 입력 필드 초기화
    }
  };

  // 캘린더 - 할 일의 완료 상태 토글
  const handleToggleTask = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  // 캘린더 - 할 일 제거
  const handleRemoveTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  // 신청 - 채팅 메시지 전송
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      // 새로운 채팅 메시지를 state에 추가
      setChatMessages([...chatMessages, chatInput]);
      setChatInput('');
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/*스터디 정보란*/}

      <div className="h-1 bg-gray-300 my-4 w-full"></div>

      <div className="flex justify-center my-3 w-full">
        <span
          onClick={() => setView('calendar')}
          className={`mx-2 px-4 py-2 cursor-pointer ${view === 'calendar' ? 'font-bold text-red-500' : 'text-gray-500'}`}
        >
          캘린더
        </span>
        <span className="mx-5">|</span>
        <span
          onClick={() => setView('chat')}
          className={`mx-2 px-4 py-2 cursor-pointer ${view === 'chat' ? 'font-bold text-red-500' : 'text-gray-500'}`}
        >
          신청
        </span>
      </div>

      {/* 뷰 - 캘린더 항목 */}
      {view === 'calendar' && (
        <div className="flex w-full max-w-screen-lg">
          <div className="w-7/12">
            <div className="my-4">
              <Calendar
                selectable
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="content"
                style={{ height: 600 }}
                messages={{
                  month: '월',
                  week: '주',
                  day: '일',
                  today: '오늘',
                  back: '이전',
                  next: '다음',
                  agenda: '일정',
                  date: '날짜',
                  time: '시간',
                  event: '이벤트',
                  showMore: (total) => `+${total} 더 보기`,
                }}
                onSelectSlot={handleCreateEvent} // 캘린더의 빈 슬롯을 클릭하면 handleCreateEvent 함수 호출
              />
            </div>
          </div>
          <div className="w-5/12 pl-4">
            <div className="my-4">
              <h2 className="text-xl font-bold">일정</h2>
              <ul>
                {events.map((event, index) => (
                  <li key={index} className="flex items-center my-2">
                    <input
                      type="checkbox"
                      checked={event.completeChk}
                      // 일정 완료 상태 업데이트
                      onChange={() => handleCompleteEvent(event.calendarNo, !event.completeChk)}
                      className="mr-2"
                    />
                    <span className={event.completeChk ? 'line-through' : ''}>
                      {event.content} - {moment(event.startDate).format('YYYY년 MM월 DD일 HH:mm')}
                    </span>
                    {/*일정 제거 이벤트*/}
                    <button onClick={() => handleRemoveEvent(event.calendarNo)} className="ml-auto bg-red-500 text-white p-1 rounded-lg">X</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="my-4">
              <h2 className="text-xl font-bold">할 일</h2>
              <form onSubmit={handleAddTask} className="flex my-2">
                <input
                  type="text"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-lg">Enter</button>
              </form>
              <ul>
                {tasks.map((task, index) => (
                  <li key={index} className="flex items-center my-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(index)} // 할 일의 완료 상태 토글
                      className="mr-2"
                    />
                    <span className={task.completed ? 'line-through' : ''}>
                      {task.text}
                    </span>
                    <button onClick={() => handleRemoveTask(index)} className="ml-auto bg-red-500 text-white p-1 rounded-lg">X</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 뷰 - 신청 항목 */}
      {view === 'chat' && (
        <div className="my-4 w-full max-w-screen-lg">
          <h2 className="text-xl font-bold">채팅</h2>
          <div className="border border-gray-300 rounded-lg p-4 mb-4 max-h-500px overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div key={index} className="my-2">
                {msg}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}  //채팅 입력 필드값 업데이트
              className="flex-grow p-2 border border-gray-300 rounded-l-lg"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-lg">입력</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudyGroupComponent;