import GroupCalendarComponent from '../group/GroupCalendarComponent';
import GroupTimerComponent from '../group/GroupTimerComponent';
import GroupJoinConfirmComponent from '../group/GroupJoinConfirmComponent';

import { useState } from 'react';
import StudyInquiryListComponent from './StudyInquiryListComponent';

const StudyGroupComponent = ({ studyNo }) => {
  const [view, setView] = useState('calendar');             // 뷰 설정(캘린더|신청)

  return (
    <div className="p-4 flex flex-col items-center">
      {/* 스터디 정보란 */}
      <div className="h-1 bg-gray-300 my-4 w-full"></div>
      {/* 타이머 항목 */}
      <GroupTimerComponent studyNo={studyNo} />
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
          문의
        </span>
        <span className="mx-5">|</span>
        <span
          onClick={() => setView('join')}
          className={`mx-2 px-4 py-2 cursor-pointer ${view === 'join' ? 'font-bold text-red-500' : 'text-gray-500'}`}
        >
          신청 내역
        </span>
      </div>

      {/* 뷰 - 캘린더 항목 */}
      {view === 'calendar' && (
        <GroupCalendarComponent studyNo={studyNo} />
      )}

      {/* 뷰 - 문의 항목 */}
      {view === 'chat' && (
        <div className='w-3/4'>
          <StudyInquiryListComponent studyNo={studyNo} />
        </div>
      )}

      {/* 뷰 - 신청내역 항목 */}
      {view === 'join' && (
        <div>
          <GroupJoinConfirmComponent />
        </div>
      )}
    </div>
  );
};

export default StudyGroupComponent;