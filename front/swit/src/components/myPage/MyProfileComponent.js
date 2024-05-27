import { useState, useEffect } from 'react';
import { API_SERVER_HOST, getUserProfile } from '../../api/UserApi';

const initState = {
    user_id: '',
    user_name: '',
    user_nick: '',
    user_phone: '',
    user_email: '',
    user_password: '',
    user_image: ''
}

const host = API_SERVER_HOST

const MyProfileComponent = ({ user_id }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [profileImage, setProfileImage] = useState(null)
    const [updateProfileImage, setUpdateProfileImage] = useState(null)
    const [user, setUser] = useState(initState)
    useEffect(() => {
        getUserProfile(user_id).then(data => {
            console.log(data)
            setUser(data)
        })
    }, [user_id])

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
            {/* 프로필 정보 디자인 */}
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
                            <span className="font-bold text-black">{user.user_name}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-500">닉네임: </span>
                            <span className="font-bold text-black">{user.user_nick}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-500">전화번호: </span>
                            <span className="font-bold text-black">{user.user_phone}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-500">이메일: </span>
                            <span className="font-bold text-black">{user.user_email}</span>
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

            {/* 모달창 디자인 */}
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
                            <input type="text" defaultValue={user.user_name} className="w-full border border-gray-300 p-2 rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">닉네임:</label>
                            <input type="text" defaultValue={user.user_nick} className="w-full border border-gray-300 p-2 rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">전화번호:</label>
                            <input type="text" defaultValue={user.user_phone} className="w-full border border-gray-300 p-2 rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">이메일:</label>
                            <input type="text" defaultValue={user.user_email} className="w-full border border-gray-300 p-2 rounded" />
                        </div>
                        <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={handleProfileUpdate}>수정하기</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyProfileComponent;
