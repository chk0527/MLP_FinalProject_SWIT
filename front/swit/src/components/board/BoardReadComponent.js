import { useState, useEffect, useContext } from "react";
import { getBoard } from "../../api/BoardApi";
import { getComments, postAdd } from "../../api/CommentApi";
import { useNavigate, useLocation } from "react-router-dom";
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
    boardNo: 0,
    userNick: 'NoName'
};

const BoardReadComponent = ({ boardNo }) => {
    const { userInfo } = useContext(LoginContext)
    const [board, setBoard] = useState({ ...initState });
    const [comment, setComment] = useState({ ...commentInit })
    const [comments, setComments] = useState([]); // 댓글 상태 추가
    const navigate = useNavigate();
    const location = useLocation();

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

        getComments(boardNo).then((data) => { // 댓글 데이터를 가져오는 API 호출
            console.log(data);
            setComments(data);
        });
    }, [boardNo]);

    const handleClickAdd = () => {
        comment.userNo = userInfo.userNo
        comment.userNick = userInfo.userNick
        comment.boardNo = boardNo
        console.log(comment)
        postAdd(comment).then(result => {
            console.log(result)
            setComment({ ...commentInit })
            getComments(boardNo).then((data) => {
                console.log(data);
                setComments(data);
            });
        }).catch(e => {
            console.error(e)
        })
    }

    const handleClickModify = () => {
        const newPath = location.pathname.replace('read', 'modify');
        navigate(`${newPath}${location.search}`);
    }

    return (
        <div className="isolate bg-white px-6 lg:px-8">
            <div className="mx-auto min-w-[800px] max-w-7xl py-10 px-20">
                <div className="border-b border-gray-300 pb-4 mb-4">
                    <h2 className="text-2xl font-semibold mb-2">[{board.boardCategory}] {board.boardTitle}</h2>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{board.userNick}</span>
                        <span>{board.boardCreatedDate}</span>
                    </div>
                </div>
                <div className="py-4 mb-6" style={{ minHeight: '200px' }}>
                    {board.boardContent}
                </div>
                <div className="mb-6">
                    <label htmlFor="commentContent" className="block text-sm font-semibold mb-2">댓글</label>
                    <textarea
                        name="commentContent"
                        id="commentContent"
                        rows="4"
                        className="block w-full rounded-md border border-gray-300 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={comment.commentContent}
                        onChange={handleChangeComment}>
                    </textarea>
                </div>
                <div>
                    {comments.map((comment, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                            <div className="text-sm text-gray-600">
                                {comment.userNick}
                            </div>
                            <div className="mt-2 text-gray-900">
                                {comment.commentContent}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10">
                    <button
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleClickAdd}>
                        작성
                    </button>
                </div>
                {userInfo.userNo === board.userNo ?
                    <div className="mt-10">
                        <button
                            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleClickModify}>
                            수정
                        </button>
                    </div> : <></>}
            </div>
        </div>
    );
}

export default BoardReadComponent;
