// import React, { useEffect, useState } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { getExamAll } from '../../api/ExamJobApi'; 
// import searchIcon from "../../img/search-icon.png";

// const ExamCalendarComponent = () => {
//   const [events, setEvents] = useState([]);
//   const [searchKeyword, setSearchKeyword] = useState('');

//   useEffect(() => {
//     const fetchExamData = async () => {
//       try {
//         const data = await getExamAll();
//         const formattedEvents = data.map(exam => {
//           const eventsList = [
//             {
//               title: `${exam.examTitle} 필기접수`,
//               start: exam.examDocRegStart,
//               end: exam.examDocRegEnd
//             },
//             {
//               title: `${exam.examTitle} 필기시험`,
//               start: exam.examDocStart,
//               end: exam.examDocEnd
//             },
//             {
//               title: `${exam.examTitle} 실기접수`,
//               start: exam.examPracRegStart,
//               end: exam.examPracRegEnd
//             },
//             {
//               title: `${exam.examTitle} 실기시험`,
//               start: exam.examPracStart,
//               end: exam.examPracEnd
//             },
//             {
//               title: `${exam.examTitle} 필기합격발표일`,
//               start: exam.examDocPass
//             },
//             {
//               title: `${exam.examTitle} 실기합격발표일`,
//               start: exam.examPracPass
//             }
//           ];
//           return eventsList;
//         }).flat();
//         setEvents(formattedEvents);
//       } catch (error) {
//         console.error('오류오류', error);
//       }
//     };
//     fetchExamData();
//   }, []);

//   const handleSearch = () => {
//     fetchExamData();
//   };

//   return (
//     <div className=''>
//       <div>
//         검색창(검색해서 원하는 디비만 캘린더에 반영되는지 확인용)
//         <input
//                 className="focus:outline-none"
//                 type="text"
//                 placeholder="검색"
//                 value={searchKeyword}
//                 onChange={e => setSearchKeyword(e.target.value)}
//               />
//               <button type="button" onClick={handleSearch}>
//                 <img className="size-6" src={searchIcon}></img>
//               </button>
//       </div>
//     <FullCalendar
//       height={1600}
//       plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//       initialView="dayGridMonth"
//       events={events}
//     />
//     </div>
//   );
// };

// export default ExamCalendarComponent;

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getExamAll } from '../../api/ExamJobApi'; 
import searchIcon from "../../img/search-icon.png";

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

  return (
    <div className=''>
      <div className=''>
     
        <input
          className="focus:outline-none"
          type="text"
          placeholder="검색"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          <img className="size-6" src={searchIcon}></img>
        </button>

      </div>
      <FullCalendar
        height={1600}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
};

export default ExamCalendarComponent;
