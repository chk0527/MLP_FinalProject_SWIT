import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BasicLayout from '../../layouts/BasicLayout';
import { getAllStudies } from '../../api/StudyApi'; // getAllStudies 함수를 가져옴

const StudyListPage = () => {
    const [studyList, setStudyList] = useState([]); // 스터디 목록을 저장할 상태
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudyList = async () => {
            try {
                // 모든 스터디 목록을 가져오는 API 호출
                const studyListData = await getAllStudies();
                setStudyList(studyListData);
            } catch (error) {
                console.error('Error fetching study list:', error);
            }
        };

        fetchStudyList(); // 함수 실행
    }, []); // 빈 배열을 두번째 인자로 넘겨 한 번만 실행되도록 설정

    const handleReadStudy = (studyNo) => {
        navigate(`/study/read/${studyNo}`);
    };

    const handleAddStudy = () => {
        navigate(`/study/add`);
    };

    return (
        <BasicLayout>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
                <h1 className="col-span-full text-2xl font-bold mb-4">Study List</h1>
                {/* 스터디 목록을 카드 형식으로 출력 */}
                {studyList.map(study => (
                    <div key={study.studyNo} className="border border-gray-300 rounded p-2 grid place-items-center" style={{height: '200px' }}>
                        <h2 className="text-xl font-bold mb-2">{study.studyTitle}</h2>
                        <p className="mb-2">{study.studyContent}</p>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => handleReadStudy(study.studyNo)}>{`${study.studyNo}번 스터디 보기`}</button>
                    </div>
                ))}
            </div>
            <div className='grid place-items-end'>
            <button
                onClick={() => handleAddStudy()}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4"
            >
                Go to StudyAddPage
            </button>
            </div>
        </BasicLayout>
    );
};

export default StudyListPage;
