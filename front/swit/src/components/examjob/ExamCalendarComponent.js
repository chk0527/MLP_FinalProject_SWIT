import React, { useEffect, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getExamAll, getFavoriteExams } from '../../api/ExamJobApi';
import searchIcon from "../../img/search-icon.png";
import { CiCalendarDate, CiBoxList } from "react-icons/ci";
import "./ExamListComponent.css"
import { Link, useNavigate } from "react-router-dom";
import "./ExamCalendarComponent.css"
import { getUserIdFromToken } from "../../util/jwtDecode"; //userId 받아옴

const ExamCalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectRadio, setSelectRadio] = useState('');
  const navigate = useNavigate();

  const userId = getUserIdFromToken();

  const fetchExamData = async (keyword = '', onlyFavorites = false) => {
    try {
      let data;
      if (onlyFavorites) {
        data = await getFavoriteExams(userId);
      } else {
        data = await getExamAll();
      }

      const filteredData = keyword
        ? data.filter(exam => exam.examTitle.toLowerCase().includes(keyword.toLowerCase()))
        : data;

      const formattedEvents = filteredData.map(exam => {
        const eventsList = [
          {
            title: `${exam.examTitle} 필기접수`,
            start: exam.examDocRegStart,
            end: exam.examDocRegEnd,
            backgroundColor: 'rgb(248, 232, 238)',
            borderColor: 'rgb(248, 232, 238)',
            textColor: 'black',
            id: `${exam.examNo}-1`
          },
          {
            title: `${exam.examTitle} 필기시험`,
            start: exam.examDocStart,
            end: exam.examDocEnd,
            backgroundColor: 'rgb(227, 244, 244)',
            borderColor: 'rgb(227, 244, 244)',
            textColor: 'black',
            id: `${exam.examNo}-2`
          },
          {
            title: `${exam.examTitle} 실기접수`,
            start: exam.examPracRegStart,
            end: exam.examPracRegEnd,
            backgroundColor: 'rgb(253, 206, 223)',
            borderColor: 'rgb(253, 206, 223)',
            textColor: 'black',
            id: `${exam.examNo}-3`
          },
          {
            title: `${exam.examTitle} 실기시험`,
            start: exam.examPracStart,
            end: exam.examPracEnd,
            backgroundColor: 'rgb(210, 233, 233)',
            borderColor: 'rgb(210, 233, 233)',
            textColor: 'black',
            id: `${exam.examNo}-4`
          },
          {
            title: `${exam.examTitle} 필기합격발표일`,
            start: exam.examDocPass,
            backgroundColor: 'rgb(255, 246, 189)',
            borderColor: 'rgb(255, 246, 189)',
            textColor: 'black',
            id: `${exam.examNo}-5`
          },
          {
            title: `${exam.examTitle} 실기합격발표일`,
            start: exam.examPracPass,
            backgroundColor: 'rgb(255, 246, 189)',
            borderColor: 'rgb(255, 246, 189)',
            textColor: 'black',
            id: `${exam.examNo}-6`
          }
        ];
        return eventsList;
      }).flat();
      setEvents(formattedEvents);
    } catch (error) {
      console.error('오류오류', error);
    }
  };

  useEffect(() => {
    // 로그인
    if (userId) {
      setIsLoggedIn(true);
    }
    fetchExamData();
  }, [userId]);

  const handleSearch = () => {
    fetchExamData(searchKeyword);
  };


  // 채용, 시험 클릭 시 이동
  const handleClickExamList = useCallback(() => {
    navigate({ pathname: '../../exam' });
  }, [navigate]);

  const handleClickJobList = useCallback(() => {
    navigate({ pathname: '../../job' });
  }, [navigate]);

  //마우스 올렸을때 설정
  useEffect(() => {
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    document.body.appendChild(tooltip);

    return () => {
      document.body.removeChild(tooltip);
    };
  }, []);

  const handleMouseEnter = (info) => {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = info.event.title;
    tooltip.style.display = 'block';
    tooltip.style.left = `${info.jsEvent.pageX + 10}px`;
    tooltip.style.top = `${info.jsEvent.pageY + 10}px`;
  };

  const handleMouseLeave = () => {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
  };

  //일정클릭 -> 상세페이지 이동
  const handleReadClick = (info) => {
    navigate(`/exam/read/${info.event.id.split('-')[0]}`);
  };

  //즐겨찾기
  const clickFavorites = () => {
    setShowFavorites(!showFavorites);
    fetchExamData(searchKeyword, !showFavorites);
  };

  //라디오버튼
  const radioOptions = [
    { label: '전체', value: '' },
    { label: '기사·산업기사', value: '산업기사' },
    { label: '기능장', value: '기능장' },
    { label: '기능사', value: '기능사' },
    { label: '기술사', value: '기술사' },
  ];

  const radioChange = (event) => {
    const radioSelectValue = event.target.value;
    setSelectRadio(radioSelectValue);
    setSearchKeyword(radioSelectValue);
    fetchExamData(radioSelectValue);
  }

  return (
    <div className=''>
      <style>
        {`
          .hover-underline:hover {
            text-decoration: underline;
            text-underline-offset: 4px;
          }

          .selected-label {
            text-decoration: underline;
            text-underline-offset: 4px;
          }
        `}
      </style>
      <div className=''>
        {/* 채용/시험/검색 */}
        <div className="flex-col space-y-2">
          <div className="flex w-full justify-between items-center">
            <div className="flex space-x-12">
              <h1 className="text-5xl font-blackHans hover:border-b-2 hover:border-black cursor-pointer" onClick={handleClickExamList}>시험</h1>
              <h2 className="text-3xl font-blackHans text-gray-300 hover:border-b-2 hover:border-black cursor-pointer" onClick={handleClickJobList}>채용</h2>
            </div>

            {/* 검색 */}
            <div className="">
              <div className="flex items-center space-x-2 text-xl">
                <input
                  className="focus:outline-none"
                  type="text"
                  placeholder="검색"
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />
                <button type="button" onClick={handleSearch}>
                  <img className="size-6" src={searchIcon} alt="검색" />
                </button>
              </div>

            </div>
          </div>
          <div className="flex justify-between items-end space-x-4  pb-5 mb-4 font-GSans">
            <div className=''>
              <form className='flex justify-items-start'>
                {radioOptions.map((option) => (
                  <label key={option.value} className={`mr-4 ${selectRadio === option.value ? 'selected-label text-xl' : ''}`}>
                    <input
                      type="radio"
                      value={option.value}
                      checked={selectRadio === option.value}
                      onChange={radioChange}
                      className="forced-colors:appearance-auto appearance-none flex-initial"
                    />
                    {/* <div className="rounded-lg p-2 m-2 hover:bg-slate-100 hover:text-slate-900">{option.label}</div> */}
                    <div className="rounded-lg p-2 m-2">{option.label}</div>
                  </label>
                ))}
              </form>

            </div>
            <div className='order-last'>
              <Link to={{ pathname: "/exam/list/calendar" }} className="tooltip" data-tooltip="캘린더"><CiCalendarDate size={30} /></Link>
              <Link to={{ pathname: "/exam/list" }} className="tooltip ml-4" data-tooltip="리스트"><CiBoxList size={30} /></Link>
            </div>

          </div>
        </div>
        {/* 채용/시험/검색 끝 */}

      </div>
      <div className="flex-wrap w-1300 font-GSans">
        <FullCalendar
          height={1600}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locale={'ko'}
          dayCellContent={(arg) => {
            return arg.dayNumberText.replace('일', ''); // 1일 => 1
          }}
          eventMouseEnter={handleMouseEnter}
          eventMouseLeave={handleMouseLeave}
          eventClick={handleReadClick}
          buttonText={{
            today: "오늘"
          }}
          customButtons={
            isLoggedIn
              ? {
                myCustomButton: {
                  text: showFavorites ? '전체 보기' : '즐겨찾기',
                  click: clickFavorites
                }
              }
              : {}
          }
          headerToolbar={{
            right: isLoggedIn ? 'myCustomButton today prev next' : 'today prev next',
            left: 'title',
          }}
        />
      </div>
    </div>
  );
};

export default ExamCalendarComponent;
