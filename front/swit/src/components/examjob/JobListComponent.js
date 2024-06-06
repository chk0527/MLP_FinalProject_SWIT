import React, { useState, useEffect } from 'react';
import { getJobList } from '../../api/ExamJobApi';
import useCustomMove from '../../hooks/useCustomMove';
import PageComponent from '../common/PageComponent';
import searchIcon from "../../img/search-icon.png";

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

  const fetchJobs = async () => {
    const jobList = await getJobList({ page, size, searchKeyword: searchKeyword })
    setServerData(jobList);
  };

  useEffect(() => {
    fetchJobs();
  }, [page, size]);

  const handleSearch = () => {
    fetchJobs();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="divide-y divide-slate-200">

        {/* 검색  */}

        <div className="flex w-full justify-end px-8">
          {/* <div className="text-5xl pb-16 font-blackHans">
          <div></div>
        </div> */}
          <div className="text-right">
            <div className="text-xl">
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

          </div>
        </div>

        <ul className="divide-y divide-slate-200">
          {serverData.dtoList.map(job => (
            <article key={job.jobNo} className="flex items-start space-x-6 p-6">
              <div>
                <dt className="sr-only">채용/시험</dt>
                <dd className="px-2.5 py-1 rounded-full bg-[#A4CEF5]/60 text-white">채용</dd>
              </div>
              <div className="min-w-0 relative flex-auto">
                <h2 className="font-semibold text-slate-900 truncate pr-20 cursor-pointer" onClick={() => moveToJobRead(job.jobNo)}>{job.jobTitle}</h2>
                <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium text-slate-500">
                  <div className="absolute top-0 right-0 flex items-center space-x-1">
                    <dt className="text-sky-500">
                      <span className="sr-only">Star rating</span>
                      <svg width="16" height="20" fill="#FFF06B">
                        <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                      </svg>
                    </dt>
                    <dd></dd>
                  </div>
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
      </div>
      <PageComponent serverData={serverData} movePage={moveToJobList} />
    </div>
  );
};

export default ListComponent;

