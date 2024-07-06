import React, { useState, useEffect, useCallback } from "react";
import {
  getJobList,
  isJobFavorite,
  addJobFavorite,
  removeJobFavorite,
} from "../../api/ExamJobApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import searchIcon from "../../img/search-icon.png";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { getUserIdFromToken } from "../../util/jwtDecode";
import LoginRequireModal from "../common/LoginRequireModal";
import CommonModal from "../common/CommonModal";

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
  current: 0,
};

const ListComponent = () => {
  const { page, size, moveToJobList, moveToJobRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [jobField, setJobField] = useState("");
  const [sort, setSort] = useState("jobNo");
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleClickExamList = useCallback(() => {
    navigate({ pathname: "../../exam" });
  }, [navigate]);

  const handleClickJobList = useCallback(() => {
    navigate({ pathname: "../../job" });
  }, [navigate]);

  const fetchJobs = async (params) => {
    const jobList = await getJobList(
      params || { page, size, searchKeyword, jobField, sort }
    );
    setServerData(jobList);

    const userId = getUserIdFromToken();
    if (userId) {
      const status = {};
      for (const job of jobList.dtoList) {
        const isFavorite = await isJobFavorite(userId, job.jobNo);
        status[job.jobNo] = isFavorite;
      }
      setFavoriteStatus(status);
    }
  };

  useEffect(() => {
    fetchJobs({ page, size, jobField, sort });
  }, [page, size, jobField, sort]);

  const handleSearch = () => {
    fetchJobs({ page, size, searchKeyword, jobField, sort });
  };

  //직무선택 그리드
  const jobFields = [
    { label: "전체", value: "" },
    { label: "IT개발·데이터", value: "IT개발·데이터" },
    { label: "교육", value: "교육" },
    { label: "회계·세무·재무", value: "회계·세무·재무" },
    { label: "인사·노무·HRD", value: "인사·노무·HRD" },
    { label: "총무·법무·사무", value: "총무·법무·사무" },
    { label: "건설·건축", value: "건설·건축" },
    { label: "의료", value: "의료" },
    { label: "연구·R&D", value: "연구·R&D" },
    { label: "금융·보험", value: "금융·보험" },
  ];
  const handleJobFieldClick = (field) => {
    setJobField(field);
  };

  //즐겨찾기 기능
  const handleFavorite = async (jobNo) => {
    //로그인x
    const userId = getUserIdFromToken();
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    //로그인o
    const isFavorite = favoriteStatus[jobNo];
    const request = isFavorite ? removeJobFavorite : addJobFavorite;
    try {
      await request(userId, jobNo);
      setFavoriteStatus({
        ...favoriteStatus,
        [jobNo]: !isFavorite,
      });
      setModalMessage(isFavorite ? '즐겨찾기에서 삭제했습니다.' : '즐겨찾기에 추가했습니다.');
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative w-full font-GSans">
      {showLoginModal && (
        <LoginRequireModal callbackFn={() => setShowLoginModal(false)} />
      )}

      {showModal && (
        <CommonModal
          modalMessage={modalMessage}
          callbackFn={() => setShowModal(false)}
          closeMessage="확인"
        />
      )}

      <div className="flex w-full justify-between px-8">
        <div className="flex space-x-4">
          <div className="text-5xl pb-16 font-blackHans">채용</div>
          <div className="text-5xl pb-16 font-blackHans text-gray-300">|</div>
          <div
            className="text-5xl pb-16 font-blackHans text-gray-300 hover:text-yellow-200 cursor-pointer"
            onClick={handleClickExamList}
          >
            시험
          </div>
        </div>

        <div className="flex flex-col gap-4 text-2xl">
          <div className="flex justify-end">
            <input
              className="focus:outline-none"
              type="text"
              placeholder="검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="button" onClick={handleSearch}>
              <img className="size-6" src={searchIcon} alt="검색" />
            </button>
          </div>
          <div className="flex justify-end pb-4 mb-4">
            <select
              value={jobField}
              onChange={(e) => setJobField(e.target.value)}
              className="focus:outline-none mx-4"
            >
              {jobFields.map((field, index) => (
                <option key={index} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="focus:outline-none p-2 text-1xl"
            >
              <option value="jobNo">기본 정렬</option>
              <option value="deadline">마감 임박순</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-wrap  font-GSans text-xl">
        <ul className="divide-y divide-slate-200">
          {serverData.dtoList.map((job) => (
            <article key={job.jobNo} className="flex items-start space-x-6 p-6">
              <div className="min-w-0 relative flex-auto">
                <h2
                  className="font-semibold text-slate-900 truncate pr-20 cursor-pointer"
                  onClick={() => moveToJobRead(job.jobNo)}
                >
                  {job.jobTitle}
                </h2>
                <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium text-gray-400">
                  <div className="absolute top-0 right-0 flex items-center space-x-1">
                    <dt className="">
                      <button
                        onClick={() => handleFavorite(job.jobNo)}
                        className="mb-5"
                      >
                        {favoriteStatus[job.jobNo] ? (
                          <FaStar size={30} color="#FFF06B" />
                        ) : (
                          <FaRegStar size={30} color="#FFF06B" />
                        )}
                      </button>
                    </dt>
                    <dd></dd>
                  </div>

                  <div className="ml-2 text-lg">
                    <dt className="sr-only">회사</dt>
                    <dd>{job.jobCompany}</dd>
                  </div>
                  <div className="flex items-center text-lg">
                    <svg
                      width="2"
                      height="2"
                      fill="currentColor"
                      className="mx-2 text-slate-300"
                      aria-hidden="true"
                    >
                      <circle cx="1" cy="1" r="1" />
                    </svg>
                    <dd>{job.jobField}</dd>
                  </div>
                  <div className="flex items-center text-lg ">
                    <svg
                      width="2"
                      height="2"
                      fill="currentColor"
                      className="mx-2 text-slate-300"
                      aria-hidden="true"
                    >
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
      <div className="border-t-2 border-slate-200 mt-4"></div>
      <div className="my-20">
        <PageComponent serverData={serverData} movePage={moveToJobList} />
      </div>
    </div>
  );
};

export default ListComponent;
