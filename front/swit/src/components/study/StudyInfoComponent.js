import { useState, useEffect } from 'react';
import { getStudy } from "../../api/StudyApi";
import { useNavigate } from "react-router-dom";
import StudyMeetingComponent from './StudyMeetingComponent';

const initState = {
    studyNo: 0,
    studyTitle: "",
    userId: "",
    studyContent: "",
    studyType: "",
    studyStartDate: null,
    studyEndDate: null,
    studyOnline: false,
    studySubject: "",
    studyComm: "",
    studyHeadcount: 0
  };

const StudyInfoComponent = ({studyNo}) => {
    const [study, setStudy] = useState(initState);
    const navigate = useNavigate(); // 이전 페이지로 이동하기 위한 함수

    useEffect(() => {
        getStudy(studyNo).then((data) => {
          console.log(data);
          setStudy(data);
        });
      }, [studyNo]);

    return (
        <div className="p-4 flex flex-col items-center">
            {/*스터디 정보란*/}
            <div className="bg-gray-200 p-4 rounded-lg relative max-w-screen-lg w-full">
                <h1 className="text-2xl font-bold text-center">리액트 같이 공부하실 분 모집해요~!</h1>
                <div className="flex items-start mt-4">
                    <div className="w-256 h-192 rounded-lg mr-6 bg-gray-500 border border-gray-800 flex items-center justify-center">
                        <img
                            // front/swit/public 폴더에 접근하는 절대경로
                            src={`${process.env.PUBLIC_URL}/study_group.png`}
                            alt="Profile"
                            className="w-64 h-54 rounded-lg object-cover"
                        />
                    </div>
                    <div className="ml-auto text-left flex flex-col items-center h-54">
                        <p><strong>소개:</strong> {study.studyTitle}</p>
                        <p><strong>주제:</strong> {study.studySubject}</p>
                        <p><strong>진행방식:</strong> {study.studyComm}</p>
                        <p><strong>인원:</strong> {study.studyHeadcount}</p>
                        <p><strong>날짜:</strong> {study.studyStartDate} ~ {study.studyEndDate}</p>
                        <p><strong>방장:</strong> {study.userId}</p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <StudyMeetingComponent studyUuid={study.studyUuid}/>
                </div>
                <div className="mt-4 p-4 border border-gray-300 bg-yellow-100 text-left">
                    <p>✏️ 주 4회 상시 자율 출석 취업 스터디반 운영 중입니다! (현재 모집X)</p>
                    <p>스터디 멤버가 아니어도 줌 참석 자유 이용 가능합니다!</p>
                    <p>(타이머 정지 없이 캠 off 5분 이상 금지, 캠 화면에 책이나 모니터 등 공부하는 모습이 잘 보이게 부탁드립니다.)</p>
                    <p>오류 발생 시 임시 대피소:</p>
                    <a href="https://study.whaleon.naver.com/detail/9503d642815e4355987b9afd00bbb6d3" className="text-blue-500">https://study.whaleon.naver.com/detail/9503d642815e4355987b9afd00bbb6d3</a>
                </div>
            </div>
        </div>
    );
};

export default StudyInfoComponent;