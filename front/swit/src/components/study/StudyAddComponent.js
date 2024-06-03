import { useState } from "react";
import { postAdd } from "../../api/StudyApi"
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
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
    studyOnline: true,
    studySubject: "개발",
    studyComm: "오픈채팅",
    studyLink: "kakao.com"
}

const StudyAddComponent = () => {
    const [study, setStudy] = useState({ ...initState })
    const [result, setResult] = useState(null)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const { moveToRead } = useCustomMove();

    const handleChangeStudy = (e) => {
        study[e.target.name] = e.target.value
        setStudy({ ...study })
    }

    const handleClickAdd = () => {
        study['studyStartDate'] = startDate
        study['studyEndDate'] = endDate
        console.log("추가 실행1")
        postAdd(study).then(result => {
            console.log("추가 실행")
            setResult(result.studyNo)
            setStudy({ ...initState })
        }).catch(e => {
            console.error(e)
        })
    }

    const closeModal = () => {
        moveToRead(result)
        setResult(null)
    }

    const handleRadioChange = (e) => {
        setStudy(prevState => ({
            ...prevState,
            studyOnline: e.target.value === 'online'
        }));
    }

    return (
        <div className="isolate bg-white px-6 lg:px-8">
            {result ? <ResultModal title={'Add Result'} content={`New ${result} Added`} callbackFn={closeModal} /> : <></>}
            <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
            </div>
            <div className="mx-auto max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">제목</label>
                        <div className="mt-2.5">
                            <input type="text" name="studyTitle" autoComplete="organization" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={study.studyTitle} onChange={handleChangeStudy}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">종류</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                {/* <label htmlFor="country" className="sr-only">Country</label> */}
                                <select name="studyType" className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" value={study.studyType} onChange={handleChangeStudy}>
                                    <option value="프로젝트">프로젝트</option>
                                    <option value="스터디">스터디</option>
                                    <option value="기타">기타</option>
                                </select>
                                {/* <svg className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg> */}
                            </div>
                            <input type="tel" name="phone-number" id="phone-number" autoComplete="tel" className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">인원수</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <label htmlFor="country" className="sr-only">Country</label>
                                <select id="country" name="studyHeadcount" className="h-full w-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"value={study.studyHeadcount} onChange={handleChangeStudy}>
                                    <option value={1}>1명</option>
                                    <option value={2}>2명</option>
                                    <option value={3}>3명</option>
                                    <option value={4}>4명</option>
                                    <option value={5}>5명</option>
                                    <option value={6}>6명</option>
                                    <option value={7}>7명</option>
                                    <option value={8}>7명 이상</option>
                                </select>
                                {/* <svg className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg> */}
                            </div>
                            <input type="text" name="phone-number" id="phone-number" autoComplete="tel" className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">주제</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                {/* <label htmlFor="country" className="sr-only">Country</label> */}
                                <select id="country" name="studySubject" className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" value={study.studySubject} onChange={handleChangeStudy}>
                                    <option value="자격증">자격증</option>
                                    <option value="개발">개발</option>
                                    <option value="공부">공부</option>
                                    <option value="기타">기타</option>
                                </select>
                                {/* <svg className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg> */}
                            </div>
                            <input type="tel" name="phone-number" id="phone-number" autoComplete="tel" className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">소통방법</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                {/* <label htmlFor="country" className="sr-only">Country</label> */}
                                <select id="country" name="studyComm" className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" value={study.studyComm} onChange={handleChangeStudy}>
                                    <option value="슬랙">슬랙</option>
                                    <option value="줌">줌</option>
                                    <option value="디스코드">디스코드</option>
                                    <option value="오픈채팅">오픈채팅</option>
                                    <option value="기타">기타</option>
                                </select>
                                {/* <svg className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg> */}
                            </div>
                            <input type="tel" name="phone-number" id="phone-number" autoComplete="tel" className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    {/* <div>
                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                        <div className="mt-2.5">
                            <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div> */}
                    <div>
                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">시작날짜</label>
                        <div className="mt-2.5">
                            <DatePicker
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="studyStartDate"
                                minDate={new Date()}
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">종료날짜</label>
                        <div className="mt-2.5">
                            <DatePicker
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="studyEndDate"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                            />
                        </div>
                    </div>
                    
                    {/* 원본
                    <div className="sm:col-span-2">
                        <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">Phone number</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <label htmlFor="country" className="sr-only">Country</label>
                                <select id="country" name="country" className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                    <option>US</option>
                                    <option>CA</option>
                                    <option>EU</option>
                                </select>
                                <svg className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input type="tel" name="phone-number" id="phone-number" autoComplete="tel" className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div> */}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold leading-6 text-gray-900">스터디 방법</label>
                        <div className="mt-2.5 flex items-center">
                            <input type="radio" id="online" name="studyOnline" value={true} checked={study.studyOnline} onChange={handleRadioChange} className="mr-2" />
                            <label htmlFor="online" className="mr-4">온라인</label>
                            <input type="radio" id="offline" name="studyOnline" value={false} checked={!study.studyOnline} onChange={handleRadioChange} className="mr-2" />
                            <label htmlFor="offline">오프라인</label>
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">내용</label>
                        <div className="mt-2.5">
                            <textarea name="studyContent" id="message" rows="4" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={study.studyContent} onChange={handleChangeStudy}></textarea>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button type="submit" className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleClickAdd}>작성 완료</button>
                </div>
            </div>
        </div>

        //여기서부터 (구) 코드
        // <div className="border-2 border-sky-200 mt-10 m-2 p-4">
        //     {result ? <ResultModal title={'Add Result'} content={`New ${result} Added`} callbackFn={closeModal} /> : <></>}
        //     <div className="flex justify-center">
        //         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        //             <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
        //             <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
        //                 name="studyTitle" type={'text'} value={study.studyTitle} onChange={handleChangeStudy}></input>
        //         </div>
        //     </div>
        //     <div className="flex justify-center">
        //         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        //             <div className="w-1/5 p-6 text-right font-bold">studyContent</div>
        //             <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
        //                 name="studyContent" type={'text'} value={study.studyContent} onChange={handleChangeStudy}></input>
        //         </div>
        //     </div>
        //     <div className="flex justify-center">
        //         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        //             <div className="w-1/5 p-6 text-right font-bold">studyStartDate</div>
        //             {/* <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
        //                 name="studyStartDate" type={'date'} value={study.studyStartDate} onChange={handleChangeStudy}></input> */}
        //             <DatePicker
        //                 className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
        //                 name="studyStartDate"
        //                 minDate={new Date()}
        //                 selected={startDate}
        //                 onChange={(date) => setStartDate(date)}
        //                 selectsStart
        //                 startDate={startDate}
        //                 endDate={endDate}
        //             />
        //         </div>
        //     </div>
        //     <div className="flex justify-center">
        //         <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        //             <div className="w-1/5 p-6 text-right font-bold">studyEndDate</div>
        //             {/* <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
        //                 name="studyEndDate" type={'date'} value={study.studyEndDate} onChange={handleChangeStudy}></input> */}
        //             <DatePicker
        //                 className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shawdow-md"
        //                 name="studyEndDate"
        //                 selected={endDate}
        //                 onChange={(date) => setEndDate(date)}
        //                 selectsEnd
        //                 startDate={startDate}
        //                 endDate={endDate}
        //                 minDate={startDate}
        //             />
        //         </div>
        //     </div>
        //     <div className="flex justify-end">
        //         <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
        //             <button type="button" className="rounded p-4 w-36 bg-blue-500 text-xl text-white" onClick={handleClickAdd}>ADD</button>
        //         </div>
        //     </div>
        // </div>
    );
}

export default StudyAddComponent;