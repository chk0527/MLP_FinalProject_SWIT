import { useState, useEffect, useContext, useCallback } from 'react';
import { API_SERVER_HOST, getUserProfile, putUserProfile, postUserImage, getUserImage, checkDuplicate, validatePassword } from '../../api/UserApi';
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
  const [passwordErrors, setPasswordErrors] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordErrors, setCurrentPasswordErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState({});

  const { refreshAccessToken } = useContext(LoginContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserProfile(userId);
        setUser(userData);
        console.log("불러오기 조회")
        console.log(userData)
        setModalUser({ ...userData });
        setModalUser(prevState => ({
          ...prevState,
          userPassword: ''
        }));
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

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleCurrentPasswordBlur = async () => {
    if (!currentPassword.trim()) {
      setCurrentPasswordErrors({});
      return;
    }
  
    const passwordValid = await validatePassword({ userId: userId, currentPassword });
    const newCurrentPasswordErrors = {};
  
    if (!passwordValid) {
      newCurrentPasswordErrors.currentPassword = '현재 비밀번호가 일치하지 않습니다.';
    } else {
      newCurrentPasswordErrors.currentPassword = '비밀번호가 일치합니다.';
    }
  
    setCurrentPasswordErrors(newCurrentPasswordErrors);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword.trim()) {
      setConfirmPasswordErrors({});
      return;
    }
  
    const newConfirmPasswordErrors = {};
  
    // 비밀번호 규칙을 확인하는 함수 재사용
    const validatePasswordRules = (password) => {
      if (!password.trim()) {
        return '비밀번호는 필수 입력 항목입니다.';
      } else if (!/[A-Z]/.test(password)) {
        return '비밀번호에 대문자(영문자)를 포함해야 합니다.';
      } else if (!/[a-z]/.test(password)) {
        return '비밀번호에 소문자(영문자)를 포함해야 합니다.';
      } else if (!/\d/.test(password)) {
        return '비밀번호에 숫자를 포함해야 합니다.';
      } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(password)) {
        return '비밀번호에 특수문자를 한 문자 이상 포함해야 합니다.';
      } else if (password.length < 8) {
        return '비밀번호는 8자 이상이어야 합니다.';
      } else {
        return '사용 가능한 비밀번호입니다.';
      }
    };
  
    // 비밀번호 일치 여부 확인
    if (confirmPassword !== modalUser.userPassword) {
      newConfirmPasswordErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    } else {
      // 비밀번호 규칙 확인
      const passwordValidationResult = validatePasswordRules(confirmPassword);
      if (passwordValidationResult !== '사용 가능한 비밀번호입니다.') {
        newConfirmPasswordErrors.confirmPassword = passwordValidationResult;
      } else {
        newConfirmPasswordErrors.confirmPassword = '비밀번호가 일치합니다.';
      }
    }
  
    setConfirmPasswordErrors(newConfirmPasswordErrors);
  };

// 닉네임 블러 핸들러
const handleUserNickBlur = async (userInfo) => {
  const newErrors = { ...errors };
  const { userNick, userPhone, userEmail } = userInfo;
  const response = await checkDuplicate({ userNick, userPhone, userEmail, currentUserId: userId });

  if (response.userNick && response.userNick !== user.userNick) {
    newErrors.userNick = '닉네임이 이미 존재합니다.';
  } else {
    newErrors.userNick = '사용 가능한 닉네임입니다.';
  }

  setErrors(newErrors);
};

// 전화번호 블러 핸들러
const handleUserPhoneBlur = async (userInfo) => {
  const newErrors = { ...errors };
  const { userNick, userPhone, userEmail } = userInfo;
  const response = await checkDuplicate({ userNick, userPhone, userEmail, currentUserId: userId });

  if (response.userPhone && response.userPhone !== user.userPhone) {
    newErrors.userPhone = '전화번호가 이미 존재합니다.';
  } else {
    newErrors.userPhone = '사용 가능한 전화번호입니다.';
  }

  setErrors(newErrors);
};

// 이메일 블러 핸들러
const handleUserEmailBlur = async (userInfo) => {
  const newErrors = { ...errors };
  const { userNick, userPhone, userEmail } = userInfo;
  const response = await checkDuplicate({ userNick, userPhone, userEmail, currentUserId: userId });

  if (response.userEmail && response.userEmail !== user.userEmail) {
    newErrors.userEmail = '이메일이 이미 존재합니다.';
  } else {
    newErrors.userEmail = '사용 가능한 이메일입니다.';
  }

  setErrors(newErrors);
};


  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setModalUser((prev) => ({ ...prev, [name]: value }));
    console.log(modalUser.userPassword)
  };

  const handleTextBlur = (e) => {
    const { name, value } = e.target;
    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setModalUser((prev) => ({ ...prev, [name]: value }));
    }
  
    if (name === "currentPassword") {
      handleCurrentPasswordBlur();
    } else if (name === "confirmPassword") {
      handleConfirmPasswordBlur();
    } else if (name === "userPassword") {
      passwordValidate();
    } else if (name === "userNick") {
      handleUserNickBlur(modalUser); // userInfo 인수를 전달
    } else if (name === "userPhone") {
      handleUserPhoneBlur(modalUser); // userInfo 인수를 전달
    } else if (name === "userEmail") {
      handleUserEmailBlur(modalUser); // userInfo 인수를 전달
    } 
  };

  const debounceValidate = useCallback(
    debounce(async (userInfo) => {
      await validate(userInfo);
    }, 500),
    [user]
  );

  const passwordValidate = () => {
    const newErrors = {};
    const value = modalUser.userPassword;
    
    if (!value.trim()) {
      setPasswordErrors({});
      return;
    }
    
    if (!/[A-Z]/.test(value)) {
      newErrors.userPassword = '비밀번호에 대문자(영문자)를 포함해야 합니다.';
    } else if (!/[a-z]/.test(value)) {
      newErrors.userPassword = '비밀번호에 소문자(영문자)를 포함해야 합니다.';
    } else if (!/\d/.test(value)) {
      newErrors.userPassword = '비밀번호에 숫자를 포함해야 합니다.';
    } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(value)) {
      newErrors.userPassword = '비밀번호에 특수문자를 한 문자 이상 포함해야 합니다.';
    } else if (value.length < 8) {
      newErrors.userPassword = '비밀번호는 8자 이상이어야 합니다.';
    } else {
      newErrors.userPassword = '사용 가능한 비밀번호입니다.';
    }
  
    setPasswordErrors(newErrors);
  };

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
    console.log(modalUser.userPassword)
    if (isSocialLogin) {
      alert('소셜 로그인 계정은 프로필 수정을 할 수 없습니다.');
      return;
    }

    const hasErrors = 
    // 닉네임, 전화번호, 이메일이 긍정적인 에러 메시지를 가지는지 확인
    (!errors.userNick || !errors.userNick.includes('사용 가능한')) ||
    (!errors.userPhone || !errors.userPhone.includes('사용 가능한')) ||
    (!errors.userEmail || !errors.userEmail.includes('사용 가능한'));
  
  let hasPasswordErrors = false;
  
  if (modalUser.userPassword.trim() || currentPassword.trim() || confirmPassword.trim()) {
    // 비밀번호 관련 필드 중 하나라도 입력되어 있는 경우 모든 필드가 긍정적인 에러 메시지를 가져야 함
    hasPasswordErrors = 
      (!passwordErrors.userPassword || !passwordErrors.userPassword.includes('사용 가능한')) ||
      (!currentPasswordErrors.currentPassword || !currentPasswordErrors.currentPassword.includes('합니다')) ||
      (!confirmPasswordErrors.confirmPassword || !confirmPasswordErrors.confirmPassword.includes('합니다'));
  }
  
  if (hasErrors || hasPasswordErrors) {
    alert("수정할 수 없는 정보가 존재합니다");
    return;
  }

    console.log("수정시")
    console.log(modalUser)
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
                name="currentPassword"
                type="password"
                onChange={handleCurrentPasswordChange}
                onBlur={handleTextBlur}
              />
            </label>
            {currentPasswordErrors.currentPassword && (
              <p
                className={`absolute text-sm ml-32 mt-1 ${currentPasswordErrors.currentPassword.includes("합니다")
                  ? "text-green-500"
                  : "text-red-500"
                  }`}
              >
                {currentPasswordErrors.currentPassword}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center">
              <p className="w-32">비밀번호 변경:</p>
              <input
                className="grow border border-gray-300 p-2 rounded"
                name="userPassword"
                type="password"
                onChange={handleTextChange}
                onBlur={handleTextBlur}
              />
            </label>
            {passwordErrors.userPassword && (
              <p
                className={`absolute text-sm ml-32 mt-1 ${passwordErrors.userPassword.includes("사용 가능한")
                  ? "text-green-500"
                  : "text-red-500"
                  }`}
              >
                {passwordErrors.userPassword}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center">
              <p className="w-32">비밀번호 확인:</p>
              <input
                className="grow border border-gray-300 p-2 rounded"
                name="confirmPassword"
                type="password"
                onChange={handleConfirmPasswordChange}
                onBlur={handleTextBlur}
              />
            </label>
            {confirmPasswordErrors.confirmPassword && (
              <p
                className={`absolute text-sm ml-32 mt-1 ${confirmPasswordErrors.confirmPassword.includes("일치합니다")
                  ? "text-green-500"
                  : "text-red-500"
                  }`}
              >
                {confirmPasswordErrors.confirmPassword}
              </p>
            )}
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
                onBlur={handleTextBlur}
              />
            </label>
            {errors.userNick && (
              <p
                className={`absolute text-sm ml-32 mt-1 ${errors.userNick.includes("사용 가능한")
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
                onBlur={handleTextBlur}
              />
            </label>
            {errors.userPhone && (
              <p
                className={`absolute text-sm ml-32 mt-1 ${errors.userPhone.includes("사용 가능한")
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
                onBlur={handleTextBlur}
              />
            </label>
            {errors.userEmail && (
              <p
                className={`absolute text-sm ml-32 mt-1 ${errors.userEmail.includes("사용 가능한")
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
