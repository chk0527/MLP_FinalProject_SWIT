import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

//Momonet로 로컬 시간대 설정
const localizer = momentLocalizer(moment);

const StudyGroupComponent = () => {
  const [events, setEvents] = useState([]); // 캘린더 - 메인 이벤트
  const [tasks, setTasks] = useState([]); // 캘린더 - 할 일 저장
  const [taskInput, setTaskInput] = useState(''); // 캘린더 - 할 일 입력
  const [chatMessages, setChatMessages] = useState([]); // 신청 - 채팅 화면
  const [chatInput, setChatInput] = useState(''); // 신청 - 채팅 입력창
  const [view, setView] = useState('calendar'); // 뷰 설정(캘린더|신청)

  // 캘린더 - 일정 작성
  const handleSelectSlot = ({ start, end }) => {
    const title = prompt('일정을 새로 작성하세요');
    if (title) {
      setEvents([...events, { start, end, title, completed: false }]);
    }
  };

  // 캘린더 - 일정 완료 토글
  const handleTaskComplete = (index) => {
    const newEvents = events.map((event, i) =>
      i === index ? { ...event, completed: !event.completed } : event
    );
    setEvents(newEvents);
  };

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
      <div className="bg-gray-200 p-4 rounded-lg relative max-w-screen-lg w-full">
        <h1 className="text-2xl font-bold text-center">리액트 같이 공부하실 분 모집해요~!</h1>
        <div className="flex items-start mt-4">
          <div className="w-256 h-192 rounded-lg mr-6 bg-gray-500 border border-gray-800 flex items-center justify-center">
            <img
              // front/swit/public 폴더에 접근하는 절대경로
              src={`${process.env.PUBLIC_URL}/study_group.png`}
              alt="Profile"
              className="w-64 h-54 rounded-lg object-cover"
            />
          </div>
          <div className="ml-auto text-left flex flex-col items-center h-54">
            <p><strong>소개:</strong> 리액트 스터디입니다.</p>
            <p><strong>주제:</strong> 개발</p>
            <p><strong>진행방식:</strong> 비대면</p>
            <p><strong>인원:</strong> 6명</p>
            <p><strong>날짜:</strong> 2024-05-20 ~ 2024-06-20</p>
            <p><strong>방장:</strong> 고리스</p>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">ZOOM 참여</button>
        </div>
        <div className="mt-4 p-4 border border-gray-300 bg-yellow-100 text-left">
          <p>✏️ 주 4회 상시 자율 출석 취업 스터디반 운영 중입니다! (현재 모집X)</p>
          <p>스터디 멤버가 아니어도 줌 참석 자유 이용 가능합니다!</p>
          <p>(타이머 정지 없이 캠 off 5분 이상 금지, 캠 화면에 책이나 모니터 등 공부하는 모습이 잘 보이게 부탁드립니다.)</p>
          <p>오류 발생 시 임시 대피소:</p>
          <a href="https://study.whaleon.naver.com/detail/9503d642815e4355987b9afd00bbb6d3" className="text-blue-500">https://study.whaleon.naver.com/detail/9503d642815e4355987b9afd00bbb6d3</a>
        </div>
      </div>

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
                style={{ height: 500 }}
                messages={{
                  month: '월',
                  week: '주',
                  day: '일',
                  today: '오늘',
                  back: '이전달',
                  next: '다음달',
                  today: '오늘',
                  agenda: '일정',
                  date: '날짜',
                  time: '시간',
                  event: '이벤트',
                  showMore: (total) => `+${total} 더 보기`,
                }}
                onSelectSlot={handleSelectSlot} // 캘린더의 빈 슬롯을 클릭하면 handleSelectSlot 함수가 호출됨
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
                      checked={event.completed}
                      onChange={() => handleTaskComplete(index)} // 이벤트 완료 상태 토글
                      className="mr-2"
                    />
                    <span className={event.completed ? 'line-through' : ''}>
                      {event.title} - {moment(event.start).format('YYYY년 MM월 DD일 HH:mm')}
                    </span>
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