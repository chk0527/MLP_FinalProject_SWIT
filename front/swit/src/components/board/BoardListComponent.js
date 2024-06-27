import { useEffect, useState} from "react"
import { getBoardList } from "../../api/BoardApi"
import useCustomMove from "../../hooks/useCustomMove"
import PageComponent from "../common/PageComponent"
import { getUserIdFromToken } from "../../util/jwtDecode";
import { useNavigate} from "react-router-dom";
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
    current: 0
}

const BoardListComponent = () => {
    const { page, size, moveToBoardList, moveToBoardRead } = useCustomMove()
    //
    const [serverData, setServerData] = useState(initState)

    const navigate = useNavigate();
    useEffect(() => {
        getBoardList({ page, size }).then(data => {
            console.log(data)
            setServerData(data)
        })
    }, [page, size])

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
        <div className="border-2 border-blue-100 mt-10 ml-2">
            <div className="flex flex-wrap mx-auto justify-center p-6">
                {serverData.dtoList.map(board =>
                    <div key={board.boardNo}
                        className="w-full min-w-[400px] p-2 m-2 rounded shadow-md" onClick={() => moveToBoardRead(board.boardNo)}>
                        <div className="flex">
                            <div className="font-extrabold text-2xl p-2 w-1/12">
                                {board.boardNo}
                            </div>
                            <div className="text-1xl m-1 p-2 w-8/12 font-extrabold">
                                {board.boardTitle}
                            </div>
                            <div className="text-1xl m-1 p-2 w-2/10 font-medium">
                                {board.boardCreatedDate}
                            </div>
                        </div>
                    </div>

                )}
            </div>
            <PageComponent serverData={serverData} movePage={moveToBoardList} />
            <div className="grid place-items-end">
                <button
                    onClick={handleAddBoard}
                    className=" hover:bg-yellow-200 border-2 border-solid border-black  py-2 px-4 rounded mt-4"
                >
                    게시글 작성
                </button>
            </div>
        </div>
    ) //return 
}
export default BoardListComponent;
