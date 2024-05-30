import { useState } from "react";
import { postAdd } from "../../api/StudyApi"
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

const initState = {
    studyNo: 0,
    studyTitle: '추가',
    studyContent: '콘텐츠',
    studyType: "스터디",
    studyStartDate: '',
    studyEndDate: '',
    studyHeadcount: 1,
    studyOnlineChk: false,
    studySubject: "개발",
    studyComm: "오픈채팅",
    studyLink: "kakao.com"
}

const StudyAddComponent = () => {
    const [study, setStudy] = useState({...initState})
    const [result, setResult] = useState(null)
    const {moveToRead} = useCustomMove();

    const handleChangeStudy = (e) => {
        study[e.target.name] = e.target.value
        setStudy({ ...study })
    }

    const handleClickAdd = () => {
        postAdd(study).then(result => {
            console.log("추가 실행")
            setResult(result.studyNo)
            setStudy({...initState})
        }).catch(e => {
            console.error(e)
        })
    }

    const closeModal = () => {
        moveToRead(result)
        setResult(null)
    }

    return (
        <div className="border-2 border-sky-200 mt-10 m-2 p-4">
            {result ? <ResultModal title={'Add Result'} content={`New ${result} Added`} callbackFn={closeModal} /> : <></>}
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
                        name="studyTitle" type={'text'} value={study.studyTitle} onChange={handleChangeStudy}></input>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">studyContent</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
                        name="studyContent" type={'text'} value={study.studyContent} onChange={handleChangeStudy}></input>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">studyStartDate</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
                        name="studyStartDate" type={'date'} value={study.studyStartDate} onChange={handleChangeStudy}></input>
                </div>
            </div>
                        <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <div className="w-1/5 p-6 text-right font-bold">studyEndDate</div>
                    <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
                        name="studyEndDate" type={'date'} value={study.studyEndDate} onChange={handleChangeStudy}></input>
                </div>
            </div>
            <div className="flex justify-end">
                <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
                    <button type="button" className="rounded p-4 w-36 bg-blue-500 text-xl text-white" onClick={handleClickAdd}>ADD</button>
                </div>
            </div>
        </div>
    );
}

export default StudyAddComponent;