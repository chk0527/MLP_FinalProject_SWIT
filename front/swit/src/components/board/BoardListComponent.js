import { useEffect, useState } from "react"
import { getBoardList } from "../../api/BoardApi"
import useCustomMove from "../../hooks/useCustomMove"
import PageComponent from "../common/PageComponent"
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
    const { page, size, moveToList, moveToRead } = useCustomMove()
    //
    const [serverData, setServerData] = useState(initState)

    useEffect(() => {
        getBoardList({ page, size }).then(data => {
            console.log(data)
            setServerData(data)
        })
    }, [page, size])
    return (
        <div className="border-2 border-blue-100 mt-10 ml-2">
            <div className="flex flex-wrap mx-auto justify-center p-6">
                {serverData.dtoList.map(board =>
                    <div key={board.boardNo}
                        className="w-full min-w-[400px] p-2 m-2 rounded shadow-md" onClick={()=>moveToRead(board.boardNo)}>
                        <div className="flex">
                            <div className="font-extrabold text-2xl p-2 w-1/12">
                                {board.boardNo}
                            </div>
                            <div className="text-1xl m-1 p-2 w-8/12 font-extrabold">
                                {board.title}
                            </div>
                            <div className="text-1xl m-1 p-2 w-2/10 font-medium">
                                {board.boardCreatDate}
                            </div>
                        </div>
                    </div>

                )}
            </div>
            <PageComponent serverData={serverData} movePage={moveToList}/>
        </div>
    ) //return 
}
export default BoardListComponent;