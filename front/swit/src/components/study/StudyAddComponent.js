import { useRef, useState, useEffect } from "react";
import { postAdd } from "../../api/StudyApi";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../../util/jwtDecode";
import "react-datepicker/dist/react-datepicker.css";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "./ResultStudyModal";
import roundGradient from "../../img/roundGradient.png";

const initState = {
  studyNo: 0,
  studyTitle: "제목을 입력하세요.",
  studyContent: "스토디 목적,내용,규칙 등 상세 정보를 입력하세요.",
  studyType: "스터디",
  studyStartDate: "",
  studyEndDate: "",
  studyHeadcount: 1,
  studyOnline: true,
  studySubject: "개발",
  studyAddr: "서울시 강동구",
};

const questionInit = {
  questionCount: 1,
  questions: [""],
};

const StudyAddComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const [study, setStudy] = useState({ ...initState });
  const [question, setQuestion] = useState({ ...questionInit });
  const [result, setResult] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const uploadRef = useRef();

  const { moveToGroup } = useCustomMove();

  const handleChangeStudy = (e) => {
    study[e.target.name] = e.target.value;
    setStudy({ ...study });
    console.log(e.target.name)
    console.log(e.target.value)
  };

  const handleClickAdd = () => {
    study["studyStartDate"] = startDate;

    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    console.log(files[1]);

    const formatDate = (date) => date.toISOString().split("T")[0];

    formData.append("studyTitle", study.studyTitle);
    formData.append("studyContent", study.studyContent);
    formData.append("studyType", study.studyType);
    formData.append("studyStartDate", formatDate(startDate));
    formData.append("studyHeadcount", study.studyHeadcount);
    formData.append("studyOnline", study.studyOnline);
    formData.append("studySubject", study.studySubject);
    formData.append("studyAddr", study.studyAddr);

    question.questions.forEach((question, index) => {
      formData.append("questions", question);
    });

    console.log(formData);
    postAdd(formData)
      .then((result) => {
        console.log("테스트@@@@@@@@@@@@@@@@@@",formData );
        setResult(result.studyNo);
        setStudy({ ...initState });
        setQuestion({ ...questionInit });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const closeModal = () => {
    moveToGroup(result);
    setResult(null);
  };
  //주제 리스트
  const subjectList = [
    { value: "수능" },
    { value: "공무원" },
    { value: "임용" },
    { value: "자격증" },
    { value: "어학" },
    { value: "취업" },
    { value: "학교" },
    { value: "개발" },
    { value: "기타" },
  ];
  //라디오 값이 바뀌는 함수
  const handleRadioChange = (e) => {
    const value = e.target.value === "true";
    setStudy((prevState) => ({
      ...prevState,
      studyOnline: value,
    }));
  };

  // 지역구분
  const [city, setCity] = useState("서울");
  const handleCityChange = (e) => {
    const { value } = e.target;
    setCity(value);
  };

  const addrList1 = [
    { value: "강남구" },
    { value: "강동구" },
    { value: "강북구" },
    { value: "관악구" },
    { value: "광진구" },
    { value: "구로구" },
    { value: "금천구" },
    { value: "동대문구" },
    { value: "동작구" },
    { value: "마포구" },
    { value: "서대문구" },
    { value: "서초구" },
    { value: "성동구" },
    { value: "송파구" },
    { value: "양천구" },
    { value: "영등포구" },
    { value: "용산구" },
    { value: "은평구" },
    { value: "종로구" },
    { value: "중구" },
    { value: "중랑구" },
  ];
  const addrList2 = [
    { value: "가평군" },
    { value: "고양시" },
    { value: "과천시" },
    { value: "광명시" },
    { value: "광주시" },
    { value: "구리시" },
    { value: "군포시" },
    { value: "김포시" },
    { value: "남양주시" },
    { value: "동두천시" },
    { value: "부천시" },
    { value: "성남시" },
    { value: "수원시" },
    { value: "시흥시" },
    { value: "안산시" },
    { value: "안성시" },
    { value: "안양시" },
    { value: "양주시" },
    { value: "양평군" },
    { value: "여주시" },
    { value: "연천군" },
    { value: "오산시" },
    { value: "용인시" },
    { value: "의왕시" },
    { value: "의정부시" },
    { value: "이천시" },
    { value: "파주시" },
    { value: "평택시" },
    { value: "포천시" },
    { value: "하남시" },
    { value: "화성시" },
  ];

  const addrList = city === "서울" ? addrList1 : addrList2;

  //질문
  const handleQuestionCountChange = (e) => {
    const questionCount = parseInt(e.target.value);
    setQuestion((prevState) => ({
      ...prevState,
      questionCount,
      questions: Array(questionCount).fill(""),
    }));
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = question.questions.map((q, i) =>
      i === index ? value : q
    );
    setQuestion((prevState) => ({
      ...prevState,
      questions: updatedQuestions,
    }));
  };

  //css
  const inputStyle1 =
    "w-full rounded border-0 px-3.5 py-2 mb-20 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 resize-none";
  const inputStyle2 =
    "w-52 rounded text-center border-0 py-2 mb-20 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300";
  const inputStyle3 =
    "w-full rounded  border-0 px-3.5 py-2 mb-4 resize-none text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300";
  const inputStyle4 =
    "w-52 rounded text-center border-0 py-2 mb-4 -ml-2 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300";

  return (
    <div className="flex justify-center font-GSans">
      {result && <ResultModal callbackFn={closeModal} />}
      <div className="w-full max-w-1000">
        <div className="text-3xl mb-16 pb-4 border-soild border-gray-200 border-b-2">
          <div className="w-64 py-7">
            <span className="shadow-highlight">스터디 만들기</span>
          </div>
        </div>

        {/* 제목 */}
        <div className="flex justify-between">
          <p className="w-24 py-2">제목</p>
          <input
            type="text"
            name="studyTitle"
            className={inputStyle1}
            placeholder={study.studyTitle}
            onChange={handleChangeStudy}
          />
        </div>

        {/* 종류 주제 */}
        <div className="flex justify-between">
          <p className="w-24 py-2">종류</p>
          <select
            className={inputStyle2}
            name="studyType"
            onChange={handleChangeStudy}
          >
            <option value="스터디">스터디</option>
            <option value="프로젝트">프로젝트</option>
            <option value="기타">기타</option>
          </select>
          <p className="w-24 py-2">주제</p>
          <select
            className={inputStyle2}
            name="studySubject"
            onChange={handleChangeStudy}
          >
            {subjectList.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.value}
              </option>
            ))}
          </select>
        </div>

        {/* 지역 인원 */}
        <div className="flex justify-between">
          <p className="w-24 py-2">지역(시/도)</p>
          <select
            className={inputStyle2}
            value={city}
            onChange={handleCityChange}
          >
            <option value="서울">서울</option>
            <option value="경기도">경기도</option>
          </select>
          <p className="w-24 py-2">지역(구/시)</p>
          <select
            className={inputStyle2}
            name="studyAddr"
            onChange={handleChangeStudy}
          >
            {addrList.map((addr) => (
              <option key={addr.value} value={city + " " + addr.value}>
                {addr.value}
              </option>
            ))}
          </select>
        </div>

        {/* 대면 비대면 */}
        <div className="flex gap-24">
          <label className="w-24 py-2">온라인</label>
          <div className="flex mt-2.5 mb-20">
            <div className="flex items-center">
              <input
                type="radio"
                value="true"
                checked={study.studyOnline === true}
                onChange={handleRadioChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 mx-2"
              />
              <label className="text-sm mr-2">온라인</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                value="false"
                checked={study.studyOnline === false}
                onChange={handleRadioChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 mx-2"
              />
              <label className="text-sm">오프라인</label>
            </div>
          </div>
          <p className="w-24 py-2">인원</p>
          <select
            className={inputStyle2}
            name="studyHeadcount"
            value={study.studyHeadcount}
            onChange={handleChangeStudy}
          >
            {[...Array(7)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}명
              </option>
            ))}
          </select>
        </div>
        {/* 내용 */}
        <div className="flex justify-between">
          <p className="w-24 py-2">내용</p>
          <textarea
            rows="4"
            name="studyContent"
            className={inputStyle1}
            placeholder={study.studyContent}
            onChange={handleChangeStudy}
          ></textarea>
        </div>
        <div className="flex justify-between">
          <div className="w-24 py-2">대표 사진</div>
          <input
            ref={uploadRef}
            className={inputStyle1}
            type={"file"}
            accept="image/*"
          ></input>
        </div>

        {/* 질문 */}
        <div className="flex">
          <p className="w-24 py-2">가입 질문</p>
          <select
            name="questionCount"
            className={inputStyle4}
            value={study.questionCount}
            onChange={handleQuestionCountChange}
          >
            {[...Array(5)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}개
              </option>
            ))}
          </select>
        </div>
        {question.questions.map((question, index) => (
          <div key={index} className="flex">
            <label htmlFor={`question-${index}`} className="w-24 py-2">
              ┕ 질문 {index + 1}
            </label>
            <input
              name={`question-${index}`}
              id={`question-${index}`}
              rows="2"
              className={inputStyle3}
              value={question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
            ></input>
          </div>
        ))}
        <div>
          <div className="my-20 flex justify-center">
            <button
              className=" rounded bg-yellow-200 px-28 py-4 text-center font-semibold shadow-sm hover:bg-yellow-400"
              onClick={handleClickAdd}
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
