import React, { useEffect, useState , useCallback} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getExamAll } from '../../api/ExamJobApi'; 
import searchIcon from "../../img/search-icon.png";
import { CiCalendarDate, CiBoxList } from "react-icons/ci";
import "../../css/ExamListComponent.css"
import { Link, useNavigate } from "react-router-dom";

const ExamCalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchExamData = async (keyword = '') => {
    try {
      const data = await getExamAll();
      const filteredData = keyword
        ? data.filter(exam => exam.examTitle.toLowerCase().includes(keyword.toLowerCase()))
        : data;
      const formattedEvents = filteredData.map(exam => {
        const eventsList = [
          {
            title: `${exam.examTitle} 필기접수`,
            start: exam.examDocRegStart,
            end: exam.examDocRegEnd
          },
          {
            title: `${exam.examTitle} 필기시험`,
            start: exam.examDocStart,
            end: exam.examDocEnd
          },
          {
            title: `${exam.examTitle} 실기접수`,
            start: exam.examPracRegStart,
            end: exam.examPracRegEnd
          },
          {
            title: `${exam.examTitle} 실기시험`,
            start: exam.examPracStart,
            end: exam.examPracEnd
          },
          {
            title: `${exam.examTitle} 필기합격발표일`,
            start: exam.examDocPass
          },
          {
            title: `${exam.examTitle} 실기합격발표일`,
            start: exam.examPracPass
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
    fetchExamData();
  }, []);

  const handleSearch = () => {
    fetchExamData(searchKeyword);
  };

  // 채용, 시험 클릭 시 이동
  const navigate = useNavigate();

  const handleClickExamList = useCallback(() => {
    navigate({ pathname: '../../exam' });
  }, [navigate]);

  const handleClickJobList = useCallback(() => {
    navigate({ pathname: '../../job' });
  }, [navigate]);


  return (
    <div className=''>
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
          <div className="flex justify-end items-end space-x-4  pb-5 mb-4 font-GSans">
            <Link to={{ pathname: "/exam/list/calendar" }} className="tooltip" data-tooltip="캘린더"><CiCalendarDate size={30} /></Link>
            <Link to={{ pathname: "/exam/list" }} className="tooltip" data-tooltip="리스트"><CiBoxList size={30} /></Link>
          </div>
        </div>
        {/* 채용/시험/검색 끝 */}

     

      </div>
      <div className="flex-wrap w-1300 font-GSans">
      <FullCalendar
        height={1500}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
    </div>
  );
};

export default ExamCalendarComponent;
