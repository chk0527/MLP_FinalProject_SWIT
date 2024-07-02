import { useEffect, useState } from "react"
import { getBoardList } from "../../api/BoardApi"
import useCustomMove from "../../hooks/useCustomMove"
import PageComponent from "../common/PageComponent"
import { getUserIdFromToken } from "../../util/jwtDecode";
import { useNavigate } from "react-router-dom";
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
<div className="mx-auto mt-10 p-4 max-w-5xl">
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr>
                    <th className="py-4 px-6 border-b-2 border-gray-200 tracking-wider">No</th>
                    <th className="py-4 px-6 border-b-2 border-gray-200 tracking-wider">카테고리</th>
                    <th className="py-4 px-6 border-b-2 border-gray-200 tracking-wider">제목</th>
                    <th className="py-4 px-6 border-b-2 border-gray-200 tracking-wider">작성자</th>
                    <th className="py-4 px-6 border-b-2 border-gray-200 tracking-wider">작성일</th>
                </tr>
            </thead>
            <tbody>
                {serverData.dtoList.map(board => (
                    <tr key={board.boardNo} onClick={() => moveToBoardRead(board.boardNo)} className="hover:bg-gray-100 cursor-pointer">
                        <td className="py-4 px-6 text-center border-b tracking-wider">{board.boardNo}</td>
                        <td className="py-4 px-6 text-center border-b tracking-wider">{board.boardCategory}</td>
                        <td className="py-4 px-6 border-b tracking-wider">{board.boardTitle}</td>
                        <td className="py-4 px-6 text-center border-b tracking-wider">{board.userNick}</td>
                        <td className="py-4 px-6 text-center border-b tracking-wider">{board.boardCreatedDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    <PageComponent serverData={serverData} movePage={moveToBoardList} />
    <div className="flex justify-end mt-4">
        <button
            onClick={handleAddBoard}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded tracking-wider"
        >
            글쓰기
        </button>
    </div>
</div>
        // <div className="border-2 border-blue-100 mt-10 ml-2">
        //     <div className="flex flex-wrap mx-auto justify-center p-6">
        //         <div
        //             className="w-full min-w-[400px] p-2 m-2 rounded shadow-md">
        //             <div className="flex">
        //                 <div className="font-extrabold text-2xl p-2 w-1/12">
        //                     No
        //                 </div>                        
        //                 <div className="text-1xl m-1 p-2 w-8/12 font-extrabold">
        //                     카테고리
        //                 </div>
        //                 <div className="text-1xl m-1 p-2 w-8/12 font-extrabold">
        //                     제목
        //                 </div>
        //                 <div className="text-1xl m-1 p-2 w-2/10 font-medium">
        //                     작성일
        //                 </div>
        //             </div>
        //         </div>
        //         {serverData.dtoList.map(board =>
        //             <div key={board.boardNo}
        //                 className="w-full min-w-[400px] p-2 m-2 rounded shadow-md" onClick={() => moveToBoardRead(board.boardNo)}>
        //                 <div className="flex">
        //                     <div className="font-extrabold text-2xl p-2 w-1/12">
        //                         {board.boardNo}
        //                     </div>                            
        //                     <div className="text-1xl m-1 p-2 w-8/12 font-extrabold">
        //                         {board.boardCategory}
        //                     </div>
        //                     <div className="text-1xl m-1 p-2 w-8/12 font-extrabold">
        //                         {board.boardTitle}
        //                     </div>
        //                     <div className="text-1xl m-1 p-2 w-2/10 font-medium">
        //                         {board.boardCreatedDate}
        //                     </div>
        //                 </div>
        //             </div>

        //         )}
        //     </div>
        //     <PageComponent serverData={serverData} movePage={moveToBoardList} />
        //     <div className="grid place-items-end">
        //         <button
        //             onClick={handleAddBoard}
        //             className=" hover:bg-yellow-200 border-2 border-solid border-black  py-2 px-4 rounded mt-4"
        //         >
        //             게시글 작성
        //         </button>
        //     </div>
        // </div>
    ) //return 
}
export default BoardListComponent;
