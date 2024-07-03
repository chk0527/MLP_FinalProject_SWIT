import { useState, useEffect, useContext, useCallback } from 'react';
import { API_SERVER_HOST, getUserProfile, putUserProfile, postUserImage, getUserImage, checkDuplicate } from '../../api/UserApi';
import { FaPen } from 'react-icons/fa';
import { LoginContext } from '../../contexts/LoginContextProvider';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';

const initState = {
    userName: '',
    userNick: '',
    userPhone: '',
    userEmail: '',
    userPassword: '',
    userImage: ''
};

const MyProfileComponent = ({ userId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(initState);
    const [modalUser, setModalUser] = useState(initState);
    const [userImage, setUserImage] = useState(null);
    const [isSocialLogin, setIsSocialLogin] = useState(false);
    const [errors, setErrors] = useState({});

    const { refreshAccessToken } = useContext(LoginContext);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await getUserProfile(userId);
                setUser(userData);
                setModalUser({ ...userData });
                const imageUrl = await getUserImage(userId);
                setUserImage(imageUrl);

                if (userData && (userData.userSnsConnect === 'NAVER' || userData.userSnsConnect === 'KAKAO')) {
                    setIsSocialLogin(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserInfo();
    }, [userId]);

    const openModal = async () => {
        if (isSocialLogin) {
            alert('소셜 로그인 계정은 프로필 수정을 할 수 없습니다.');
            return;
        }
        setModalUser({ ...user });
        setIsModalOpen(true);
        await validate(modalUser);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeModalOptionX = () => {
        setIsModalOpen(false);
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setModalUser((prev) => ({ ...prev, [name]: value }));
        debounceValidate({ ...modalUser, [name]: value });
    };

    const debounceValidate = useCallback(
        debounce(async (userInfo) => {
            await validate(userInfo);
        }, 500),
        [user]
    );

    const validate = async (userInfo) => {
        const { userNick, userPhone, userEmail } = userInfo;
        const response = await checkDuplicate({ userNick, userPhone, userEmail, currentUserId: userId });

        const newErrors = {};
        if (response.userNick && response.userNick !== user.userNick) {
            newErrors.userNick = '닉네임이 이미 존재합니다.';
        } else {
            newErrors.userNick = '사용 가능한 닉네임입니다.';
        }

        if (response.userPhone && response.userPhone !== user.userPhone) {
            newErrors.userPhone = '전화번호가 이미 존재합니다.';
        } else {
            newErrors.userPhone = '사용 가능한 전화번호입니다.';
        }

        if (response.userEmail && response.userEmail !== user.userEmail) {
            newErrors.userEmail = '이메일이 이미 존재합니다.';
        } else {
            newErrors.userEmail = '사용 가능한 이메일입니다.';
        }

        setErrors(newErrors);
    };

    const handleImageUpload = async (e) => {
        const img = e.target.files[0];
        if (img) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result);
            };
            reader.readAsDataURL(img);

            const formData = new FormData();
            formData.append("userImage", img);
            try {
                await postUserImage(userId, formData);
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

        const hasErrors = Object.keys(errors).some((key) => !errors[key].includes('사용 가능한'));
        if (hasErrors) {
            alert("수정할 수 없는 정보가 존재합니다");
            return;
        }

        try {
            const response = await putUserProfile(modalUser);
            const { accessToken, refreshToken, RESULT } = response;

            if (RESULT === 'SUCCESS') {
                Cookies.set('accessToken', accessToken);
                Cookies.set('refreshToken', refreshToken);

                await refreshAccessToken();

                const updatedProfile = await getUserProfile(userId);
                setUser(updatedProfile);
                alert("정보가 수정 되었습니다.");
                closeModal();
            } else {
                console.error('프로필 수정 실패');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <>
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full mb-8">
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
                            {errors.userNick && (
                                <p className={`text-sm ${errors.userNick.includes('사용 가능한') ? 'text-green-500' : 'text-red-500'}`}>
                                    {errors.userNick}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">전화번호:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="userPhone" type="text" value={modalUser.userPhone} onChange={handleTextChange} />
                            {errors.userPhone && (
                                <p className={`text-sm ${errors.userPhone.includes('사용 가능한') ? 'text-green-500' : 'text-red-500'}`}>
                                    {errors.userPhone}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">이메일:</label>
                            <input className="w-full border border-gray-300 p-2 rounded"
                                name="userEmail" type="text" value={modalUser.userEmail} onChange={handleTextChange} />
                            {errors.userEmail && (
                                <p className={`text-sm ${errors.userEmail.includes('사용 가능한') ? 'text-green-500' : 'text-red-500'}`}>
                                    {errors.userEmail}
                                </p>
                            )}
                        </div>
                        <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={handleClickModify}>수정하기</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyProfileComponent;
