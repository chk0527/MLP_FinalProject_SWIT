import { useRef, useState, useContext, useEffect } from "react";
import { getBoard, putOne, deleteOne } from "../../api/BoardApi"
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../util/jwtDecode";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
import { LoginContext } from "../../contexts/LoginContextProvider";

const initState = {
    boardNo: 0,
    boardTitle: '추가',
    boardContent: '콘텐츠',
    boardCategory: "스터디",
    userNo: 1
}

const BoardModifyComponent = ({boardNo}) => {
    const navigate = useNavigate();
    useEffect(() => {
        const userId = getUserIdFromToken();
        if (!userId) {
          alert("로그인이 필요합니다.");
          navigate("/login");
        }
      }, [navigate]);
      
    //유저정보중 userNo를 가져와서 게시글 작성시 유저와 연결
    const [board, setBoard] = useState({ ...initState })
    const [result, setResult] = useState(null)

    const { moveToRead, moveToBoardList } = useCustomMove();

    useEffect(() => {
        getBoard(boardNo).then(data => setBoard(data))
    }, [boardNo])

    const handleChangeBoard = (e) => {
        board[e.target.name] = e.target.value
        setBoard({ ...board })
    }

    const closeModal = () => {
        if (result == 'Deleted')
            moveToBoardList()
        else
            moveToRead(boardNo)
    }

    const handleClickModify = () => {
        putOne(board).then(result => {
            console.log("modify result : " +result)
            setResult('수정')
        })
    }

    const handleClickDelete = () => {
        deleteOne(boardNo).then(result => {
              console.log("delete result : " +result)
            setResult('삭제')
        })
    }

    return (
        <div className="isolate bg-white px-6 lg:px-8">
            {result ? <ResultModal title={'처리 결과'} content={`${result} 완료`} callbackFn={closeModal} /> : <></>}
            <div className="mx-auto max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">제목</label>
                        <div className="mt-2.5">
                            <input type="text" name="boardTitle" autoComplete="organization" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={board.boardTitle} onChange={handleChangeBoard} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">카테고리</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <select name="boardCategory" className="block rounded-md border-0 px-0 py-2 pl-2 mt-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={board.boardCategory} onChange={handleChangeBoard}>
                                    <option value="질문">질문</option>
                                    <option value="정보공유">정보공유</option>
                                    <option value="자유">자유</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">내용</label>
                        <div className="mt-2.5">
                            <textarea name="boardContent" id="message" rows="4" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={board.boardContent} onChange={handleChangeBoard}></textarea>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleClickModify}>수정</button>
                </div>
                <div className="mt-10">
                    <button className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleClickDelete}>삭제</button>
                </div>
            </div>
        </div>
    );
}

export default BoardModifyComponent;