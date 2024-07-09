import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getExamList, isExamFavorite, addExamFavorite, removeExamFavorite } from "../../api/ExamJobApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import searchIcon from "../../img/search-icon.png";
import { FaStar, FaRegStar } from 'react-icons/fa';
import { CiCalendarDate, CiBoxList } from "react-icons/ci";
import "./ExamListComponent.css";
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
  current: 0
};

const ListComponent = () => {
  const { page, size, moveToExamList, moveToExamRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // 검색
  const fetchExam = async () => {
    const examList = await getExamList({ page, size, searchKeyword });
    setServerData(examList);

    const userId = getUserIdFromToken();
    if (userId) {
      const status = {};
      for (const exam of examList.dtoList) {
        const isFavorite = await isExamFavorite(userId, exam.examNo);
        status[exam.examNo] = isFavorite;
      }
      setFavoriteStatus(status);
    }
  };

  useEffect(() => {
    fetchExam();
  }, [page, size]);

  const handleSearch = () => {
    fetchExam();
  };

  //즐겨찾기 기능
  const handleFavorite = async (examNo) => {

    //로그인x
    const userId = getUserIdFromToken();
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    //로그인o
    const isFavorite = favoriteStatus[examNo];
    const request = isFavorite ? removeExamFavorite : addExamFavorite;
    try {
      await request(userId, examNo);
      setFavoriteStatus({
        ...favoriteStatus,
        [examNo]: !isFavorite
      });
      setModalMessage(isFavorite ? '즐겨찾기에서 삭제했습니다.' : '즐겨찾기에 추가했습니다.');
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  //시험채용이동
  const handleClickExamList = useCallback(() => {
    navigate({ pathname: '../../exam' });
  }, [navigate]);

  const handleClickJobList = useCallback(() => {
    navigate({ pathname: '../../job' });
  }, [navigate]);

  return (
    <div>
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

        {/* 채용/시험/검색 */}
        <div className="flex-col space-y-2">
          <div className="flex w-full justify-between items-center">
            <div className="flex space-x-12">
              <h1 className="text-5xl font-blackHans hover:border-b-2 hover:border-black cursor-pointer" onClick={handleClickExamList}>시험</h1>
              <h2 className="text-3xl font-blackHans text-gray-300 hover:border-b-2 hover:border-black cursor-pointer" onClick={handleClickJobList}>채용</h2>
            </div>

            {/* 검색 */}
            <div className="">
              <div className="flex items-center space-x-2 text-2xl">
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
          <div className="flex justify-end items-end space-x-4 border-b-2 pb-5 mb-4 font-GSans">
            <Link to={{ pathname: "/exam/list/calendar" }} className="tooltip" data-tooltip="캘린더"><CiCalendarDate size={35} /></Link>
            <Link to={{ pathname: "/exam/list" }} className="tooltip" data-tooltip="리스트"><CiBoxList size={35} /></Link>
          </div>
        </div>
        {/* 채용/시험/검색 끝 */}

        <div className="flex-wrap w-1300 font-GSans mt-4 text-xl">
          <ul className="divide-y divide-slate-200">
            {serverData.dtoList.map(exam => (
              <article key={exam.examNo} className="flex items-start space-x-6 p-6">
                <div className="min-w-0 relative flex-auto">
                  <h2 className=" font-semibold text-slate-900 truncate pr-20" onClick={() => moveToExamRead(exam.examNo)}>{exam.examTitle}</h2>
                  <dl className="mt-2 flex flex-wrap text-lg text-gray-400 leading-6 font-medium">
                    <div className="absolute top-0 right-0 flex items-center space-x-1">
                      <dt className="">
                        <button onClick={() => handleFavorite(exam.examNo)}>
                          {favoriteStatus[exam.examNo] ? <FaStar size={30} color="#FFF06B" /> : <FaRegStar size={30} color="#FFF06B" />}
                        </button>
                      </dt>
                      <dd></dd>
                    </div>
                    <div className="ml-2">
                      <dt className="sr-only">회사/필기시험</dt>
                      <dd>{exam.examDocEnd ? `필기시험 : ` : ""}{exam.examDocStart ? `${exam.examDocStart} ~ ` : ""}{exam.examDocEnd}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">직무/실기시험</dt>
                      <dd className="flex items-center">
                        <svg width="2" height="2" fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
                          <circle cx="1" cy="1" r="1" />
                        </svg>
                        실기시험 : {exam.examPracStart} ~ {exam.examPracEnd}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </ul>
        </div>
        <div className="border-t-2 border-slate-200 mt-4"></div>
      </div>
      <PageComponent serverData={serverData} movePage={moveToExamList} />
    </div>
  );
};

export default ListComponent;
