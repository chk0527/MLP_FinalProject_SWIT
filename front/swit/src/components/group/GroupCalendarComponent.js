import { useState, useEffect } from 'react';
import { getStudy } from "../../api/StudyApi";
import { getCalendar, addEvent, deleteEvent, updateEvent } from "../../api/CalendarApi";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import DatePicker from "react-datepicker";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaPalette } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import ko from "date-fns/locale/ko";
import moment from 'moment';
import 'moment/locale/ko';
import axios from 'axios';
import { getUserIdFromToken, getUserNickFromToken, getUserRoleFromToken } from "../../util/jwtDecode";
import CommonModal from '../common/CommonModal';


import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/StudyGroupComponent.css";
import 'react-quill/dist/quill.snow.css';

// 한국어 로케일 적용
moment.locale('ko');
// Momonet로 로컬 시간대 설정
const localizer = momentLocalizer(moment);
// 드래그앤드롭 기능이 추가된 Calendar
const DragAndDropCalendar = withDragAndDrop(Calendar);

const GroupCalendarComponent = ({ studyNo }) => {
  const [study, setStudy] = useState([]);                   // 방장 id 추출에 필요한 study 조회
  const [events, setEvents] = useState([]);                 // 캘린더 - 일정 관리
  const [calendarView, setCalendarView] = useState('month');
  const [modalEvent, setModalEvent] = useState(null);       // 모달창 이벤트 설정
  const [modalClass, setModalClass] = useState('modal');    // 모달창 css 클래스값 설정
  const [holidays, setHolidays] = useState([]);             // 공휴일 처리
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // 스터디의 방장 ID 추출
  useEffect(() => {
    getStudy(studyNo).then((data) => {
      console.log(data)
      setStudy(data)
    })
  }, [studyNo])

  const currentUserId = getUserIdFromToken();
  const isManager = currentUserId === study.userId; // 현재 사용자가 방장인지 확인


  // 컴포넌트가 마운트될 때 캘린더(일정) 데이터 가져오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCalendar(studyNo)
        const holidayData = await fetchHolidays() // 공휴일 데이터 가져오기
        setEvents(data.map(event => ({
          ...event,
          start: moment(event.startDate).local().toDate(),
          end: moment(event.endDate).local().toDate(),
        })))
        setHolidays(holidayData)
      } catch (error) {
        console.error('일정 데이터를 가져오는 중 오류 발생:', error)
        setEvents([]) // 해당 스터디의 일정이 하나도 없으면, [] 반환
      }
    }
    fetchEvents()
  }, [studyNo])

  // ======================= 포맷 설정 ================================
  // =================================================================

  // 이전,오늘,다음 + 월,주,일 버튼
  const renderHeader = ({ label, onNavigate, onView }) => {
    return (
      <div className="custom-calendar-header">
        <div className="left-controls">
          <button onClick={() => onNavigate('PREV')} className="nav-button"><FaChevronLeft /></button>
          <span className="label">{label}</span>
          <button onClick={() => onNavigate('NEXT')} className="nav-button"><FaChevronRight /></button>
        </div>
        <button onClick={() => onNavigate('TODAY')} className="today-button">Today</button>
        <div className="right-controls">
          <button onClick={() => onView('month')} className="view-button">월</button>
          <button onClick={() => onView('week')} className="view-button">주</button>
          <button onClick={() => onView('day')} className="view-button">일</button>
        </div>
      </div>
    )
  }

  // 캘린더 포맷 한국어로 번역
  const formatsKorean = {
    dateFormat: 'D',
    dayFormat: (date, culture, localizer) =>
      localizer.format(date, 'dd', culture),
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'M월 D일(ddd)', culture)} ~ ${localizer.format(end, 'M월 D일(ddd)', culture)}`,
    dayHeaderFormat: (date, culture, localizer) =>
      localizer.format(date, 'M월 D일(ddd)', culture),
    monthHeaderFormat: (date, culture, localizer) =>
      localizer.format(date, 'YYYY년 MM월', culture),
  }

  // 한국 공휴일 데이터 API 호출
  const fetchHolidays = async () => {
    const years = [2023, 2024, 2025, 2026] // 필요한 연도 목록
    const requests = years.map(year => axios.get(`https://date.nager.at/api/v2/PublicHolidays/${year}/KR`))

    try {
      const responses = await Promise.all(requests)
      return responses.flatMap(response => response.data.map(holiday => ({
        date: holiday.date,
        localName: holiday.localName,
      })))
    } catch (error) {
      console.error('공휴일 데이터를 가져오는 중 오류 발생:', error)
      return []
    }
  }

  // 캘린더 - 일정 스타일 적용
  const eventStyleGetter = (event) => {
    const backgroundColor = event.color
    return { className: 'rbc-event', style: { backgroundColor } }
  }

  const handleNavigate = (date) => {
    setCurrentMonth(moment(date).startOf('month'))
  }

  // 커스텀 날짜 셀 렌더링 함수
  const customDateCellWrapper = ({ children, value }) => {
    const dateStr = moment(value).format('YYYY-MM-DD')
    const holiday = holidays.find(holiday => holiday.date === dateStr)
    const day = moment(value).day()
    const isCurrentMonth = moment(value).isSame(currentMonth, 'month')
    const isToday = moment(value).isSame(moment(), 'day')

    const cellClassNames = [
      'rbc-day-bg',
      !isCurrentMonth && 'rbc-off-range-bg',
      isToday && 'rbc-today',
      holiday && 'holiday',
      day === 0 && 'sunday',
      day === 6 && 'saturday',
    ].filter(Boolean).join(' ')

    return (
      <div className={cellClassNames}>
        {children}
        {holiday && (
          <div className="holiday-text">{holiday.localName}</div>
        )}
      </div>
    )
  }

  // ======================= 기능 핸들러 관리 ===========================
  // ===================================================================

  // 캘린더 - 일정 생성
  const handleCreateEvent = async ({ start, end }) => {
    if (!isManager) {
      // alert("방장만 일정을 관리할 수 있습니다.\n" + "방장 닉네임 : " + study.userNick)
      setAlertMessage("방장만 일정을 관리할 수 있습니다.");
      setShowModal(true);
      return
    }
    const title = getNextTitle()
    const newEvent = {
      startDate: moment(start).format('YYYY-MM-DDTHH:mm'),
      endDate: moment(end).format('YYYY-MM-DDTHH:mm'),
      title,
      content: '',  // 초기값은 공백, 모달창에서 나중에 작성
      completeChk: false, // 초기값은 false
      color: '#000000'  // 기본 색상 설정
    }
    try {
      const data = await addEvent(studyNo, newEvent)
      setEvents([...events, {
        ...data,
        start: moment(data.startDate).toDate(),
        end: moment(data.endDate).toDate(),
      }])
    } catch (error) {
      console.error('일정 추가 중 오류 발생:', error)
    }
  }

  // 캘린더 - 일정 제목(title) 네이밍 규칙
  // "일정1", "일정2", "일정3" ... 순으로 생성
  const getNextTitle = () => {
    const titles = events.map(event => event.title)
    for (let i = 1; ; i++) {
      const nextTitle = `일정${i}`
      if (!titles.includes(nextTitle))
        return nextTitle
    }
  }

  // 캘린더 - 일정 삭제
  const handleRemoveEvent = async (eventId) => {
    if (!isManager) {
      setAlertMessage("방장만 일정을 관리할 수 있습니다.");
      setShowModal(true);
      return
    }
    try {
      await deleteEvent(studyNo, eventId)
      setEvents(events.filter(event => event.calendarNo !== eventId))
    } catch (error) {
      console.error('일정 삭제 중 오류 발생:', error)
    }
  }

  // 캘린더 - 일정 완료 상태 업데이트
  const handleCompleteEvent = async (eventId, completeChk) => {
    if (!isManager) {
      setAlertMessage("방장만 일정을 관리할 수 있습니다.");
      setShowModal(true);
      return
    }
    try {
      const updatedEvent = await updateEvent(studyNo, eventId, { completeChk })
      setEvents(events.map(event =>
        event.calendarNo === eventId ? { ...event, completeChk: updatedEvent.completeChk } : event
      ))
    } catch (error) {
      console.error('일정 완료 상태 업데이트 중 오류 발생:', error)
    }
  }

  // 캘린더 - 일정 선택 이벤트
  const handleSelectEvent = (event) => {
    setModalEvent(event)
    setModalClass('modal fade-in')
  }

  // 캘린더 - 모달창 닫기
  const handleCloseModal = () => {
    setModalClass('modal fade-out')
    setTimeout(() => {
      setModalEvent(null)
      setModalClass('modal')
    }, 300) // 0.3초 후에 모달 창 닫음
  }

  // 캘린더 - 일정 드래그앤드롭 이벤트
  const handleDragEvent = async ({ event, start, end }) => {
    if (!isManager) {
      setAlertMessage("방장만 일정을 관리할 수 있습니다.");
      setShowModal(true);
      return
    }
    const updatedEvent = {
      ...event,
      startDate: moment(start).format('YYYY-MM-DDTHH:mm'),
      endDate: moment(end).format('YYYY-MM-DDTHH:mm')
    }
    try {
      const updatedData = await updateEvent(studyNo, event.calendarNo, updatedEvent)
      setEvents(events.map(ev => (ev.calendarNo === event.calendarNo ? { ...updatedData, start, end } : ev)))
    } catch (error) {
      console.error('일정 이동 중 오류 발생:', error)
    }
  }

  // 캘린더 - 일정 바 사이즈 늘리기 이벤트(날짜 범위 변경)
  const handleResizeEvent = async ({ event, start, end }) => {
    if (!isManager) {
      setAlertMessage("방장만 일정을 관리할 수 있습니다.");
      setShowModal(true);
      return
    }
    const updatedEvent = {
      ...event,
      startDate: moment(start).format('YYYY-MM-DDTHH:mm'),
      endDate: moment(end).format('YYYY-MM-DDTHH:mm')
    }
    try {
      const updatedData = await updateEvent(studyNo, event.calendarNo, updatedEvent)
      setEvents(events.map(ev => (ev.calendarNo === event.calendarNo ? { ...updatedData, start, end } : ev)))
    } catch (error) {
      console.error('일정 크기 변경 중 오류 발생:', error)
    }
  }

  // 캘린더 - 일정 정보 업데이트(모달창)
  const handleUpdateEvent = async () => {
    if (!isManager) {
      setAlertMessage("방장만 일정을 관리할 수 있습니다.");
      setShowModal(true);
      return
    }
    const updatedEvent = {
      title: modalEvent.title,
      content: modalEvent.content,
      startDate: moment(modalEvent.start).format('YYYY-MM-DDTHH:mm'),
      endDate: moment(modalEvent.end).format('YYYY-MM-DDTHH:mm'),
      completeChk: modalEvent.completeChk,
      color: modalEvent.color
    }
    try {
      const updatedData = await updateEvent(studyNo, modalEvent.calendarNo, updatedEvent)
      setEvents(events.map(event => (event.calendarNo === modalEvent.calendarNo ? { ...updatedData, start: new Date(updatedData.startDate), end: new Date(updatedData.endDate), color: updatedData.color } : event)))
      handleCloseModal()
    } catch (error) {
      console.error('일정 수정 중 오류 발생:', error)
    }
  }

  return (
    <div className="flex w-full max-w-1000">
      <div className="w-full">
        <div className="my-4">
          <DragAndDropCalendar
            selectable
            resizable
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            style={{ height: 800 }}
            eventPropGetter={eventStyleGetter}
            //dayPropGetter={dayPropGetter} // 날짜 셀 스타일 적용
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
            components={{
              toolbar: renderHeader,
              dateCellWrapper: customDateCellWrapper, // 공휴일,주말 이벤트 적용
            }}
            formats={formatsKorean}
            onSelectSlot={handleCreateEvent} // 드래그 시작하자마자 이벤트 처리
            onSelectEvent={handleSelectEvent}
            onEventDrop={handleDragEvent}
            onEventResize={handleResizeEvent}
            view={calendarView} // 현재 뷰 설정
            onView={(newView) => setCalendarView(newView)} // 뷰 변경 핸들러
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      {/* 캘린더 - 일정 모달창 */}
      {modalEvent && (
        <div className={modalClass}>
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <label>제목:</label>
            <input
              type="text"
              value={modalEvent.title}
              onChange={(e) => setModalEvent({ ...modalEvent, title: e.target.value })}
              className="input-title"
            />
            <div className="date-picker-container">
              <div className="date-picker-item">
                <label>시작:</label>
                <div className="input-date-container">
                  <DatePicker
                    selected={modalEvent.start}
                    onChange={(date) => setModalEvent({ ...modalEvent, start: date })}
                    showTimeSelect
                    dateFormat="Pp"
                    locale={ko}
                    className="hidden-datepicker hidden-datepicker-start"
                  />
                  <FaCalendarAlt className="calendar-icon" onClick={() => document.querySelector('.hidden-datepicker-start').focus()} />
                </div>
              </div>
              <div className="date-picker-item">
                <label>종료:</label>
                <div className="input-date-container">
                  <DatePicker
                    selected={modalEvent.end}
                    onChange={(date) => setModalEvent({ ...modalEvent, end: date })}
                    showTimeSelect
                    dateFormat="Pp"
                    locale={ko}
                    className="hidden-datepicker hidden-datepicker-end"
                  />
                  <FaCalendarAlt className="calendar-icon" onClick={() => document.querySelector('.hidden-datepicker-end').focus()} />
                </div>
              </div>
            </div>
            <label>색깔:</label>
            <div className="color-picker-container">
              <button
                type="button"
                className="color-picker-button"
                onClick={() => document.querySelector('.color-picker-input').click()}
              >
                <FaPalette />
              </button>
              <input
                type="color"
                value={modalEvent.color || "#000000"}
                onChange={(e) => setModalEvent({ ...modalEvent, color: e.target.value })}
                className="color-picker-input"
                style={{ display: 'none' }}
              />
              <div className="selected-color" style={{ backgroundColor: modalEvent.color || "#000000" }}></div>
            </div>
            <label>내용:</label>
            <ReactQuill
              value={modalEvent.content}
              onChange={(value) => setModalEvent({ ...modalEvent, content: value })}
              className="input-content expanded"
            />
            <div className="modal-buttons">
              <button onClick={() => handleRemoveEvent(modalEvent.calendarNo)} className="button-delete">삭제</button>
              <button onClick={handleUpdateEvent} className="button-save">저장</button>
            </div>
          </div>

          {showModal && (
            <CommonModal
              modalMessage={alertMessage}
              callbackFn={() => setShowModal(false)}
              closeMessage="확인"
            />
          )}

        </div>
      )}
    </div>
  );
};

export default GroupCalendarComponent;
