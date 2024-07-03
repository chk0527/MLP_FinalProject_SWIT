import { useEffect, useState } from "react";
import { getBoardList, getBoardSearch } from "../../api/BoardApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import { getUserIdFromToken } from "../../util/jwtDecode";
import { useNavigate } from "react-router-dom";
//아이콘
import searchIcon from "../../img/search-icon.png";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const BoardListComponent = () => {
  const { page, size, moveToBoardList, moveToBoardRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [searchParams, setSearchParams] = useState({
    searchType: "boardTitle",
    searchText: "",
    boardCategory: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    getBoardList({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  }, [page, size]);

  const handleSearch = (params = searchParams) => {
    const { searchType, searchText, boardCategory } = params;
    const searchParams = {
      [searchType]: searchText,
      boardCategory: boardCategory || "",  // 카테고리가 없으면 전체 가져오기
    };
    console.log(searchParams)
    getBoardSearch(searchParams, { page, size }).then((data) => {
      console.log(data);
      setServerData(data);
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };
  const handleCategoryChange = (category) => {
    setSearchParams((prevParams) => {
      const newCategory = prevParams.boardCategory === category ? "" : category;
      const newParams = { ...prevParams, boardCategory: newCategory };
      
      handleSearch(newParams);  // 카테고리를 변경하자마자 검색 수행
      
      return newParams;
    });
  };
  const handleAddBoard = () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    navigate("/board/add", { state: 0 });
  };

  return (
    <div className="relative w-full font-GSans">
      <div className="flex w-full justify-between px-8">
        <div className="text-5xl pb-16 font-blackHans">게시판</div>
        <div className="text-2xl -m-4 pb-10">
          <div className="text-right flex justify-end pb-4">
            {/* 검색 유형 선택 */}
            <select
              name="searchType"
              className="focus:outline-none mx-2"
              onChange={handleInputChange}
              value={searchParams.searchType}
            >
              <option value="boardTitle">제목</option>
              <option value="boardContent">내용</option>
              <option value="userNick">작성자</option>
            </select>
            {/* 검색 입력 */}
            <input
              className="focus:outline-none"
              type="text"
              placeholder="검색"
              name="searchText"
              value={searchParams.searchText}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleSearch}>
              <img className="size-6" src={searchIcon} alt="검색" />
            </button>
          </div>
          <div className="flex justify-end pb-4">
            {/* 카테고리 선택 */}
            <div
              className={`mx-4 cursor-pointer ${searchParams.boardCategory === "질문" ? "font-bold text-black" : "text-gray-500"}`}
              onClick={() => handleCategoryChange("질문")}
            >
              질문
            </div>
            |
            <div
              className={`mx-4 cursor-pointer ${searchParams.boardCategory === "정보공유" ? "font-bold text-black" : "text-gray-500"}`}
              onClick={() => handleCategoryChange("정보공유")}
            >
              정보공유
            </div>
            |
            <div
              className={`mx-4 cursor-pointer ${searchParams.boardCategory === "자유" ? "font-bold text-black" : "text-gray-500"}`}
              onClick={() => handleCategoryChange("자유")}
            >
              자유
            </div>
          </div>
        </div>
      </div>
      <div className="h-650">
        <table className="w-1300 bg-white border-y border-gray-200">
          <thead>
            <tr className="bg-yellow-100">
              <th className="w-32 py-4 border-b-2 border-gray-200">No</th>
              <th className="w-52 py-4 border-b-2 border-gray-200">카테고리</th>
              <th className="py-4 border-b-2 border-gray-200">제목</th>
              <th className="w-52 py-4 border-b-2 border-gray-200">작성자</th>
              <th className="w-52 py-4 border-b-2 border-gray-200">작성일</th>
            </tr>
          </thead>
          <tbody>
            {serverData.dtoList.map((board) => (
              <tr
                key={board.boardNo}
                onClick={() => moveToBoardRead(board.boardNo)}
                className="hover:bg-gray-100 cursor-pointer"
              >
                <td className="py-4 text-center border-b">{board.boardNo}</td>
                <td className="py-4 text-center border-b">{board.boardCategory}</td>
                <td className="py-4 text-center border-b">{board.boardTitle}</td>
                <td className="py-4 text-center border-b">{board.userNick}</td>
                <td className="py-4 text-center border-b">{board.boardCreatedDate.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleAddBoard}
          className="hover:bg-yellow-200 border-2 border-solid border-black py-2 px-4 rounded mt-4"
        >
          글쓰기
        </button>
      </div>
      <PageComponent serverData={serverData} movePage={moveToBoardList} />
    </div>
  );
};

export default BoardListComponent;