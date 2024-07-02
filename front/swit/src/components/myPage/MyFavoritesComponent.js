import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getFavoriteExams, getFavoriteJobs } from '../../api/ExamJobApi';
import { getUserIdFromToken } from '../../util/jwtDecode';

const MyFavoritesComponent = () => {
    const [favoriteExams, setFavoriteExams] = useState([]); // 즐겨찾기한 시험정보
    const [favoriteJobs, setFavoriteJobs] = useState([]); // 즐겨찾기한 채용정보
    const userId = getUserIdFromToken(); // 로그인한 사용자의 ID

    useEffect(() => {
        if (userId) {
            fetchFavorites()
        } else {
            console.log("유저 ID를 찾을 수 없습니다.")
        }
    }, [userId])

    // 즐겨찾기한 시험, 채용정보 조회
    const fetchFavorites = async () => {
        try {
            // 즐겨찾기한 시험 목록 가져오기
            const examRes = await getFavoriteExams(userId)
            const favoriteExams = examRes.dtoList || examRes || [] // 즐겨찾기한게 없으면 빈 목록[] 반환
            console.log("즐겨찾기한 시험 목록:", favoriteExams)

            // 즐겨찾기한 채용 목록 가져오기
            const jobRes = await getFavoriteJobs(userId);
            const favoriteJobs = jobRes.dtoList || jobRes || [] // 즐겨찾기한게 없으면 빈 목록[] 반환
            console.log("즐겨찾기한 채용 목록:", favoriteJobs)

            setFavoriteExams(favoriteExams)
            setFavoriteJobs(favoriteJobs)
        } catch (error) {
            console.error("마이페이지 즐겨찾기 항목 조회 실패: ", error)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
            <h2 className="text-lg font-bold mb-4">My 즐겨찾기(★)</h2>
            <div className="grid grid-cols-2 gap-4">
                {/* 즐겨찾기한 시험 목록 */}
                <div>
                    <table className="min-w-full divide-y divide-gray-200 text-center table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">시험</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {favoriteExams.length > 0 ? (
                                favoriteExams.map(exam => (
                                    <tr key={exam.examNo}>
                                        <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis" style={{ maxWidth: '150px' }}>
                                            <Link to={`/exam/read/${exam.examNo}`} className="text-blue-600 hover:underline">
                                                {exam.examTitle}
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-center" style={{ maxWidth: '150px' }}>No favorite exams found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 즐겨찾기한 채용 목록 */}
                <div>
                    <table className="min-w-full divide-y divide-gray-200 text-center table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">채용</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {favoriteJobs.length > 0 ? (
                                favoriteJobs.map(job => (
                                    <tr key={job.jobNo}>
                                        <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis" style={{ maxWidth: '150px' }}>
                                            <Link to={`/job/read/${job.jobNo}`} className="text-blue-600 hover:underline">
                                                {job.jobTitle}
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-center" style={{ maxWidth: '150px' }}>No favorite jobs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyFavoritesComponent;