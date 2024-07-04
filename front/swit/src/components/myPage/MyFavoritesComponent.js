import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getFavoriteExams, getFavoriteJobs } from '../../api/ExamJobApi';
import { getFavoritePlaces } from '../../api/PlaceApi';
import { getUserIdFromToken } from '../../util/jwtDecode';

const MyFavoritesComponent = () => {
    const [favoriteExams, setFavoriteExams] = useState([]); // 즐겨찾기한 시험정보
    const [favoriteJobs, setFavoriteJobs] = useState([]); // 즐겨찾기한 채용정보
    const [favoritePlaces, setFavoritePlaces] = useState([]); // 즐겨찾기한 장소정보
    const userId = getUserIdFromToken(); // 로그인한 사용자의 ID
    const [view, setView] = useState('exams'); // 현재 보여주는 뷰

    useEffect(() => {
        if (view === 'exams' && userId) {
            fetchExamFavorites()
        } else if (view === 'jobs' && userId) {
            fetchJobFavorites()
        } else if (view === 'places' && userId) {
            fetchPlaceFavorites()
        }
    }, [userId, view])

    // 즐겨찾기한 시험 정보 조회
    const fetchExamFavorites = async () => {
        try {
            // 즐겨찾기한 시험 목록 가져오기
            const examRes = await getFavoriteExams(userId)
            const favoriteExams = examRes.dtoList || examRes || [] // 즐겨찾기한게 없으면 빈 목록[] 반환
            console.log("즐겨찾기한 시험 목록:", favoriteExams)

            setFavoriteExams(favoriteExams)
        } catch (error) {
            console.error("즐겨찾기 시험 조회 실패: ", error)
        }
    }

    // 즐겨찾기한 채용 정보 조회
    const fetchJobFavorites = async () => {
        try {
            // 즐겨찾기한 채용 목록 가져오기
            const jobRes = await getFavoriteJobs(userId);
            const favoriteJobs = jobRes.dtoList || jobRes || [] // 즐겨찾기한게 없으면 빈 목록[] 반환
            console.log("즐겨찾기한 채용 목록:", favoriteJobs)

            setFavoriteJobs(favoriteJobs)
        } catch (error) {
            console.error("즐겨찾기 채용 조회 실패: ", error)
        }
    }

    // 즐겨찾기한 시험,채용,장소 정보 조회
    const fetchPlaceFavorites = async () => {
        try {
            // 즐겨찾기한 장소 목록 가져오기
            const placeRes = await getFavoritePlaces(userId);
            const favoritePlaces = placeRes.dtoList || placeRes || [] // 즐겨찾기한게 없으면 빈 목록[] 반환
            console.log("즐겨찾기한 장소 목록:", favoritePlaces)

            setFavoritePlaces(favoritePlaces)
        } catch (error) {
            console.error("마이페이지 즐겨찾기 항목 조회 실패: ", error)
        }
    }

    const commonTdStyle = { maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
    const commonTdClass = "px-6 py-4";

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full mb-8">
            <h2 className="text-lg font-bold mb-4">My 즐겨찾기(★)</h2>
            <div className="flex justify-center my-3 w-full">
                <span
                    onClick={() => setView("exams")}
                    className={`mx-2 px-4 cursor-pointer ${view === "exams" ? "font-bold text-red-500" : "text-gray-500"
                        }`}
                >
                    시험
                </span>
                <span className="mx-5">|</span>
                <span
                    onClick={() => setView("jobs")}
                    className={`mx-2 px-4 cursor-pointer ${view === "jobs" ? "font-bold text-red-500" : "text-gray-500"
                        }`}
                >
                    채용
                </span>
                <span className="mx-5">|</span>
                <span
                    onClick={() => setView("places")}
                    className={`mx-2 px-4 cursor-pointer ${view === "places" ? "font-bold text-red-500" : "text-gray-500"
                        }`}
                >
                    장소
                </span>
            </div>

            {/* 즐겨찾기한 시험 목록 */}
            {view === 'exams' && (
                <div>
                    <table className="min-w-full divide-y divide-gray-200 text-center table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">시험</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">필기접수기간</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">실기접수기간</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {favoriteExams.length > 0 ? (
                                favoriteExams.map(exam => (
                                    <tr key={exam.examNo}>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                            <Link to={`/exam/read/${exam.examNo}`} className="text-blue-600 hover:underline">
                                                {exam.examTitle}
                                            </Link>
                                        </td>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                        {exam.examDocRegStart} ~ {exam.examDocRegEnd}
                                        </td>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                        {exam.examPracRegStart} ~ {exam.examPracRegEnd}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className={commonTdClass} style={commonTdStyle} colSpan="3">즐겨찾기한 시험이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 즐겨찾기한 채용 목록 */}
            {view === 'jobs' && (
                <div>
                    <table className="min-w-full divide-y divide-gray-200 text-center table-fixed overflow-hidden overflow-ellipsis">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">채용</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">모집직종</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">근무예정지</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">접수마감일</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {favoriteJobs.length > 0 ? (
                                favoriteJobs.map(job => (
                                    <tr key={job.jobNo}>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                            <Link to={`/job/read/${job.jobNo}`} className="text-blue-600 hover:underline">
                                                {job.jobTitle}
                                            </Link>
                                        </td>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                            {job.jobType}
                                        </td>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                            {job.jobLoc}
                                        </td>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                            {job.jobDeadline}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className={commonTdClass} style={commonTdStyle} colSpan="4">즐겨찾기한 채용이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 즐겨찾기한 장소 목록 */}
            {view === 'places' && (
                <div>
                    <table className="min-w-full divide-y divide-gray-200 text-center table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">스터디 장소</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">위치</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider">운영시간</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {favoritePlaces.length > 0 ? (
                                favoritePlaces.map(place => (
                                    <tr key={place.placeNo}>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                            <Link to={`/place/read/${place.placeNo}`} className="text-blue-600 hover:underline">
                                                {place.placeName}
                                            </Link>
                                        </td>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                            {place.placeAddr}
                                        </td>
                                        <td className={commonTdClass} style={commonTdStyle}>
                                            {place.placeTime}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className={commonTdClass} style={commonTdStyle} colSpan="1">즐겨찾기한 장소가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div >
    );
};

export default MyFavoritesComponent;