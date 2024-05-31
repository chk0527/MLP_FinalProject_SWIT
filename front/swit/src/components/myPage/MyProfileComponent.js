import { useState, useEffect } from 'react';
import { API_SERVER_HOST, getUserProfile, putUserProfile, postUserImage, getUserImage } from '../../api/UserApi';

const initState = {
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
    const [user, setUser] = useState(initState)             //최종 반영된 마이페이지 프로필
    const [modalUser, setModalUser] = useState(initState)   //모달창에서만 보이는 임시 프로필 정보
    const [userImage, setUserImage] = useState(null)        //이미지 관리
    //console.info("ccccccc")

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const data = await getUserProfile(user_id);
                setUser(data);
                setModalUser({ ...data });
                const imageUrl = await getUserImage(user_id);
                setUserImage(imageUrl);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserProfile();
    }, [user_id])
    //console.info("ddddddd")

    const openModal = () => {
        setModalUser({ ...user }); // 모달창을 열 때 현재 프로필 데이터 복사
        setIsModalOpen(true);
    }

    //수정하기 버튼으로 모달창 닫을 때 이벤트
    const closeModal = () => {
        setIsModalOpen(false);
    }

    //x 버튼으로 모달창 닫을 때 이벤트
    const closeModalOptionX = () => {
        setIsModalOpen(false);
        //setUserImage(null); // 모달이 닫힐 때 새 이미지 state 초기화
    }

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setModalUser((prev) => ({ ...prev, [name]: value }));
    }

    const handleImageUpload = async (e) => {
        const img = e.target.files[0];
        if (img) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result); // 이미지 미리보기 설정
            };
            reader.readAsDataURL(img);

            // 이미지 업로드 처리
            const formData = new FormData();
            formData.append("user_image", img);
            try {
                await postUserImage(user_id, formData);
                // 프로필 이미지 정보 갱신(url로 관리)
                const imageUrl = await getUserImage(user_id);
                setUserImage(imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    }

    const handleClickModify = async () => {
        try {
            // 텍스트 수정 처리
            await putUserProfile(modalUser);

            // 프로필 텍스트 정보 갱신
            const updatedProfile = await getUserProfile(user_id);
            setUser(updatedProfile);

            closeModal();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    }

    return (
        <>
            {/* 프로필 정보 디자인 */}
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
                <div className="flex items-center">
                    <div className="w-32 h-32 rounded-lg mr-6 bg-gray-500 border border-gray-800 flex items-center justify-center">
                        <img
                            src={userImage ? userImage : "/default_profile_image.png"}
                            alt="Profile"
                            className="w-32 h-32 rounded-lg object-cover"
                        />
                    </div>
                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
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
                        <span className="absolute top-2 right-2 text-2xl cursor-pointer" onClick={closeModalOptionX}>&times;</span>
                        <label htmlFor="fileInput" className="block mb-4 cursor-pointer">
                            <div className="w-32 h-32 rounded-lg bg-gray-500 border border-gray-800 flex items-center justify-center">
                                <img
                                    src={userImage ? userImage : "/default_profile_image.png"}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-lg object-cover"
                                />
                            </div>
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                        <div className="mb-4">
                            <label className="block mb-1">이름:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="user_name" type="text" value={modalUser.user_name} onChange={handleTextChange} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">닉네임:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="user_nick" type="text" value={modalUser.user_nick} onChange={handleTextChange} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">전화번호:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="user_phone" type="text" value={modalUser.user_phone} onChange={handleTextChange} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">이메일:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="user_email" type="text" value={modalUser.user_email} onChange={handleTextChange} />
                        </div>
                        <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={handleClickModify}>수정하기</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyProfileComponent;
