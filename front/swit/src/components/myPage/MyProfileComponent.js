import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

const MyProfileComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [updateProfileImage, setUpdateProfileImage] = useState(null);

    useEffect(() => {
        // 로컬 스토리지에서 프로필 이미지를 가져옴
        const storedProfileImage = localStorage.getItem('profileImage');
        if (storedProfileImage) {
            setProfileImage(storedProfileImage);
        }
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUpdateProfileImage(null); // 모달이 닫힐 때 임시 프로필 사진 초기화
    };

    const handleImageUpload = (event) => {
        const img = event.target.files[0];
        if (img) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdateProfileImage(reader.result);
            };
            reader.readAsDataURL(img);
        }
    };

    const handleProfileUpdate = () => {
        if (updateProfileImage) {
            // 수정하기 버튼을 누를 때 프로필 사진을 업데이트하고 로컬 스토리지에 저장
            setProfileImage(updateProfileImage);
            localStorage.setItem('profileImage', updateProfileImage); // 새로운 프로필 이미지를 로컬 스토리지에 저장
            closeModal(); // 수정하기 버튼을 누르면 모달 닫기
        }

    };

    return (
        <>
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
                <div className="flex items-center">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-lg mr-6"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-lg mr-6 bg-gray-500"></div>
                    )}
                    <div className="flex-grow">
                        <div className="mb-2">
                            <span className="text-gray-500">이름: </span>
                            <span className="font-bold text-black">김기환</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-500">닉네임: </span>
                            <span className="font-bold text-black">고리스</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-500">전화번호: </span>
                            <span className="font-bold text-black">010-0000-0000</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-500">이메일: </span>
                            <span className="font-bold text-black">dankkh418@naver.com</span>
                        </div>
                    </div>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={openModal}
                    >
                        개인정보수정
                    </button>
                </div>
            </div>

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
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">리액트 같이 공부하실 분 모집해요~!</td>
                            <td className="px-6 py-4 whitespace-nowrap">대면</td>
                            <td className="px-6 py-4 whitespace-nowrap">2024-05-16</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    승인 대기중
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">(전공자 환영)이스트부룩 같이할 파티원 구...</td>
                            <td className="px-6 py-4 whitespace-nowrap">비대면</td>
                            <td className="px-6 py-4 whitespace-nowrap">2024-05-15</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    승인 완료
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
                <h2 className="text-lg font-bold mb-4">My 즐겨찾기(★)</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">나의 장소</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">나의 시험 및 채용정보</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">작심스터디카페 대치점 부근</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-between">
                                    <span>2024년 정기 기사 3회</span>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded">위치 보기</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">브리즈스터디카페 신흥동점</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-between">
                                    <span>엘리베터 정규직 개발자 채용</span>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded">위치 보기</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
                <h2 className="text-lg font-bold mb-4">My 작성한 글</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">글 제목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글 수</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">리액트 같이 공부하실 분 모집해요~!</td>
                            <td className="px-6 py-4 whitespace-nowrap">2024-05-16</td>
                            <td className="px-6 py-4 whitespace-nowrap">12</td>
                            <td className="px-6 py-4 whitespace-nowrap">1</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">(전공자 환영)이스트부룩 같이할 파티원 구...</td>
                            <td className="px-6 py-4 whitespace-nowrap">2024-05-15</td>
                            <td className="px-6 py-4 whitespace-nowrap">5</td>
                            <td className="px-6 py-4 whitespace-nowrap">2</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                        <span className="absolute top-2 right-2 text-2xl cursor-pointer" onClick={closeModal}>&times;</span>
                        <label htmlFor="fileInput" className="block mb-4 cursor-pointer">
                            <img
                                src={updateProfileImage ? updateProfileImage : (profileImage ? profileImage : "기본 프로필 이미지 URL")}
                                alt="Profile"
                                className="w-32 h-32 rounded-lg mr-6"
                            />
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                        <div className="mb-4">
                            <label className="block mb-1">이름:</label>
                            <input type="text" defaultValue="김기환" className="w-full border border-gray-300 p-2 rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">닉네임:</label>
                            <input type="text" defaultValue="고리스" className="w-full border border-gray-300 p-2 rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">전화번호:</label>
                            <input type="text" defaultValue="010-0000-0000" className="w-full border border-gray-300 p-2 rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">이메일:</label>
                            <input type="text" defaultValue="dankkh418@naver.com" className="w-full border border-gray-300 p-2 rounded" />
                        </div>
                        <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={handleProfileUpdate}>수정하기</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyProfileComponent;