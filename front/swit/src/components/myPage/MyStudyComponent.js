import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getAllStudies } from '../../api/StudyApi';
import { getUserIdFromToken } from '../../util/jwtDecode';
import { isMember, isLeader } from "../../api/GroupApi";

const MyStudyComponent = () => {
    const [studies, setStudies] = useState([]) // 스터디 데이터를 저장할 상태
    const [userId, setUserId] = useState(null) // 로그인한 사용자의 ID를 저장할 상태
    const [studyTitle, setStudyTitle] = useState("") // 스터디 제목 필터
    const [studySubject, setStudySubject] = useState("") // 스터디 주제 필터
    const [studyAddr, setStudyAddr] = useState("") // 스터디 주소 필터

    useEffect(() => {
        const loggedInUserId = getUserIdFromToken() // 세션에서 사용자 ID를 가져옴
        console.log("Logged in user ID:", loggedInUserId)
        setUserId(loggedInUserId)

        if (loggedInUserId) {
            fetchUserStudies(loggedInUserId) // 사용자의 스터디 데이터를 가져오는 함수 호출
        }
    }, [])

    useEffect(() => {
        if (userId) {
            console.log("Fetching user studies for user ID:", userId)
            fetchUserStudies(userId)
        }
    }, [studyTitle, studySubject, studyAddr, userId])

    const fetchUserStudies = async (userId) => {
        const StudyPage = 1
        const StudySize = 100
        try {
            // 대면 스터디 리스트
            const offlineStudyListData = await getAllStudies(
                studyTitle,
                studySubject,
                studyAddr,
                false, // 대면
                userId,
                { StudyPage, StudySize }
            )

            // 비대면 스터디 리스트
            const onlineStudyListData = await getAllStudies(
                studyTitle,
                studySubject,
                studyAddr,
                true, // 비대면
                userId,
                { StudyPage, StudySize }
            )

            // 두 리스트 결합
            const combinedStudyListData = {
                dtoList: [...offlineStudyListData.dtoList, ...onlineStudyListData.dtoList]
            }

            console.log("Fetched study list:", combinedStudyListData)

            // 사용자가 신청한 스터디만 필터링
            const userStudiesData = await Promise.all(combinedStudyListData.dtoList.map(async (study) => {
                let memberStatus = await isMember(userId, study.studyNo)
                let leaderStatus = await isLeader(study.studyNo)

                if (leaderStatus) {
                    memberStatus = 'leader'; // 방장인 경우 상태를 leader로 설정
                }
                return {
                    ...study,
                    studyAddr: study.studyAddr,
                    isMemberStatus: memberStatus
                }
            }))

            console.log("User studies data:", userStudiesData)
            setStudies(userStudiesData) // 상태 업데이트
        } catch (error) {
            console.error("Failed to fetch user studies:", error)
        }
    }

    const getStatusInfo = (status) => {
        switch (status) {
            case 'leader':
                return { text: "방장", className: "bg-blue-400" }
            case 1:
                return { text: "참여중", className: "bg-green-500" }
            case 0:
                return { text: "승인대기", className: "bg-yellow-500" }
            case 2:
                return { text: "승인거절", className: "bg-red-500" }
            case 3:
                return { text: "추방", className: "bg-purple-500" }
            default:
                return { text: "", className: "" } // 미가입 상태는 제거
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
            <h2 className="text-lg font-bold mb-4">My 스터디 (신청현황)</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">스터디 제목</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청일자</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {studies.map(study => {
                        const statusInfo = getStatusInfo(study.isMemberStatus);
                        if (statusInfo.text === "") {
                            return null; // 미가입 상태는 표시하지 않음           
                        }
                        return (
                            <tr key={study.studyNo}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={study.isMemberStatus === 'leader' || study.isMemberStatus === 1 ? `/study/group/${study.studyNo}` : `/study/read/${study.studyNo}`} className="text-blue-600 hover:underline">
                                        {study.studyTitle} {/* 스터디 제목 */}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{study.studyType}</td> {/* 스터디 유형 */}
                                <td className="px-6 py-4 whitespace-nowrap">{study.studyAddr}</td> {/* 신청 일자 */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}>
                                        {statusInfo.text} {/* 신청 상태 */}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MyStudyComponent;