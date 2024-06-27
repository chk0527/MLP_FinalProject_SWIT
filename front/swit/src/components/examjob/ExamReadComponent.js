import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { getExamRead, isExamFavorite, addExamFavorite, removeExamFavorite } from '../../api/ExamJobApi';
import { getUserIdFromToken } from "../../util/jwtDecode"; //userId 받아옴
import { useNavigate } from 'react-router-dom';

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
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login');
            }
            return;
        }

        //로그인상태
        const request = isFavorite ? removeExamFavorite : addExamFavorite; //즐겨찾기 되어있는지 안되어있는지 구분
        request(userId, examNo)
            .then(() => {
                setIsFavorite(!isFavorite);
                alert(isFavorite ? '즐겨찾기에서 삭제되었습니다.' : '즐겨찾기에 추가되었습니다.');
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="flex justify-center font-GSans">
            <div className="p-6 rounded-lg w-full max-w-6xl">
                <div className="flex justify-center border-gray-400 border-b-4">
                    <h1 className="text-3xl font-bold mb-5">{exam.examTitle}</h1>
                    <button onClick={handleFavorite} className="m-0 ml-3 p-0 mb-6">
                        {isFavorite ? <FaStar size={35} color="#FFF06B" /> : <FaRegStar size={35} color="#FFF06B" />}
                    </button>
                </div>
                <table className="flex-wrap w-1000 font-GSans border-collapse border border-gray-300 mt-6">
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
                        className="rounded p-3 m-2 text-xl w-28 text-white bg-gray-500"
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



