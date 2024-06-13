import { useRef, useState } from "react";
import { postAdd } from "../../api/StudyApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

const initState = {
  studyNo: 0,
  studyTitle: "추가",
  studyContent: "콘텐츠",
  studyType: "스터디",
  studyStartDate: "",
  studyHeadcount: 1,
  studyOnline: true,
  studyAddr:"",
  studySubject: "개발",
  questionCount: 1,
  questions: [],
};

const StudyAddComponent = () => {
  const [study, setStudy] = useState({ ...initState });
  const [result, setResult] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const uploadRef = useRef();
  const { moveToGroup } = useCustomMove();

  const handleChangeStudy = (e) => {
    study[e.target.name] = e.target.value;
    setStudy({ ...study });
  };

  const handleClickAdd = () => {
    const formatDate = (date) => date.toISOString().split("T")[0];
    study["studyStartDate"] = formatDate(startDate);

    const files = uploadRef.current.files;
    const formData = new FormData();

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    formData.append("studyTitle", study.studyTitle);
    formData.append("studyContent", study.studyContent);
    formData.append("studyType", study.studyType);
    formData.append("studyStartDate", formatDate(startDate));
    formData.append("studyHeadcount", study.studyHeadcount);
    formData.append("studyOnline", study.studyOnline);
    formData.append("studySubject", study.studySubject);
    formData.append("studyAddr", study.studyAddr);

    study.questions.forEach((question) => {
      formData.append("questions", question);
    });

    postAdd(formData)
      .then((result) => {
        setResult(result.studyNo);
        setStudy({ ...initState });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const closeModal = () => {
    moveToGroup(result);
    setResult(null);
  };

  const handleRadioChange = (e) => {
    setStudy((prevState) => ({
      ...prevState,
      studyOnline: e.target.value === "true",
    }));
  };

  const handleQuestionCountChange = (e) => {
    const questionCount = parseInt(e.target.value);
    setStudy((prevState) => {
      const questions = [...prevState.questions];
      while (questions.length < questionCount) {
        questions.push("");
      }
      return {
        ...prevState,
        questionCount,
        questions: questions.slice(0, questionCount),
      };
    });
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = study.questions.map((q, i) =>
      i === index ? value : q
    );
    setStudy((prevState) => ({
      ...prevState,
      questions: updatedQuestions,
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
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              질문 수
            </label>
            <div className="relative mt-2.5">
              <select
                name="questionCount"
                className="block rounded-md border-0 px-0 py-2 pl-2 mt-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={study.questionCount}
                onChange={handleQuestionCountChange}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {study.questions.map((question, index) => (
            <div key={index} className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                질문 {index + 1}
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                />
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
          <div className="sm:col-span-2 mt-5">
            <button
              type="button"
              onClick={handleClickAdd}
              className="block w-full bg-indigo-600 text-white py-2 rounded-md"
            >
              작성 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyAddComponent;
