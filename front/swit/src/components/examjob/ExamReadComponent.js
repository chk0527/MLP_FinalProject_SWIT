import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { getExamRead, isExamFavorite, addExamFavorite, removeExamFavorite } from '../../api/ExamJobApi';
import { getUserIdFromToken } from "../../util/jwtDecode"; //userId 받아옴
import { useNavigate } from 'react-router-dom';
import LoginRequireModal from '../common/LoginRequireModal';
import CommonModal from '../common/CommonModal';

const initState = {
    examNo: 0,
    examTitle: "",
    examDesc: "",
    examDocStart: null,
    examDocEnd: null,
    examDocRegStart: null,
    examDocRegEnd: null,
    examPracStart: null,
    examPracEnd: null,
    examPracRegStart: null,
    examPracRegEnd: null,
    examDocPass: null,
    examPracPass: null,
};

const ExamReadComponent = ({ examNo }) => {
    const [exam, setExam] = useState(initState);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        getExamRead(examNo).then(data => {
            console.log(data);
            setExam(data);
        });

        const userId = getUserIdFromToken();
        if (userId) {
            isExamFavorite(userId, examNo)
                .then(data => setIsFavorite(data))
                .catch(error => console.error(error));
        }
    }, [examNo]);

    const handleFavorite = () => {

        // 로그인안한상태 -> alert 확인누르면 로그인창으로이동
        const userId = getUserIdFromToken();
        if (!userId) {
            setShowLoginModal(true);
            return;
        }

        //로그인상태
        const request = isFavorite ? removeExamFavorite : addExamFavorite; //즐겨찾기 되어있는지 안되어있는지 구분
        request(userId, examNo)
            .then(() => {
                setIsFavorite(!isFavorite);
                setModalMessage(isFavorite ? '즐겨찾기에서 삭제했습니다.' : '즐겨찾기에 추가했습니다.');
                setShowModal(true); //
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="flex justify-center font-GSans">
            {showLoginModal && (
                <LoginRequireModal callbackFn={() => setShowLoginModal(false)} />
            )}

            {showModal && (
                <CommonModal
                    modalMessage={modalMessage}
                    callbackFn={() => setShowModal(false)}
                    closeMessage="확인"
                />
            )}

            <div className="py-6 rounded w-full max-w-6xl">
                <div className="flex justify-center border-gray-700 border-b-2">
                    <h1 className="text-3xl font-bold mb-4">{exam.examTitle}</h1>
                    <button onClick={handleFavorite} className="m-0 ml-3 p-0 -mt-7">
                        {isFavorite ? <FaStar size={35} color="#FFF06B" /> : <FaRegStar size={35} color="#FFF06B" />}
                    </button>
                </div>
                <table className="flex-wrap w-full max-w-1300 font-GSans border-collapse border border-gray-300 mt-20">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-5">필기접수기간</th>
                            <th className="border border-gray-300 p-2">필기시험</th>
                            <th className="border border-gray-300 p-2">필기 합격발표</th>
                            <th className="border border-gray-300 p-2">실기접수기간</th>
                            <th className="border border-gray-300 p-2">실기시험</th>
                            <th className="border border-gray-300 p-2">실기 합격발표</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        <tr>
                            <td className="border border-gray-300 p-2 py-10">{exam.examDocRegStart}<br />~<br />{exam.examDocRegEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examDocEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examDocPass}</td>
                            <td className="border border-gray-300 p-2">{exam.examPracRegStart}<br />~<br />{exam.examPracRegEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examPracStart}<br />~<br />{exam.examPracEnd}</td>
                            <td className="border border-gray-300 p-2">{exam.examPracEnd}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="rounded p-3 my-40 text-xl w-28 text-white bg-yellow-500 hover:bg-yellow-600 shadow-md"
                        onClick={() => window.history.back()}
                    >
                        목록
                    </button>
                </div>
            </div>


        </div>
    );
};

export default ExamReadComponent;



