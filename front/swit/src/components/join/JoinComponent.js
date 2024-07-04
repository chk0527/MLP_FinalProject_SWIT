import { useState, useCallback } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { checkDuplicate } from '../../api/UserApi';
import { join, checkDuplicate2 } from '../../api/LoginApi';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const initState = { 
    userNo:'',
    userId:'',
    userName:'',
    userPassword:'',
    userEmail:'',
    userPhone:'',
    userNick:'',
    userSnsConnect:'',
    userCreateDate:'',
    userDeleteChk:'',
    userDeleteDate:'',
    userImage:'',
    userRole:'',
}

const JoinComponent =() => {
    const [user, setUser] = useState({...initState})
    const [showPassword, setShowPassword] = useState(false)
    const [formError, setFormError] = useState({})
    // const [fontColor, setfontColor] = useState(false)
    // const [fontColor, setfontColor] = useState(false)
   
    const navigate = useNavigate()

    // const userIdCheck = (e) => {
    // }
    // const userEmailCheck = (e) => {
    // }
    // const userNickCheck = (e) => {
    // }
    // const userPhoneCheck = (e) => {
    // }

    const handleChangeUser = (e) => {
      const { name, value } = e.target;
      const errors = {...formError};

      user[name] = value;
      setUser({...user});
      
      // 아이디, 닉네임, 이메일, 핸드폰 번호 중복 체크
      if (name === "userId") {
        debounceValidate1({ ...user});
      }
      if (name === "userNick") {
        debounceValidate2({ ...user});
      }
      if (name === "userEmail") {
        debounceValidate3({ ...user});
      }
      if (name === "userPhone") {
        debounceValidate4({ ...user});
      }
      
      if (name === "userName" ) {
        if (!user.userName.trim()) {
          errors.userName = '성명은 필수 입력 항목입니다.';
        }
      }

      if (name === "userPassword" ) {
        if (!user.userPassword.trim()) {
          errors.userPassword = '비밀번호는 필수 입력 항목입니다.';
        } else if (!/[A-Z]/.test(user.userPassword)) {
          errors.userPassword = '비밀번호에 대문자(영문자)를 포함해야 합니다.'; // 대문자 미포함 메시지 추가
        } else if (!/[a-z]/.test(user.userPassword)) {
          errors.userPassword = '비밀번호에 소문자(영문자)를 포함해야 합니다.'; // 소문자 미포함 메시지 추가
        } else if (!/\d/.test(user.userPassword)) {
          errors.userPassword = '비밀번호에 숫자를 포함해야 합니다.'; // 숫자 미포함 메시지 추가
        } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(user.userPassword)) {
          errors.userPassword = '비밀번호에 특수문자를 한 문자 이상 포함해야 합니다.'; // 특수문자 미포함 메시지 추가
        } else if (user.userPassword.length < 8) {
          errors.userPassword = '비밀번호는 8자 이상이어야 합니다.'; // 8자 미만인 경우 메시지 추가
        } else {
          errors.userPassword = '사용 가능한 비밀번호 입니다.';
        }

        // 비밀번호 확인에 값이 있는 경우
        if (user.userPasswordConfirm) {
          if (user.userPassword === user.userPasswordConfirm) {
            errors.userPasswordConfirm = '비밀번호가 일치합니다.';
          } else {
            errors.userPasswordConfirm = '비밀번호가 불일치 합니다.';
          }
        } else {
          delete errors.userPasswordConfirm
        }

      }

      if (name === "userPasswordConfirm") {
        if (user.userPassword === value) {
          errors.userPasswordConfirm = '비밀번호가 일치합니다.';
        } else {
          errors.userPasswordConfirm = '비밀번호가 불일치 합니다.';
        }
      }

      setFormError(errors);
    }

    const debounceValidate1 = useCallback(
      debounce(async (userInfo) => {
          await validate1(userInfo);
      }, 500),
      [user]
    )
    const debounceValidate2 = useCallback(
      debounce(async (userInfo) => {
          await validate2(userInfo);
      }, 500),
      [user]
    )
    const debounceValidate3 = useCallback(
      debounce(async (userInfo) => {
          await validate3(userInfo);
      }, 500),
      [user]
    )
    const debounceValidate4 = useCallback(
      debounce(async (userInfo) => {
          await validate4(userInfo);
      }, 500),
      [user]
    )
    
    const validate1 = async (userInfo) => {
      const errors = {...formError};
      const { userId, userNick, userEmail, userPhone} = userInfo;
      const response = await checkDuplicate2({ userId, userNick, userEmail, userPhone });

      if (!userId.trim()) {
        errors.userId = '아이디는 필수 입력 항목입니다.';
      } else if (!(/^[a-zA-Z0-9]+$/).test(userId)) {
        errors.userId = '아이디는 영문자와 숫자로만 구성되어야 합니다.';
      } else if (!/^[a-zA-Z]/.test(userId)) {
        errors.userId = '아이디는 영문자로 시작해야 합니다.';
      } else if (response.userId) {
        errors.userId = '아이디가 이미 존재합니다.';
      } else {
        errors.userId = '사용 가능한 아이디입니다.';
      }

      setFormError(errors);
    }

    const validate2 = async (userInfo) => {
      const errors = {...formError};
      const { userId, userNick, userEmail, userPhone} = userInfo;
      const response = await checkDuplicate2({ userId, userNick, userEmail, userPhone });

      if (!user.userNick.trim()) {
        errors.userNick = '닉네임은 필수 입력 항목입니다.';
      } else if (response.userNick) {
        errors.userNick = '닉네임이 이미 존재합니다.';
      } else {
        errors.userNick = '사용 가능한 닉네임입니다.';
      }

      setFormError(errors);
    }

    const validate3 = async (userInfo) => {
      const errors = {...formError};
      const { userId, userNick, userEmail, userPhone} = userInfo;
      const response = await checkDuplicate2({ userId, userNick, userEmail, userPhone });

      if (!user.userEmail.trim()) {
        errors.userEmail = '이메일은 필수 입력 항목입니다.';
      } else if (!/\S+@\S+\.\S+/.test(user.userEmail)) {
        errors.userEmail = '이메일 형식이 올바르지 않습니다.';
      } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(user.userEmail)) {
        errors.userEmail = '이메일은 영문자와 숫자로만 입력 가능합니다.';
      } else if (response.userEmail) {
        errors.userEmail = '이메일이 이미 존재합니다.';
      } else {
        errors.userEmail = '사용 가능한 이메일입니다.';
      }

      setFormError(errors);
    }

    const validate4 = async (userInfo) => {
      const errors = {...formError};
      const { userId, userNick, userEmail, userPhone} = userInfo;
      const response = await checkDuplicate2({ userId, userNick, userEmail, userPhone });

      if (!user.userPhone.trim()) {
        errors.userPhone = '연락처는 필수 입력 항목입니다.';
      } else if (/[a-zA-Z]/.test(user.userPhone)) {
        errors.userPhone = '연락처에는 문자를 입력할 수 없습니다.';
      } else if (!/^\d{3}-\d{4}-\d{4}$/.test(user.userPhone)) {
        errors.userPhone = '연락처 형식이 올바르지 않습니다.';
      } else if (response.userPhone) {
        errors.userPhone = '연락처가 이미 존재합니다.';
      } else {
        errors.userPhone = '사용 가능한 연락처입니다.';
      }

      setFormError(errors);
    }

    const validateForm = () => {
      const errors = {...formError}

      const hasErrors = Object.keys(errors).some((key) => !errors[key].includes('사용 가능한') ||  errors[key].includes('불일치'));
      if (hasErrors) {
        alert("수정할 수 없는 정보가 존재합니다");
        return;
      }

    }

    const handleJoin = async () => { 
      const errors = {...formError}

      const hasErrors = Object.keys(errors).some((key) => !errors[key].includes('사용 가능한'));
      if (hasErrors) {
        alert("수정할 수 없는 정보가 존재합니다");
        return;
      }

      try {
        const userInfo = { ...user, userPhone: user.userPhone.replace(/\-/g, "") };
        const response = await join(userInfo);
        const { accessToken, refreshToken, RESULT } = response;

        if (RESULT === 'SUCCESS') {
          alert("회원 가입 되었습니다.");
        } else {
          console.error('회원 가입 실패');
        }
      } catch (error) {
          console.error('Error insert 회원가입:', error);
      }

      const userInfo = { ...user, userPhone: user.userPhone.replace(/\-/g, "") };
      join(userInfo).then(result => {
          alert('회원 가입 되셨습니다. 로그인 하시기 바랍니다.');
          navigate({pathname:'../../login'})
      }).catch(e=>{
          console.error(e)
      })

    }

    return (
      <div className="flex flex-col items-center ">
          <div className="text-5xl pb-16 font-blackHans text-center">
              <div>회원 가입</div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 border-t-2 border-slate-100 min-w-[520px]">
              <div className="space-y-1">
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-28">
                          아이디 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                          <input
                              type="text"
                              id="userId"
                              placeholder="id"
                              name="userId"
                              autoComplete="id"
                              value={user.userId}
                              onChange={handleChangeUser}
                              // onBlur={userIdCheck}
                              required
                              className="border border-gray-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userId === "string" && formError.userId.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userId}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-28">
                          성명 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                          <input
                              type="text"
                              id="userName"
                              placeholder="name"
                              name="userName"
                              autoComplete="name"
                              value={user.userName}
                              onChange={handleChangeUser}
                              // onBlur={userNameCheck}
                              required
                              className="border border-gray-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userName === "string" && formError.userName.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userName}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-28 whitespace-nowrap">
                          비밀번호 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center flex-1">
                          <input
                              type={showPassword ? "text" : "password"}
                              id="userPassword"
                              placeholder="password"
                              name="userPassword"
                              autoComplete="password"
                              value={user.userPassword}
                              onChange={handleChangeUser}
                              // onBlur={userPasswordCheck}
                              required
                              className="border border-gray-300 rounded-md p-2 flex-1"
                          />
                          <div className="ml-4">
                              <input
                                  type="checkbox"
                                  checked={showPassword}
                                  onChange={() => setShowPassword(!showPassword)}
                                  className="form-checkbox h-3 w-3 text-indigo-600"
                              />
                              <label htmlFor="showPassword" className="ml-2 font-medium text-slate-700">
                                  표시
                              </label>
                          </div>
                      </div>
                  </div>
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userPassword === "string" && formError.userPassword.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userPassword}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-28">
                          비밀번호 확인<span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center flex-1">
                          <input
                              type={showPassword ? "text" : "password"}
                              id="userPasswordConfirm"
                              placeholder="passwordConfirm"
                              name="userPasswordConfirm"
                              autoComplete="passwordConfirm"
                              value={user.userPasswordConfirm}
                              onChange={handleChangeUser}
                              // onBlur={userPasswordCheck}
                              required
                              className="border border-gray-300 rounded-md p-2 flex-1"
                          />
                      </div>
                  </div>
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userPasswordConfirm === "string" && formError.userPasswordConfirm.includes("불일치") ? "text-red-500" : "text-green-500"} `}>
                    {formError.userPasswordConfirm}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-28">
                          닉네임 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                          <input
                              type="text"
                              id="userNick"
                              placeholder="Nick"
                              name="userNick"
                              autoComplete="nickname"
                              value={user.userNick}
                              onChange={handleChangeUser}
                              // onBlur={userNickCheck}
                              className="border border-gray-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userNick === "string" && formError.userNick.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userNick}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-28">
                          이메일 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                          <input
                              type="text"
                              id="userEmail"
                              placeholder="email"
                              name="userEmail"
                              autoComplete="email"
                              value={user.userEmail}
                              onChange={handleChangeUser}
                              // onBlur={userEmailCheck}
                              required
                              className="border border-gray-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userEmail === "string" && formError.userEmail.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userEmail}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-28 whitespace-nowrap">
                          연락처 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex-1">
                          <input
                              type="tel"
                              id="userPhone"
                              placeholder="phone"
                              name="userPhone"
                              autoComplete="phone"
                              value={user.userPhone}
                              onChange={handleChangeUser}
                              // onBlur={userPhoneCheck}
                              required
                              className="border border-gray-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userPhone === "string" && formError.userPhone.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userPhone}
                  </label>
                  <div className="flex justify-end">
                      <button
                          className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700"
                          onClick={handleJoin}
                      >
                          회원 가입
                      </button>
                  </div>
              </div> 
          </div> 
      </div>
  );
}  
export default JoinComponent;