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

const MyInfoModifyComponent = ({ userId }) => {
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
    <div className="flex flex-col justify-center items-center gap-10 bg-white p-6 rounded shadow relative">
      <label htmlFor="fileInput" className="block cursor-pointer">
        <div className="relative">
          <div className="w-28 h-28 rounded-full shadow overflow-hidden">
            <img
              src={
                userImage
                  ? userImage
                  : `${process.env.PUBLIC_URL}/user0_blank.png`
              }
              alt="Profile"
              className="grow w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-gray-400 rounded-full p-2">
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
      <div className="flex gap-8">
        <div className="flex flex-col gap-8">
          <label className="flex items-center">
            <p className="w-32">아이디:</p>
            <input
              className="grow p-2 rounded focus:outline-none"
              name="userEmail"
              readOnly
              type="text"
              value={modalUser.userId}
            />
          </label>
          <div>
            <label className="flex items-center">
              <p className="w-32">현재 비밀번호:</p>
              <input
                className="grow border border-gray-300 p-2 rounded"
                type="password"
              />
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <p className="w-32">비밀번호 변경:</p>
              <input
                className="grow border border-gray-300 p-2 rounded"
                type="password"
              />
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <p className="w-32">비밀번호 확인:</p>
              <input
                className="grow border border-gray-300 p-2 rounded"
                type="password"
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <label className="flex items-center">
            <p className="w-32">이름:</p>
            <input
              className="grow p-2 rounded focus:outline-none"
              name="userName"
              readOnly
              type="text"
              value={modalUser.userName}
            />
          </label>
          <div className="relative">
            <label className="flex items-center">
              <p className="w-32">닉네임:</p>
              <input
                className="grow border border-gray-300 p-2 rounded"
                name="userNick"
                type="text"
                maxLength={6}
                value={modalUser.userNick}
                onChange={handleTextChange}
              />
            </label>
            {errors.userNick && (
              <p
                className={`absolute text-sm ml-32 mt-1 ${
                  errors.userNick.includes("사용 가능한")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {errors.userNick}
              </p>
            )}
          </div>
          <div className="relative">
            <label className="flex items-center">
              <p className="w-32">전화번호:</p>
              <input
                className="grow border border-gray-300 p-2 rounded"
                name="userPhone"
                type="text"
                value={modalUser.userPhone}
                onChange={handleTextChange}
              />
            </label>
            {errors.userPhone && (
              <p
                className={`absolute text-sm ml-32 mt-1 ${
                  errors.userPhone.includes("사용 가능한")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {errors.userPhone}
              </p>
            )}
          </div>
          <div className="relative">
            <label className="flex items-center">
              <p className="w-32">이메일:</p>
              <input
                className="grow border border-gray-300 p-2 rounded"
                name="userEmail"
                type="text"
                value={modalUser.userEmail}
                onChange={handleTextChange}
              />
            </label>
            {errors.userEmail && (
              <p
                className={`absolute text-sm ml-32 mt-1 ${
                  errors.userEmail.includes("사용 가능한")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {errors.userEmail}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center my-8">
        <button
          onClick={handleClickModify}
          className="bg-yellow-500 rounded w-52 h-12 text-white text-center"
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default MyInfoModifyComponent;
