import { useState, useEffect, useContext } from "react";
import { getBoard, deleteOne } from "../../api/BoardApi";
import { getComments, postAdd, deleteComment } from "../../api/CommentApi";
import { useNavigate, useLocation } from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";
import { LoginContext } from "../../contexts/LoginContextProvider";
import "react-datepicker/dist/react-datepicker.css";
import BoardDeleteModal from "./BoardDeleteModal";

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
    <div className="relative font-GSans">
      {showDeleteModal && (
        <BoardDeleteModal
          content="삭제"
          callbackFn={handleDeleteConfirmation}
          cancelFn={handleDeleteCancel}
        />
      )}
      <div className="absolute text-sm top-0 right-0 flex gap-2">
        {userInfo.userNo === board.userNo ? (
          <>
            <button
              className="rounded text-red-600 text-center"
              onClick={handleClickDelete}
            >
              삭제
            </button>
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
      <div className="flex py-6 justify-between border-gray-700 border-b-2">
        <h1 className="text-3xl font-bold mb-4">
          [{board.boardCategory}] {board.boardTitle}
        </h1>
        <div className="flex flex-col items-end text-sm text-gray-600">
          <span>닉네임: {board.userNick}</span>
          <span>게시일: {board.boardCreatedDate}</span>
        </div>
      </div>

      <div className="py-4 min-h-450">{board.boardContent}</div>
      <p className="my-2">댓글</p>
      <hr></hr>
      <div className="flex items-center my-2">
        <textarea
          name="commentContent"
          id="commentContent"
          rows="1"
          className="grow mx-4 resize-none rounded border border-gray-300 p-3.5 text-gray-900 shadow"
          value={comment.commentContent}
          onChange={handleChangeComment}
        ></textarea>
        <button
          className="rounded bg-yellow-600 text-white px-3.5 py-2.5 text-center"
          onClick={handleClickAdd}
        >
          작성
        </button>
      </div>
      <div>
        {comments
          .slice()
          .reverse()
          .map((comment, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded-lg bg-gray-50 relative"
            >
              <div className="text-sm text-gray-600">{comment.userNick} 님</div>
              <div className="mt-2 text-gray-900 whitespace-pre-line">
                {comment.commentContent}
              </div>
              {userInfo.userNo === comment.userNo && (
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  onClick={() => handleClickCommentDelete(comment.commentNo)}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default BoardReadComponent;
