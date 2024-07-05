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
    userPasswordConfirm:'',
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
    const [formError, setFormError] = useState({})        // 유효성 메시지가 엉뚱한 값이 들어감 
    const [userIdDisp, setUserIdDisp] = useState('')
    const [userNickDisp, setUserNickDisp] = useState('')
    const [userEmailDisp, setUserEmailDisp] = useState('')
    const [userPhoneDisp, setUserPhoneDisp] = useState('')
    const [userNameDisp, setUserNameDisp] = useState('')
    const [userPasswordDisp, setUserPasswordDisp] = useState('')
    const [userPasswordConfirmDisp, setUserPasswordConfirmDisp] = useState('')
    const [checkBool, setCheckBool] = useState({})        // 유효성 메시지가 엉뚱한 값이 들어감 
    const [userIdFlag, setUserIdFlag] = useState(false)
    const [userNickFlag, setUserNickFlag] = useState(false)
    const [userEmailFlag, setUserEmailFlag] = useState(false)
    const [userPhoneFlag, setUserPhoneFlag] = useState(false)
    const [userNameFlag, setUserNameFlag] = useState(false)
    const [userPasswordFlag, setUserPasswordFlag] = useState(false)
    const [userPasswordConfirmFlag, setUserPasswordConfirmFlag] = useState(false)

   
    const navigate = useNavigate()

    const handleChangeUser = (e) => {
      const { name, value } = e.target;
      const flag = {...checkBool};

      user[name] = value;
      setUser({...user});

      if (name === "userName" ) {
        flag.userName = false;
        setUserNameFlag(false);
        if (!user.userName.trim()) {
          setUserNameDisp('성명은 필수 입력 항목입니다.');
        } else {
          setUserNameDisp('')
          flag.userName = true;
          setUserNameFlag(true);

        }
      }
      
      if (name === "userPassword" ) {
        flag.userPassword = false;
        flag.userPasswordConfirm = false;
        setUserPasswordFlag(false);
        setUserPasswordConfirmFlag(false);
        if (!user.userPassword.trim()) {
          setUserPasswordDisp('비밀번호는 필수 입력 항목입니다.');
        } else if (!/[A-Z]/.test(user.userPassword)) {
          setUserPasswordDisp('비밀번호에 대문자(영문자)를 포함해야 합니다.'); // 대문자 미포함 메시지 추가
        } else if (!/[a-z]/.test(user.userPassword)) {
          setUserPasswordDisp('비밀번호에 소문자(영문자)를 포함해야 합니다.'); // 소문자 미포함 메시지 추가
        } else if (!/\d/.test(user.userPassword)) {
          setUserPasswordDisp('비밀번호에 숫자를 포함해야 합니다.'); // 숫자 미포함 메시지 추가
        } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(user.userPassword)) {
          setUserPasswordDisp('비밀번호에 특수문자를 한 문자 이상 포함해야 합니다.'); // 특수문자 미포함 메시지 추가
        } else if (user.userPassword.length < 8) {
          setUserPasswordDisp('비밀번호는 8자 이상이어야 합니다.'); // 8자 미만인 경우 메시지 추가
        } else {
          setUserPasswordDisp('사용 가능한 비밀번호 입니다.');
          flag.userPassword = true;
          setUserPasswordFlag(true);
        }

        // 비밀번호 확인에 값이 있는 경우
        if (user.userPasswordConfirm) {
          if (user.userPassword === user.userPasswordConfirm) {
            setUserPasswordConfirmDisp('비밀번호가 일치합니다.');
            flag.userPasswordConfirm = true;
            setUserPasswordConfirmFlag(true);
          } else {
            setUserPasswordConfirmDisp('비밀번호가 불일치 합니다.');
          }
        } else {
          setUserPasswordConfirmDisp('');
        }
      }
      
      if (name === "userPasswordConfirm") {
        flag.userPasswordConfirm = false;
        setUserPasswordConfirmFlag(false);
        if (user.userPassword === value) {
          setUserPasswordConfirmDisp('비밀번호가 일치합니다.');
          flag.userPasswordConfirm = true;
          setUserPasswordConfirmFlag(true);
        } else {
          setUserPasswordConfirmDisp('비밀번호가 불일치 합니다.');
        }
      }
      
      // setCheckBool(flag);

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
      console.info("validate1");
      const flag = {...checkBool};
      const { userId, userNick, userEmail, userPhone} = userInfo;
      const response = await checkDuplicate2({ userId, userNick, userEmail, userPhone });
      
      flag.userId = false;
      setUserIdFlag(false);
      if (!userId.trim()) {
        setUserIdDisp('아이디는 필수 입력 항목입니다.');
      } else if (!(/^[a-zA-Z0-9]+$/).test(userId)) {
        setUserIdDisp('아이디는 영문자와 숫자로만 구성되어야 합니다.');
      } else if (!/^[a-zA-Z]/.test(userId)) {
        setUserIdDisp('아이디는 영문자로 시작해야 합니다.');
      } else if (response.userId) {
        setUserIdDisp('아이디가 이미 존재합니다.');
      } else {
        setUserIdDisp('사용 가능한 아이디입니다.');
        flag.userId = true;
        setUserIdFlag(true);
      }

      // setCheckBool(flag);

    }

    const validate2 = async (userInfo) => {
      console.info("validate2");
      const flag = {...checkBool};
      const { userId, userNick, userEmail, userPhone} = userInfo;
      const response = await checkDuplicate2({ userId, userNick, userEmail, userPhone });

      flag.userNick = false;
      setUserNickFlag(false);
      if (!user.userNick.trim()) {
        setUserNickDisp('닉네임은 필수 입력 항목입니다.');
      } else if (response.userNick) {
        setUserNickDisp('닉네임이 이미 존재합니다.');
      } else {
        setUserNickDisp('사용 가능한 닉네임입니다.');
        flag.userNick = true;
        setUserNickFlag(true);
      }

      // setCheckBool(flag);

    }

    const validate3 = async (userInfo) => {
      console.info("validate3");
      const flag = {...checkBool};
      const { userId, userNick, userEmail, userPhone} = userInfo;
      const response = await checkDuplicate2({ userId, userNick, userEmail, userPhone });

      flag.userEmail = false;
      setUserEmailFlag(false);
      if (!user.userEmail.trim()) {
        setUserEmailDisp('이메일은 필수 입력 항목입니다.');
      } else if (!/\S+@\S+\.\S+/.test(user.userEmail)) {
        setUserEmailDisp('이메일 형식이 올바르지 않습니다.');
      } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(user.userEmail)) {
        setUserEmailDisp('이메일은 영문자와 숫자로만 입력 가능합니다.');
      } else if (response.userEmail) {
        setUserEmailDisp('이메일이 이미 존재합니다.');
      } else {
        setUserEmailDisp('사용 가능한 이메일입니다.');
        flag.userEmail = true;
        setUserEmailFlag(true);
      }

      // setCheckBool(flag);

    }

    const validate4 = async (userInfo) => {
      console.info("validate4");
      const flag = {...checkBool};
      const { userId, userNick, userEmail, userPhone} = userInfo;
      const response = await checkDuplicate2({ userId, userNick, userEmail, userPhone });

      flag.userPhone = false;
      setUserPhoneFlag(false);
      if (!user.userPhone.trim()) {
        setUserPhoneDisp('연락처는 필수 입력 항목입니다.');
      } else if (/[a-zA-Z]/.test(user.userPhone)) {
        setUserPhoneDisp("연락처에는 문자('-' 포함)를 입력할 수 없습니다.");
      } else if (!/^\d{3}\d{4}\d{4}$/.test(user.userPhone)) {
        setUserPhoneDisp('연락처 형식이 올바르지 않습니다.');
      } else if (response.userPhone) {
        setUserPhoneDisp('연락처가 이미 존재합니다.');
      } else {
        setUserPhoneDisp('사용 가능한 연락처입니다.');
        flag.userPhone = true;
        setUserPhoneFlag(true);
      }

      // setCheckBool(flag);

    }

    const display = (str, formError, userInfo, response) => {
      const { userId, userNick, userEmail, userPhone} = userInfo;
      
      console.info(str + " " + userId + " "+ response.userId + " " + formError.userId);
      console.info(str + " " + userNick + " "+ response.userNick + " " + formError.userNick);
      console.info(str + " " + userEmail + " "+ response.userEmail + " " + formError.userEmail);
      console.info(str + " " + userPhone + " "+ response.userPhone + " " + formError.userPhone);
    }

    const handleJoin = async () => { 
      const flag = {...checkBool}

      // const hasErrors = Object.keys(flag).some((key) => !errors[key].includes('사용 가능한'));
      // if (hasErrors) {
      //   alert("수정할 수 없는 정보가 존재합니다");
      //   return;
      // }
      // const hasFalseValue = flag.some((value) => value === false); 배열일 경우
      // const hasFalseValue = Object.values(flag).some((value) => value === false)  // 객체인 경우

      // if (hasFalseValue) {
      //   console.log('전체 요소 중에서 false가 존재합니다.');
      //   alert("수정할 수 없는 정보가 존재합니다");
      //   return;
      // }      
      
      // console.info("flag.userId " + flag.userId)
      // console.info("flag.userName " + flag.userName)
      // console.info("flag.userPassword " + flag.userPassword)
      // console.info("flag.userPasswordConfirm " + flag.userPasswordConfirm)
      // console.info("flag.userNick " + flag.userNick)
      // console.info("flag.userEmail " + flag.userEmail)
      // console.info("flag.userPhone " + flag.userPhone)
      
      console.info("userIdFlag " + userIdFlag)
      console.info("userNameFlag " + userNameFlag)
      console.info("userPasswordFlag " + userPasswordFlag)
      console.info("userPasswordConfirmFlag " + userPasswordConfirmFlag)
      console.info("userNickFlag " + userNickFlag)
      console.info("userEmailFlag " + userEmailFlag)
      console.info("userPhoneFlag " + userPhoneFlag)


      if ( userIdFlag && userNameFlag && userPasswordFlag && userPasswordConfirmFlag
        && userNickFlag && userEmailFlag && userPhoneFlag) {
          
      
      } else {
        console.log('전체 요소 중에서 false가 존재합니다.');
        alert("수정할 수 없는 정보가 존재합니다");
        return;
      }

      try {
        const userInfo = { ...user, userPhone: user.userPhone.replace(/\-/g, "") };
        const response = await join(userInfo);
        // const { accessToken, refreshToken, RESULT } = response;

        alert("회원 가입 되었습니다.");

        navigate({pathname:'../../login'})

      } catch (error) {
          console.error('Error insert 회원가입:', error);
      }

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
                  {/* <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userId === "string" && formError.userId.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userId}
                  </label> */}
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof userIdDisp === "string" && userIdDisp.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {userIdDisp}
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
                  {/* <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userName === "string" && formError.userName.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userName}
                  </label> */}
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof userNameDisp === "string" && userNameDisp.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {userNameDisp}
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
                  {/* <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userPassword === "string" && formError.userPassword.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userPassword}
                  </label> */}
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof userPasswordDisp === "string" && userPasswordDisp.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {userPasswordDisp}
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
                  {/* <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userPasswordConfirm === "string" && formError.userPasswordConfirm.includes("불일치") ? "text-red-500" : "text-green-500"} `}>
                    {formError.userPasswordConfirm}
                  </label> */}
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof userPasswordConfirmDisp === "string" && userPasswordConfirmDisp.includes("불일치") ? "text-red-500" : "text-green-500"} `}>
                    {userPasswordConfirmDisp}
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
                  {/* <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userNick === "string" && formError.userNick.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userNick}
                  </label> */}
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof userNickDisp === "string" && userNickDisp.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {userNickDisp}
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
                  {/* <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userEmail === "string" && formError.userEmail.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userEmail}
                  </label> */}
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof userEmailDisp === "string" && userEmailDisp.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {userEmailDisp}
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
                  {/* <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof formError.userPhone === "string" && formError.userPhone.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {formError.userPhone}
                  </label> */}
                  <label className={`text-[10px] ml-32 mt-1 ${
                                     typeof userPhoneDisp === "string" && userPhoneDisp.includes("사용 가능한") ? "text-green-500" : "text-red-500"} `}>
                    {userPhoneDisp}
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