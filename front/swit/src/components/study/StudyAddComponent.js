import { useRef, useState } from "react";
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
    studyLink: "kakao.com",
}

const questionInit = {
    questionCount: 1,
    questions: [""]
}

const StudyAddComponent = () => {
    const [study, setStudy] = useState({ ...initState })
    const [question, setQuestion] = useState({...questionInit})
    const [result, setResult] = useState(null)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const uploadRef = useRef()

    const { moveToGroup } = useCustomMove();

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
        
        question.questions.forEach((question, index) => {
            formData.append("questions", question);
        });

        postAdd(formData).then(result => {
            console.log("추가 실행")
            setResult(result.studyNo)
            setStudy({ ...initState })
            setQuestion({...questionInit})
        }).catch(e => {
            console.error(e)
        })
    }

    const closeModal = () => {
        moveToGroup(result)
        setResult(null)
    }

    const handleRadioChange = (e) => {
        setStudy(prevState => ({
            ...prevState,
            studyOnline: e.target.value === 'online'
        }));
    }

    const handleQuestionCountChange = (e) => {
        const questionCount = parseInt(e.target.value);
        setQuestion(prevState => ({
            ...prevState,
            questionCount,
            questions: Array(questionCount).fill('')
        }));
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = question.questions.map((q, i) => (i === index ? value : q));
        setQuestion(prevState => ({
            ...prevState,
            questions: updatedQuestions
        }));
    };

    return (
      <div className="isolate bg-white px-6 lg:px-8">
        {result && (
          <ResultModal
            title={"Add Result"}
            content={`New ${result} Added`}
            callbackFn={closeModal}
          />
        )}
        <div className="mx-auto max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                제목
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="studyTitle"
                  autoComplete="organization"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={study.studyTitle}
                  onChange={handleChangeStudy}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                종류
              </label>
              <div className="relative mt-2.5">
                <select
                  name="studyType"
                  className="block rounded-md border-0 px-0 py-2 pl-2 mt-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={study.studyType}
                  onChange={handleChangeStudy}
                >
                  <option value="프로젝트">프로젝트</option>
                  <option value="스터디">스터디</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                인원수
              </label>
              <div className="relative mt-2.5">
                <select
                  name="studyHeadcount"
                  className="block rounded-md border-0 px-0 py-2 pl-2 mt-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={study.studyHeadcount}
                  onChange={handleChangeStudy}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                주소
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="studyAddr"
                  autoComplete="organization"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={study.studyAddr}
                  onChange={handleChangeStudy}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                날짜
              </label>
              <div className="mt-2.5">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                내용
              </label>
              <div className="mt-2.5">
                <textarea
                  name="studyContent"
                  rows="4"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={study.studyContent}
                  onChange={handleChangeStudy}
                ></textarea>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                온라인 여부
              </label>
              <div className="flex mt-2.5">
                <div className="flex items-center mr-4">
                  <input
                    type="radio"
                    name="studyOnline"
                    value="true"
                    checked={study.studyOnline}
                    onChange={handleRadioChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-900">
                    온라인
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="studyOnline"
                    value="false"
                    checked={!study.studyOnline}
                    onChange={handleRadioChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-900">
                    오프라인
                  </label>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                주제
              </label>
              <div className="relative mt-2.5">
                <select
                  name="studySubject"
                  className="block w-full rounded-md border-0 px-0 py-2 pl-2 mt-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={study.studySubject}
                  onChange={handleChangeStudy}
                >
                  <option value="개발">개발</option>
                  <option value="디자인">디자인</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
                {/* @@@@@@@@@@@@ */}
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
                          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              파일 업로드
            </label>
            <div className="mt-2.5">
              <input
                type="file"
                ref={uploadRef}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                multiple
              />
            </div>
          </div>
                <div className="mt-10">
                    <button className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleClickAdd}>작성 완료</button>
                </div>
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