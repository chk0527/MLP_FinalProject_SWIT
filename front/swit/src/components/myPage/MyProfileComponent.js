import { useState, useEffect } from 'react';
import { API_SERVER_HOST, getUserProfile, putUserProfile, postUserImage, getUserImage } from '../../api/UserApi';
import { FaPen } from 'react-icons/fa';

const initState = {
    userName: '',
    userNick: '',
    userPhone: '',
    userEmail: '',
    userPassword: '',
    userImage: ''
}

const host = API_SERVER_HOST

const MyProfileComponent = ({ userId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [user, setUser] = useState(initState)             // 최종 반영된 마이페이지 프로필
    const [modalUser, setModalUser] = useState(initState)   // 모달창에서만 보이는 임시 프로필 정보
    const [userImage, setUserImage] = useState(null)        // 이미지 관리
    const [isSocialLogin, setIsSocialLogin] = useState(false); // 소셜 로그인 여부 확인

    // 최초로 페이지 로드될 때 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // const data = await info();
                const userData = await getUserProfile(userId);
                setUser(userData);
                setModalUser({ ...userData });
                const imageUrl = await getUserImage(userId);
                setUserImage(imageUrl);

                console.log(userId + '님의 상태는 ' + userData.userSnsConnect);

                // 소셜 로그인 여부 확인
                if (userData && (userData.userSnsConnect === 'NAVER' || userData.userSnsConnect === 'KAKAO')) {
                    console.log(userId + '님은 소셜 로그인 유저입니다.');
                    setIsSocialLogin(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserInfo();
    }, [userId]);

    const openModal = () => {
        if (isSocialLogin) {
            console.log(userId + '님은 프로필 수정을 할 수 없습니다.');
            alert('소셜 로그인 계정은 프로필 수정을 할 수 없습니다.');
            return;
        }
        setModalUser({ ...user }); // 모달창을 열 때 현재 프로필 데이터 복사
        setIsModalOpen(true);
    };

    // 수정하기 버튼으로 모달창 닫을 때 이벤트
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // x 버튼으로 모달창 닫을 때 이벤트
    const closeModalOptionX = () => {
        setIsModalOpen(false);
        // setUserImage(null); // 모달이 닫힐 때 새 이미지 state 초기화
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setModalUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        if (isSocialLogin) {
            alert('소셜 로그인 계정은 프로필 수정을 할 수 없습니다.');
            return;
        }
        const img = e.target.files[0];
        if (img) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result); // 이미지 미리보기 설정
            };
            reader.readAsDataURL(img);

            // 이미지 업로드 처리
            const formData = new FormData();
            formData.append("userImage", img);
            try {
                await postUserImage(userId, formData);
                // 프로필 이미지 정보 갱신(url로 관리)
                const imageUrl = await getUserImage(userId);
                setUserImage(imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleClickModify = async () => {
        if (isSocialLogin) {
            alert('소셜 로그인 계정은 프로필 수정을 할 수 없습니다.');
            return;
        }
        try {
            // 텍스트 수정 처리
            await putUserProfile(modalUser);

            // 프로필 텍스트 정보 갱신
            const updatedProfile = await getUserProfile(userId);
            setUser(updatedProfile);

            closeModal();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <>
            {/* 프로필 정보 디자인 */}
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8">
                <div className="flex items-center">
                    <label htmlFor="fileInput" className="block mb-4 cursor-pointer">
                        <div className="w-36 h-36 rounded-lg bg-gray-500 border border-gray-800 flex items-center justify-center relative overflow-hidden">
                            <img
                                src={userImage ? userImage : `${process.env.PUBLIC_URL}/user0_blank.png`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-2">
                                <FaPen className="text-white" size={16} />
                            </div>
                        </div>
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </label>
                    <div className="flex-grow ml-5">
                        <div className="mb-2">
                            <span className="text-gray-700">이름: </span>
                            <span className="font-bold text-black">{user.userName}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-700">닉네임: </span>
                            <span className="font-bold text-black">{user.userNick}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-700">전화번호: </span>
                            <span className="font-bold text-black">{user.userPhone}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-700">이메일: </span>
                            <span className="font-bold text-black">{user.userEmail}</span>
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
                        <div className="mb-4">
                            <label className="block mb-1">이름:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="userName" type="text" value={modalUser.userName} onChange={handleTextChange} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">닉네임:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="userNick" type="text" value={modalUser.userNick} onChange={handleTextChange} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">전화번호:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="userPhone" type="text" value={modalUser.userPhone} onChange={handleTextChange} />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">이메일:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="userEmail" type="text" value={modalUser.userEmail} onChange={handleTextChange} />
                        </div>
                        <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={handleClickModify}>수정하기</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyProfileComponent;