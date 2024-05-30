import {useEffect, useState} from "react"
import {getStudy} from "../../api/StudyApi"
// import useCustomMove from "../../hooks/useCustomMove"

const initState = {
    studyNo:0,
    studyTitle:'읽기',
    studyContent:'콘텐츠',
    studyType: "스터디",
    studyStartDate : null,
    studyEndDate : null,
    studyHeadcount : 1,
    studyOnlineChk: false,
    studySubject : "개발",
    studyComm : "오픈채팅",
    studyLink : "kakao.com"
}

const StudyReadComponent =({studyNo}) =>{
    const[study, setStudy] = useState(initState)
    //파라미터를 가지고 페이지를 이동하는 기능은 useCustomMove()
    // const {moveToList, moveToModify} = useCustomMove()
    useEffect(()=>{
        getStudy(studyNo).then(data=>{
            console.log(data)
            setStudy(data)
        })
    }, [studyNo])
    return(
        <div className="border-2 border-sky-200 mt-10 m-2 p-4">
        {makeDiv('studyNo', study.studyNo)}
        {makeDiv('title', study.studyTitle)}
        {makeDiv('studyContent', study.studyContent)}
        {makeDiv('studyType', study.studyType)}
        {makeDiv('studyStartDate', study.studyStartDate)}
        {makeDiv('studyEndDate', study.studyEndDate)}
        {makeDiv('studyHeadcount', study.studyHeadcount)}
        {makeDiv('studyOnlineChk', study.studyOnlineChk ? '온라인' : '오프라인' )}
        {makeDiv('studyHeadcount', study.studySubject)}
        {makeDiv('studyComm', study.studyComm)}
        {makeDiv('studyLink', study.studyLink)}
        {/* <div className="flex justify-end p-4">
            <button type="button" className ="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500" onClick={()=> moveToList()}>
                List
            </button>
            <button type="button" className ="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500" onClick={()=> moveToModify(tno)}>
                Modify
            </button>
        </div> */}
    </div>
    )
}

const makeDiv = (title, value)=>
    <div className = "flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">{title}</div>
            <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">{value}</div>
        </div>
    </div>

export default StudyReadComponent;