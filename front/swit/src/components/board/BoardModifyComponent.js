import { useRef, useState, useContext, useEffect } from "react";
import { getBoard, putOne, deleteOne } from "../../api/BoardApi";
import { useNavigate } from "react-router-dom";
import { getUserNickFromToken, getUserIdFromToken } from "../../util/jwtDecode";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
import { LoginContext } from "../../contexts/LoginContextProvider";

const initState = {
  boardNo: 0,
  boardTitle: "추가",
  boardContent: "콘텐츠",
  boardCategory: "스터디",
  userNo: 0,
};

const BoardModifyComponent = ({ boardNo }) => {
  const userNick = getUserNickFromToken();
  const { userInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const [image, setImage] = useState(null); // 업로드할 이미지 데이터
  const [imagePreview, setImagePreview] = useState(null); // 미리보기 이미지 데이터

  useEffect(() => {
    const userId = getUserNickFromToken();
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    getBoard(boardNo)
      .then((data) => {
        setBoard(data);
        if (userInfo.userNo !== data.userNo) {
          alert("작성자가 아닙니다.");
          navigate(-1);
        } else {
          // 기존 이미지 로드
          const imageName = localStorage.getItem(`board_${data.boardNo}`);
          if (imageName) {
            const imageUrl = localStorage.getItem(imageName);
            if (imageUrl) {
              data.imageData = imageUrl;
              setImagePreview(imageUrl);
            }
          }
        }
      })
      .catch((error) => {
        console.error("게시글 정보를 가져오는 중 오류 발생:", error);
        navigate(-1);
      });
  }, [boardNo, userInfo.userNo]);

  //유저정보중 userNo를 가져와서 게시글 작성시 유저와 연결
  const [board, setBoard] = useState({ ...initState });
  const [result, setResult] = useState(null);

  const { moveToRead, moveToBoardList } = useCustomMove();

  const handleChangeBoard = (e) => {
    board[e.target.name] = e.target.value;
    setBoard({ ...board });
  };

  const closeModal = () => {
    if (result == "Deleted") moveToBoardList();
    else moveToRead(boardNo);
  };

  const handleClickModify = () => {
    if (board.boardTitle.trim() !== "" && board.boardContent.trim() !== "") {
      if (image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          const imageName = `boardImage_${userInfo.userNick}_${Date.now()}`;
          localStorage.setItem(imageName, base64data);

          // 기존 이미지 삭제
          const oldImageName = localStorage.getItem(`board_${board.boardNo}`);
          if (oldImageName) {
            localStorage.removeItem(oldImageName);
          }

          // 새로운 이미지 URL을 로컬 스토리지에 저장
          localStorage.setItem(`board_${board.boardNo}`, imageName);

          // 이미지 URL을 함께 저장
          saveBoardData(imageName);
        };
        reader.readAsDataURL(image);
      } else {
        saveBoardData(null); // 이미지 없이 저장
      }
    } else if (board.boardTitle.trim() === "") {
      alert("제목을 입력해주세요");
    } else if (board.boardContent.trim() === "") {
      alert("내용을 입력해주세요");
    }
  };

  const saveBoardData = (imageName) => {
    board.userNo = userInfo.userNo;
    board.userNick = userInfo.userNick;
    putOne(board)
      .then((result) => {
        console.log(result);
        if (imageName) {
          // 게시글 수정 후에 이미지 URL을 로컬 스토리지에 저장
          const imageUrl = localStorage.getItem(imageName);
          localStorage.setItem(`board_${board.boardNo}`, imageUrl);
        }
        setResult("수정");
      })
      .catch((e) => {
        console.error(e);
      });
  };

// 이미지 파일 업로드 핸들러
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);
    const objectURL = URL.createObjectURL(file);
    setImagePreview(objectURL);
  } else {
    // 파일이 선택되지 않았을 때 처리
    setImage(null);
    setImagePreview(null);
  }
};

  const handleClickDelete = () => {
    deleteOne(boardNo).then((result) => {
      console.log("delete result : " + result);
      setResult("삭제");
    });
  };

  const inputStyle1 =
    "w-full rounded border-0 px-3.5 py-2 mb-20 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline-offset-2 focus-visible:outline-yellow-200 resize-none";
  const inputStyle2 =
    "w-52 rounded text-center border-0 py-2 mb-20 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-200";
  const inputStyle3 =
    "w-52 rounded text-center border-0 py-2 mb-20 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline-none";

  return (
    <div className="flex justify-center font-GSans">
      {result ? (
        <ResultModal content={"수정"} callbackFn={closeModal} />
      ) : (
        <></>
      )}
      <div className="w-full max-w-1000">
        <div className="text-3xl mb-16 pb-4 border-soild border-gray-200 border-b-2">
          <div className="w-64 py-7">
            <span className="shadow-highlight">게시글 수정</span>
          </div>
        </div>
        {/* 제목 */}
        <div className="flex justify-between">
          <p className="w-24 py-2">제목</p>
          <input
            type="text"
            name="boardTitle"
            className={inputStyle1}
            value={board.boardTitle}
            placeholder="제목"
            onChange={handleChangeBoard}
          />
        </div>

        {/* 카테고리 */}
        <div className="flex justify-between">
          <p className="w-24 py-2">카테고리</p>
          <select
            name="boardCategory"
            className={inputStyle2}
            value={board.boardCategory}
            onChange={handleChangeBoard}
          >
            <option value="질문">질문</option>
            <option value="정보공유">정보공유</option>
            <option value="자유">자유</option>
          </select>
          <p className="w-24 py-2">닉네임</p>
          <input
            type="text"
            readOnly
            className={inputStyle3}
            value={userNick}
          />
        </div>

        {/* 내용 */}
        <div className="flex justify-between">
          <p className="w-24 py-2">내용</p>
          <textarea
            name="boardContent"
            id="boardContent"
            placeholder="내용을 입력해주세요."
            rows="10"
            className={inputStyle1}
            value={board.boardContent}
            onChange={handleChangeBoard}
          ></textarea>
        </div>

        <div className="flex items-center">
          <p className="w-24 py-2">이미지</p>
          <div className="flex justify-between rounded items-center border-2 border w-full p-2">
            <input
              type="file"
              className=""
              accept="image/*"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <div className="flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="my-20 flex justify-center">
          <button
            className=" rounded bg-yellow-200 px-28 py-4 text-center font-semibold shadow-sm hover:bg-yellow-400"
            onClick={handleClickModify}
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardModifyComponent;
