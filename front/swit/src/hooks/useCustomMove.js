import {
  createSearchParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }
  return parseInt(param);
};

const useCustomMove = (options = {}) => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const page = getNum(queryParams.get("page"), 1);
  const size = getNum(queryParams.get("size"), 10);

  const { setPage, setSize } = options;

  const StudyPage = getNum(queryParams.get("StudyPage"), 1);
  const StudySize = getNum(queryParams.get("StudySize"), 16);

  const queryDefault = createSearchParams({ page, size }).toString();
  const StudyqueryDefault = createSearchParams({
    StudyPage,
    StudySize,
  }).toString();

  const moveToExamList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 10);
      const location = {};
      location.state = 1;
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }
    navigate({ pathname: `../list`, search: queryStr });
  };

  const moveToJobList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 10);
      const location = {};
      location.state = 1;
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }
    navigate({ pathname: `../list`, search: queryStr });
  };
  // navigate({ pathname: `../list`, search: queryStr });

  const moveToStudy = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.StudyPage, 1);
      const sizeNum = getNum(pageParam.StudySize, 16);
      const location = {};
      location.state = 0;
      queryStr = createSearchParams({
        StudyPage: pageNum,
        StudySize: sizeNum,
      }).toString();
    } else {
      queryStr = StudyqueryDefault;
    }
    navigate({ pathname: `../study`, search: queryStr });
  };

  const moveToExamRead = (examNo) => {
    console.log(queryDefault);
    navigate({ pathname: `../read/${examNo}`, search: queryDefault });
  };

  const moveToJobRead = (jobNo) => {
    navigate({ pathname: `../read/${jobNo}`, search: queryDefault });
  };

  const moveToRead = (num) => {
    navigate({ pathname: `../read/${num}` }); //조회시에 기존의 쿼리문자열을 유지하기 위해
  };

  const moveToGroup = (num) => {
    navigate({ pathname: `../group/${num}` }); //조회시에 기존의 쿼리문자열을 유지하기 위해
  };

  const moveToList = () => {
    navigate({ pathname: `../study` });
  };

  const moveToBoardList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 10);
      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }
    navigate({ pathname: `../board`, search: queryStr });
  };

  const moveToBoardRead = (num) => {
    const location = {};
    location.state = 1;
    navigate({ pathname: `../board/read/${num}`, search: queryDefault }); //조회시에 기존의 쿼리문자열을 유지하기 위해
  };

  // 마이페이지 - 작성한 게시글 모음 페이징 처리
  // 페이지 url 뒤에 파라미터 붙이지 않고 페이징 처리
  const moveToUserBoardList = (pageParam) => {
    const size = 5;
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      if (setPage) setPage(pageNum);
      if (setSize) setSize(size);
    } else {
      if (setPage) setPage(1);
      if (setSize) setSize(size);
    }
  };

  // 마이페이지 - 작성한 문의글 모음 페이징 처리
  // 페이지 url 뒤에 파라미터 붙이지 않고 페이징 처리
  const moveToUserInquiryList = (pageParam) => {
    const size = 5;
    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      if (setPage) setPage(pageNum);
      if (setSize) setSize(size);
    } else {
      if (setPage) setPage(1);
      if (setSize) setSize(size);
    }
  };

  return {
    moveToExamList,
    page,
    size,
    StudyPage,
    StudySize,
    moveToRead,
    moveToStudy,
    moveToJobList,
    moveToExamRead,
    moveToJobRead,
    moveToGroup,
    moveToList,
    moveToBoardList,
    moveToBoardRead,
    moveToUserBoardList,
    moveToUserInquiryList,
  };
};

export default useCustomMove;
