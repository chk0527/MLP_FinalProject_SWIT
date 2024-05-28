import {useEffect, useState} from "react"
import {getOne} from "../../api/loginApi"               // 통신설정
//import useCustomMove from "../../hooks/useCustomMove"

const initState = {
    user_id:'',
    user_password:''
}

const ReadComponent =({user_id}) =>{
    const[logoin, setLogin] = useState(initState)
    //파라미터를 가지고 페이지를 이동하는 기능은 useCustomMove()
    //const {moveToList} = useCustomMove()
    //const {moveToList, moveToModify} = useCustomMove()

    useEffect(()=>{
        getOne(user_id).then(data=>{
            console.log(data)
            setTodo(data)
        })
    }, [user_id])
    return(
        // <div className="border-2 border-sky-200 mt-10 m-2 p-4">
        //     {makeDiv('Tno', todo.tno)}
        //     {makeDiv('Writer', todo.writer)}
        //     {makeDiv('Title', todo.title)}
        //     {makeDiv('Due Date', todo.dueDate)}
        //     {makeDiv('Complete', todo.complete ? '완료' : '진행중' )}
        //     <div className="flex justify-end p-4">
        //         <button type="button" className ="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500" onClick={()=> moveToList()}>
        //             List
        //         </button>
        //         <button type="button" className ="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500" onClick={()=> moveToModify(tno)}>
        //             Modify
        //         </button>
        //     </div>
        // </div>
        <div></div>
    )
}

export default ReadComponent;