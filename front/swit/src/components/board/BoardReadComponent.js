import { useState, useEffect, useContext } from "react";
import { getBoard } from "../../api/BoardApi";
import { postAdd } from "../../api/CommentApi";
import useCustomMove from "../../hooks/useCustomMove";
import { LoginContext } from "../../contexts/LoginContextProvider";
import "react-datepicker/dist/react-datepicker.css";

const initState = {
    boardNo: 0,
    boardTitle: '추가',
    boardContent: '콘텐츠',
    boardCategory: "스터디",
    userNo: 0
};

const commentInit = {
    commentContent: '',
    userNo: 0,
    boardNo: 0
}

const BoardReadComponent = ({ boardNo }) => {
    const { userInfo } = useContext(LoginContext)
    const [board, setBoard] = useState({ ...initState });
    const [comment, setComment] = useState({...commentInit})

    const handleChangeComment = (e) => {
        comment[e.target.name] = e.target.value
        setComment({ ...comment })
    }

    const { moveToBoardList } = useCustomMove();
    useEffect(() => {
        getBoard(boardNo).then((data) => {
            console.log(data);
            setBoard(data);
        });
    }, [boardNo]);

    const handleClickAdd = () => {
        comment.userNo = userInfo.userNo
        comment.boardNo = boardNo
        postAdd(comment).then(result => {
            console.log(result)
            setComment({ ...initState })
        }).catch(e => {
            console.error(e)
        })
    }

    return (
        <div className="isolate bg-white px-6 lg:px-8">
            <div className="mx-auto max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">제목</label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                name="boardTitle"
                                autoComplete="organization"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={board.boardTitle}
                                readOnly
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">카테고리</label>
                        <div className="relative mt-2.5">
                            <select
                                name="boardCategory"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={board.boardCategory}
                                disabled
                            >
                                <option value="질문">질문</option>
                                <option value="정보공유">정보공유</option>
                                <option value="자유">자유</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">내용</label>
                        <div className="mt-2.5">
                            <textarea
                                name="boardContent"
                                id="message"
                                rows="4"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={board.boardContent}
                                readOnly
                            ></textarea>
                        </div>
                    </div>
                </div>
                                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">댓글</label>
                        <div className="mt-2.5">
                            <textarea name="commentContent" id="message" rows="4" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={comment.commentContent} onChange={handleChangeComment}></textarea>
                        </div>
                    </div>
                <div className="mt-10">
                    <button className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleClickAdd}>작성</button>
                </div>
            </div>
        </div>
    );
}

export default BoardReadComponent;
