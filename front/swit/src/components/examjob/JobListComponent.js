// import React, { useState, useEffect, useCallback } from 'react';
// import { getJobList } from '../../api/ExamJobApi';
// import useCustomMove from '../../hooks/useCustomMove';
// import PageComponent from '../common/PageComponent';
// import searchIcon from "../../img/search-icon.png";
// import { useNavigate } from 'react-router-dom';

// const initState = {
//   dtoList: [],
//   pageNumsList: [],
//   pageRequestDTO: null,
//   prev: false,
//   next: false,
//   totalCount: 0,
//   prevPage: 0,
//   nextPage: 0,
//   totalPage: 0,
//   current: 0
// };

// const ListComponent = () => {
//   const { page, size, moveToJobList, moveToJobRead } = useCustomMove();
//   const [serverData, setServerData] = useState(initState);
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const [jobField, setJobField] = useState('');
//   const [sort, setSort] = useState('jobNo');

//   const navigate = useNavigate();

//   const handleClickExamList = useCallback(() => {
//     navigate({ pathname: '../../exam' });
//   }, [navigate]);

//   const handleClickJobList = useCallback(() => {
//     navigate({ pathname: '../../job' });
//   }, [navigate]);

//   const fetchJobs = async () => {
//     const jobList = await getJobList({ page, size, searchKeyword, jobField, sort });
    
//     const currentDate = new Date();

//     // 마감기한이 지나지 않은 데이터만 필터링
//     const filteredJobList = jobList.dtoList.filter(job => {
//       const jobDeadline = new Date(job.jobDeadline);
//       return jobDeadline >= currentDate;
//     });

//     setServerData({
//       ...jobList,
//       dtoList: filteredJobList
//     });
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, [page, size, jobField, sort]); // 검색어 제외하고 감시

//   const handleSearch = () => {
//     fetchJobs(); // 검색어 포함해서 호출
//   };

//   return (
//     <div className="">
//       <div>
//         <select
//           value={jobField}
//           onChange={(e) => setJobField(e.target.value)}
//         >
//           <option value="">전체</option>
//           <option value="생산">생산</option>
//           <option value="IT개발">IT개발∙데이터</option>
//           <option value="교육">교육</option>
//           {/* 추가 직무 필드 옵션들 */}
//         </select>
//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//         >
//           <option value="jobNo">기본 정렬</option>
//           <option value="deadline">마감 임박순</option>
//         </select>
//       </div>

//       <div className="flex justify-between items-center border-b-2 pb-4 mb-4">
//         <div className="flex space-x-8">
//           <h1 className="text-2xl font-bold hover:border-b-2 hover:border-black cursor-pointer" onClick={handleClickJobList}>채용</h1>
//           <h2 className="text-xl text-gray-500 hover:border-b-2 hover:border-black cursor-pointer" onClick={handleClickExamList}>시험</h2>
//         </div>
//         <div className="text-xl">
//           <input
//             className="focus:outline-none"
//             type="text"
//             placeholder="검색"
//             value={searchKeyword}
//             onChange={e => setSearchKeyword(e.target.value)}
//           />
//           <button type="button" onClick={handleSearch}>
//             <img className="size-6" src={searchIcon} alt="검색" />
//           </button>
//         </div>
//       </div>

//       <ul className="divide-y divide-slate-200">
//         {serverData.dtoList.map(job => (
//           <article key={job.jobNo} className="flex items-start space-x-6 p-6">
//             <div className="min-w-0 relative flex-auto">
//               <h2 className="font-semibold text-slate-900 truncate pr-20 cursor-pointer" onClick={() => moveToJobRead(job.jobNo)}>{job.jobTitle}</h2>
//               <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium text-slate-500">
//                 <div className="ml-2">
//                   <dt className="sr-only">회사</dt>
//                   <dd>{job.jobCompany}</dd>
//                 </div>
//                 <div className="flex items-center">
//                   <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
//                     <circle cx="1" cy="1" r="1" />
//                   </svg>
//                   <dd>{job.jobField}</dd>
//                 </div>
//                 <div className="flex items-center">
//                   <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
//                     <circle cx="1" cy="1" r="1" />
//                   </svg>
//                   <dd>마감일: {job.jobDeadline}</dd>
//                 </div>
//               </dl>
//             </div>
//           </article>
//         ))}
//       </ul>
//       <div className="border-t-2 border-slate-200 mt-4"></div>

//       <PageComponent serverData={serverData} movePage={moveToJobList} />
//     </div>
//   );
// };

// export default ListComponent;


import React, { useState, useEffect, useCallback } from 'react';
import { getJobList } from '../../api/ExamJobApi';
import useCustomMove from '../../hooks/useCustomMove';
import PageComponent from '../common/PageComponent';
import searchIcon from "../../img/search-icon.png";
import { useNavigate } from 'react-router-dom';

const initState = {
  dtoList: [],
  pageNumsList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
};

const ListComponent = () => {
  const { page, size, moveToJobList, moveToJobRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [jobField, setJobField] = useState('');
  const [sort, setSort] = useState('jobNo');

  const navigate = useNavigate();

  const handleClickExamList = useCallback(() => {
    navigate({ pathname: '../../exam' });
  }, [navigate]);

  const handleClickJobList = useCallback(() => {
    navigate({ pathname: '../../job' });
  }, [navigate]);

  const fetchJobs = async (params) => {
    const jobList = await getJobList(params || { page, size, searchKeyword, jobField, sort });
    setServerData(jobList);
  };

  useEffect(() => {
    fetchJobs({ page, size, jobField, sort });
  }, [page, size, jobField, sort]);

  const handleSearch = () => {
    fetchJobs({ page, size, searchKeyword, jobField, sort });
  };

  return (
    <div className="">
      <div>
        <select
          value={jobField}
          onChange={(e) => setJobField(e.target.value)}
        >
          <option value="">전체</option>
          <option value="생산">생산</option>
          <option value="IT개발">IT개발∙데이터</option>
          <option value="교육">교육</option>
          {/* 추가 직무 필드 옵션들 */}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="jobNo">기본 정렬</option>
          <option value="deadline">마감 임박순</option>
        </select>
      </div>

      <div className="flex justify-between items-center border-b-2 pb-4 mb-4">
        <div className="flex space-x-8">
          ㅋ<h1 className="text-2xl font-bold hover:border-b-2 hover:border-black cursor-pointer" onClick={handleClickJobList}>채용</h1>
          <h2 className="text-xl text-gray-500 hover:border-b-2 hover:border-black cursor-pointer" onClick={handleClickExamList}>시험</h2>
        </div>
        <div className="text-xl">
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

      <ul className="divide-y divide-slate-200">
        {serverData.dtoList.map(job => (
          <article key={job.jobNo} className="flex items-start space-x-6 p-6">
            <div className="min-w-0 relative flex-auto">
              <h2 className="font-semibold text-slate-900 truncate pr-20 cursor-pointer" onClick={() => moveToJobRead(job.jobNo)}>{job.jobTitle}</h2>
              <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium text-slate-500">
                <div className="ml-2">
                  <dt className="sr-only">회사</dt>
                  <dd>{job.jobCompany}</dd>
                </div>
                <div className="flex items-center">
                  <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <dd>{job.jobField}</dd>
                </div>
                <div className="flex items-center">
                  <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <dd>마감일: {job.jobDeadline}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </ul>
      <div className="border-t-2 border-slate-200 mt-4"></div>

      <PageComponent serverData={serverData} movePage={moveToJobList} />
    </div>
  );
};

export default ListComponent;
