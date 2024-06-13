import React, { useState, useEffect } from 'react';
import { addGroup } from '../../api/GroupApi';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GroupForm = ({ studyNo, closeModal }) => {
    const [questions, setQuestions] = useState({});
    const [answers, setAnswers] = useState({ a1: '', a2: '', a3: '', a4: '', a5: '', selfintro: '' });

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
            alert('Group added successfully');
            closeModal(); // Close modal after successful submission
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
                <p>질문 목록:</p>
                {questions.q1 && (
                    <div className="mt-2">
                        <label>{questions.q1}</label>
                        <input
                            type="text"
                            name="a1"
                            value={answers.a1}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                )}
                {questions.q2 && (
                    <div className="mt-2">
                        <label>{questions.q2}</label>
                        <input
                            type="text"
                            name="a2"
                            value={answers.a2}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                )}
                {questions.q3 && (
                    <div className="mt-2">
                        <label>{questions.q3}</label>
                        <input
                            type="text"
                            name="a3"
                            value={answers.a3}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                )}
                {questions.q4 && (
                    <div className="mt-2">
                        <label>{questions.q4}</label>
                        <input
                            type="text"
                            name="a4"
                            value={answers.a4}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                )}
                {questions.q5 && (
                    <div className="mt-2">
                        <label>{questions.q5}</label>
                        <input
                            type="text"
                            name="a5"
                            value={answers.a5}
                            onChange={handleAnswerChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                )}
            </div>
            <div className="mt-2">
                <p>하고 싶은 말:</p>
                <textarea
                    name="selfintro"
                    value={answers.selfintro}
                    onChange={handleAnswerChange}
                    required
                    className="border border-gray-300 rounded p-2 w-full"
                ></textarea>
            </div>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4">
                제출
            </button>
        </form>
    );
};

export default GroupForm;
