import { useRef, useState } from "react";
import { postAdd } from "../../api/StudyApi"
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

const initState = {
    boardNo: 0,
    boardTitle: '추가',
    boardContent: '콘텐츠',
    boardCategory: "스터디",
    studyHeadcount: 1,
    studyOnline: true,
    studySubject: "개발",
    studyComm: "오픈채팅",
    studyLink: "kakao.com",
}

const BoardAddComponent = () => {
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

        const files = uploadRef.current.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        console.log(files[1])

        const formatDate = (date) => date.toISOString().split('T')[0];

        formData.append("studyTitle", study.studyTitle);
        formData.append("studyContent", study.studyContent);
        formData.append("studyType", study.studyType);
        // formData.append("studyStartDate", study.studyStartDate);
        // formData.append("studyEndDate", study.studyEndDate);
        formData.append("studyStartDate", formatDate(startDate));
        formData.append("studyEndDate", formatDate(endDate));
        formData.append("studyHeadcount", study.studyHeadcount);
        formData.append("studyOnline", study.studyOnline);
        formData.append("studySubject", study.studySubject);
        formData.append("studyComm", study.studyComm);
        formData.append("studyLink", study.studyLink);
        formData.append("country", study.country);

        postAdd(formData).then(result => {
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
            <div className="mx-auto max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">제목</label>
                        <div className="mt-2.5">
                            <input type="text" name="studyTitle" autoComplete="organization" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={study.studyTitle} onChange={handleChangeStudy} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">종류</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <select name="studyType" className="block rounded-md border-0 px-0 py-2 pl-2 mt-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={study.studyType} onChange={handleChangeStudy}>
                                    <option value="프로젝트">프로젝트</option>
                                    <option value="스터디">스터디</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">인원수</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <label htmlFor="country" className="sr-only">Country</label>
                                <select id="country" name="studyHeadcount" className="block rounded-md border-0 px-0 py-2 pl-2 mt-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={study.studyHeadcount} onChange={handleChangeStudy}>
                                    <option value={1}>1명</option>
                                    <option value={2}>2명</option>
                                    <option value={3}>3명</option>
                                    <option value={4}>4명</option>
                                    <option value={5}>5명</option>
                                    <option value={6}>6명</option>
                                    <option value={7}>7명</option>
                                    <option value={8}>7명 이상</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 mt-10 text-gray-900">주제</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <select id="country" name="studySubject" className="block rounded-md border-0 px-0 py-2 pl-2 mt-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={study.studySubject} onChange={handleChangeStudy}>
                                    <option value="자격증">자격증</option>
                                    <option value="개발">개발</option>
                                    <option value="공부">공부</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 mt-10 text-gray-900">소통방법</label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <select id="country" name="studyComm" className="block rounded-md border-0 px-2 py-2 mt-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={study.studyComm} onChange={handleChangeStudy}>
                                    <option value="슬랙">슬랙</option>
                                    <option value="줌">줌</option>
                                    <option value="디스코드">디스코드</option>
                                    <option value="오픈채팅">오픈채팅</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 mt-10 text-gray-900">시작날짜</label>
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
                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 mt-10 text-gray-900">종료날짜</label>
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

                <div className="flex justify-center">
                    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                        <div className="w-1/5 p-6 text-right font-bold">Files</div>
                        <input
                            ref={uploadRef}
                            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                            type={"file"}
                            accept="image/*"
                        ></input>
                    </div>
                </div>

                <div>
                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">질문 개수</label>
                    <div className="relative mt-2.5">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                            <select name="questionCount" className="block rounded-md border-0 px-0 py-2 pl-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={study.questionCount} onChange={handleQuestionCountChange}>
                                <option value="1">1개</option>
                                <option value="2">2개</option>
                                <option value="3">3개</option>
                                <option value="4">4개</option>
                                <option value="5">5개</option>
                            </select>

                        </div>
                        <input type="tel" name="phone-number" id="phone-number" autoComplete="tel"/>
                    </div>
                </div>

                {question.questions.map((question, index) => (
                    <div key={index} className="sm:col-span-2 mt-5">
                        <label htmlFor={`question-${index}`} className="block text-sm font-semibold leading-6 text-gray-900">질문 {index + 1}</label>
                        <div className="mt-2.5">
                            <textarea name={`question-${index}`} id={`question-${index}`} rows="2" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={question} onChange={(e) => handleQuestionChange(index, e.target.value)}></textarea>
                        </div>
                    </div>
                ))}

                <div className="mt-10">
                    <button className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleClickAdd}>작성 완료</button>
                </div>
            </div>
        </div>
    );
}

export default BoardAddComponent;