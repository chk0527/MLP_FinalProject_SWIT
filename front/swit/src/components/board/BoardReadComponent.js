import { useState, useEffect, useContext } from "react";
import { getBoard, deleteOne } from "../../api/BoardApi";
import { getComments, postAdd, deleteComment } from "../../api/CommentApi";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserIdFromToken } from "../../util/jwtDecode";
import useCustomMove from "../../hooks/useCustomMove";
import { LoginContext } from "../../contexts/LoginContextProvider";
import "react-datepicker/dist/react-datepicker.css";
import BoardDeleteModal from "./BoardDeleteModal";
import LoginRequireModal from "../common/LoginRequireModal";

const initState = {
  boardNo: 0,
  boardTitle: "추가",
  boardContent: "콘텐츠",
  boardCategory: "스터디",
  userNo: 0,
};

const commentInit = {
  commentContent: "",
  userNo: 0,
  boardNo: 0,
  userNick: "NoName",
};

const BoardReadComponent = ({ boardNo }) => {
  const { userInfo } = useContext(LoginContext);
  const [board, setBoard] = useState({ ...initState });
  const [comment, setComment] = useState({ ...commentInit });
  const [comments, setComments] = useState([]); // 댓글 상태 추가
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleChangeComment = (e) => {
    comment[e.target.name] = e.target.value;
    setComment({ ...comment });
  };

  const { moveToBoardList } = useCustomMove();
  useEffect(() => {
    getBoard(boardNo).then((data) => {
      console.log(data);
      setBoard(data);
    });

    getComments(boardNo).then((data) => {
      // 댓글 데이터를 가져오는 API 호출
      console.log(data);
      setComments(data);
    });
  }, [boardNo]);

  const handleClickAdd = () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setShowLoginModal(true);
    }
    comment.userNo = userInfo.userNo;
    comment.userNick = userInfo.userNick;
    comment.boardNo = boardNo;
    console.log(comment);
    postAdd(comment)
      .then((result) => {
        console.log(result);
        setComment({ ...commentInit });
        getComments(boardNo).then((data) => {
          console.log(data);
          setComments(data);
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleClickModify = () => {
    const newPath = location.pathname.replace("read", "modify");
    navigate(`${newPath}${location.search}`);
  };

  const handleDeleteConfirmation = () => {
    if (deleteTarget === "board") {
      deleteOne(boardNo)
        .then((result) => {
          console.log(result);
          navigate(-1);
        })
        .catch((e) => {
          console.error(e);
        });
    } else if (typeof deleteTarget === "number") {
      deleteComment(deleteTarget)
        .then((result) => {
          console.log(result);
          getComments(boardNo).then((data) => {
            console.log(data);
            setComments(data);
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleClickDelete = () => {
    setDeleteTarget("board");
    setShowDeleteModal(true);
  };

  const handleClickCommentDelete = (commentNo) => {
    setDeleteTarget(commentNo);
    setShowDeleteModal(true);
  };

  return (
    <div className="flex justify-center font-GSans">
       {showLoginModal && (
        <LoginRequireModal callbackFn={() => setShowLoginModal(false)} />
      )}
      <div className="relative w-full max-w-1000">
        {showDeleteModal && (
          <BoardDeleteModal
            content="삭제"
            callbackFn={handleDeleteConfirmation}
            cancelFn={handleDeleteCancel}
          />
        )}

        <div className="flex py-6 justify-between border-gray-700 border-b-2">
          <h1 className="text-3xl font-bold mb-4">
            [{board.boardCategory}] {board.boardTitle}
          </h1>
          <div className="flex flex-col items-end text-gray-600">
            <span>작성자: {board.userNick}</span>
            <span>게시일: {board.boardCreatedDate}</span>
          </div>
        </div>
        <div className="absolute text-sm top-28 right-4 flex gap-4">
          {userInfo.userNo === board.userNo ? (
            <>
              <button
                className="rounded text-red-600 text-center"
                onClick={handleClickDelete}
              >
                삭제
              </button>
              |
              <button
                className="rounded text-indigo-600 text-center "
                onClick={handleClickModify}
              >
                수정
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="text-xl py-10 px-2 min-h-450 whitespace-pre-line  border-gray-700 border-b-2">
          {board.boardContent}
        </div>

        <div className="flex items-center my-6">
          <textarea
            name="commentContent"
            id="commentContent"
            rows="1"
            className="grow mx-2 resize-none rounded border border-gray-300 p-3.5 text-gray-900 shadow"
            value={comment.commentContent}
            onChange={handleChangeComment}
          ></textarea>
          <button
            className="rounded bg-yellow-200 shadow px-3.5 py-2.5 text-center mx-2"
            onClick={handleClickAdd}
          >
            작성
          </button>
        </div>
        <div className="mb-28">
          <p className="my-2">댓글</p>
          <hr></hr>
          {comments
            .slice()
            .reverse()
            .map((comment, index) => (
              <div key={index}>
                <div className="my-4 p-4 rounded relative">
                  <div className="flex justify-between">
                    <div>{comment.userNick} 님</div>
                    {userInfo.userNo === comment.userNo && (
                      <button
                        className="text-sm text-red-600"
                        onClick={() =>
                          handleClickCommentDelete(comment.commentNo)
                        }
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div className="mt-2 whitespace-pre-line">
                    {comment.commentContent}
                  </div>
                </div>
                <hr />
              </div>
            ))}
          <div className="flex justify-center">
            <button
              type="button"
              className="rounded p-3 my-40 text-xl w-28 text-white bg-yellow-500"
              onClick={() => window.history.back()}
            >
              목록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardReadComponent;
