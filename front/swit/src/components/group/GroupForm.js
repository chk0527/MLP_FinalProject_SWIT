import React, { useState, useEffect } from 'react';
import { addGroup, isMember } from '../../api/GroupApi';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getUserIdFromToken } from '../../util/jwtDecode';
import CommonModal from '../common/CommonModal';

const GroupForm = ({ studyNo, closeModal }) => {
    const [questions, setQuestions] = useState({});
    const [answers, setAnswers] = useState({ a1: '', a2: '', a3: '', a4: '', a5: '', selfintro: '' });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`/api/questions`, {
                    params: { studyNo }
                });
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [studyNo]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = getUserIdFromToken();
        let memberStatus = userId ? -1 : -2; // -1: 가입신청을 하지 않은경우, -2: 비회원(로그인 안 한 상태)
        if (userId) {
            memberStatus = await isMember(userId, studyNo);
        }

        switch (memberStatus) {
            case 0:
                alert('승인 대기 중입니다.');
                closeModal()
                return;
            case 1:
                alert('이미 가입된 상태입니다.');
                closeModal()
                return;
            case 2:
                alert('가입이 거절되었습니다.');
                closeModal()
                return;
            case 3:
                alert('추방된 스터디 그룹입니다.');
                closeModal()
                return;
            default:
                break;
        }

        const groupData = {
            studyNo: parseInt(studyNo)
        };

        const answerData = {
            studyNo: parseInt(studyNo),
            ...answers
        };

        try {
            const response = await addGroup(groupData, answerData);
            console.log('Group added successfully:', response);
            setShowModal(true);

        } catch (error) {
            console.error('Error adding group:', error);
            alert('Error adding group');
        }
    };

    const handleAnswerChange = (e) => {
        const { name, value } = e.target;
        setAnswers(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="mt-4">
                <p className='text-center text-xl font-bold bg-yellow-200 mb-8'>질문 목록</p>
                {questions.q1 && (
                    <div className="mt-2">
                        <label className='font-bold'>{questions.q1}</label>
                        <textarea
                            type="text"
                            name="a1"
                            value={answers.a1}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full mb-8"
                        />
                    </div>
                )}
                {questions.q2 && (
                    <div className="mt-2">
                        <label className='font-bold'>{questions.q2}</label>
                        <textarea
                            type="text"
                            name="a2"
                            value={answers.a2}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full mb-8"
                        />
                    </div>
                )}
                {questions.q3 && (
                    <div className="mt-2">
                        <label className='font-bold'>{questions.q3}</label>
                        <textarea
                            type="text"
                            name="a3"
                            value={answers.a3}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full mb-8"
                        />
                    </div>
                )}
                {questions.q4 && (
                    <div className="mt-2">
                        <label className='font-bold'>{questions.q4}</label>
                        <textarea
                            type="text"
                            name="a4"
                            value={answers.a4}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full mb-8"
                        />
                    </div>
                )}
                {questions.q5 && (
                    <div className="mt-2">
                        <label className='font-bold'>{questions.q5}</label>
                        <textarea
                            type="text"
                            name="a5"
                            value={answers.a5}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full mb-8"
                        />
                    </div>
                )}
            </div>
            <div className="mt-2">
                <p className='font-bold'>하고 싶은 말</p>
                <textarea
                    name="selfintro"
                    value={answers.selfintro}
                    onChange={handleAnswerChange}
                    required
                    className="border border-gray-300 rounded p-2 w-full mb-8"
                ></textarea>
            </div>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4">
                제출
            </button>
            <button onClick={closeModal} className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded mt-4 ml-10">
                닫기
            </button>


            {showModal && (
                <CommonModal
                    modalMessage="신청이 완료되었습니다."
                    callbackFn={closeModal}
                    closeMessage="확인"
                />
            )}

        </form>
    );
};

export default GroupForm;
