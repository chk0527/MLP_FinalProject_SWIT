import React, { useState, useEffect } from "react"
import { FaStar, FaRegStar } from 'react-icons/fa';
import { getUserIdFromToken } from "../../util/jwtDecode"; //userId 받아옴
import { useNavigate } from 'react-router-dom';
import { getJobRead, isJobFavorite, addJobFavorite, removeJobFavorite } from '../../api/ExamJobApi';
import LoginRequireModal from "../common/LoginRequireModal";

const initState = {
    jobNo: 0,
    jobTitle: "",
    jobCompany: "",
    jobField: "",
    jobLoc: "",
    jobDeadline: null,
    jobActive: 1,
    jobExperience: "",
    jobType: "",
    jobUrl: "",
}

const JobReadComponent = ({ jobNo }) => {
    const [job, setJob] = useState(initState)
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        getJobRead(jobNo).then(data => {
            console.log(data)
            setJob(data)
        });

        const userId = getUserIdFromToken();
        if (userId) {
            isJobFavorite(userId, jobNo)
                .then(data => setIsFavorite(data))
                .catch(error => console.error(error));
        }
    }, [jobNo])

    const handleFavorite = () => {

        // 로그인안한상태 -> alert 확인누르면 로그인창으로이동
        const userId = getUserIdFromToken();
        if (!userId) {
            setShowLoginModal(true);
            return;
        }

        //로그인상태
        const request = isFavorite ? removeJobFavorite : addJobFavorite; //즐겨찾기 되어있는지 안되어있는지 구분
        request(userId, jobNo)
            .then(() => {
                setIsFavorite(!isFavorite);
                alert(isFavorite ? '즐겨찾기에서 삭제되었습니다.' : '즐겨찾기에 추가되었습니다.');
            })
            .catch(error => console.error(error));
    };


    return (
        <div className="flex justify-center font-GSans">
            {showLoginModal && (
                <LoginRequireModal callbackFn={() => setShowLoginModal(false)} />
            )}
            <div className="py-6 rounded-lg w-full ">
                <div className="flex justify-center border-soild border-gray-700 border-b-2">
                    <h1 className="text-3xl font-bold mb-4">{job.jobTitle}</h1>
                    <button onClick={handleFavorite} className="m-0 ml-3 p-0 -mt-7">
                        {isFavorite ? <FaStar size={35} color="#FFF06B" /> : <FaRegStar size={35} color="#FFF06B" />}
                    </button>
                </div>

                <div className="flex-wrap w-full max-w-1300 font-GSans bg-white border border-white rounded-lg mt-20">
                    <h2 className="text-lg mb-2 font-semibold ml-4">{job.jobCompany}</h2>

                    <div className="flex justify-between mt-4">
                        {/* <h3 className="text-lg font-semibold mb-2">{job.jobTitle}</h3> */}
                        <p className="mb-1 ml-4">접수 마감일: {job.jobDeadline}</p>
                        {/* <p className="mb-3">{job.jobField}</p> */}
                        <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mr-4">입사지원 바로가기</a>
                    </div>
                    <table className="flex-wrap w-full font-GSans text-center border-collapse border border-gray-100 rounded-lg mt-6">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-200 p-5">경력조건</th>
                                <th className="border border-gray-200 p-2">고용형태</th>
                                <th className="border border-gray-200 p-2">모집직종</th>
                                <th className="border border-gray-200 p-2">근무예정지</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-200 p-2 py-10 ">{job.jobExperience}</td>
                                <td className="border border-gray-200 p-2">{job.jobType}</td>
                                <td className="border border-gray-200 p-2">{job.jobField}</td>
                                <td className="border border-gray-200 p-2">{job.jobLoc}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="rounded p-3 m-40 text-xl w-28 text-white bg-gray-500"
                        onClick={() => window.history.back()}
                    >
                        목록
                    </button>
                </div>
            </div>
        </div>

    )
}

export default JobReadComponent;

