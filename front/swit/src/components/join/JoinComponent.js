import { useState, useContext } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { join } from '../../api/LoginApi';
import { useNavigate } from 'react-router-dom';

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
    const [fontColor, setfontColor] = useState(false)
    
    const navigate = useNavigate()

    // const userIdCheck = (e) => {
    //   const error = { ...formError };

    //   if (!e.target.value.trim()) {
    //       error.userId = '아이디는 필수 입력 항목입니다.';
    //   } else if (!(/^[a-zA-Z0-9]+$/).test(e.target.value)) {
    //       error.userId = '아이디는 영문자와 숫자로만 구성되어야 합니다.';
    //   } else if (!/^[a-zA-Z]/.test(e.target.value)) {
    //       error.userId = '아이디는 영문자로 시작해야 합니다.';
    //   } else {
    //       delete error.userId;
    //   }

    //   setFormError(error);
    // }

    // const userPasswordCheck = (e) => {
    //   const error = { ...formError };

    //   if (!e.target.value.trim()) {
    //       error.userPassword = '비밀번호는 필수 입력 항목입니다.';
    //       setFontSize(false)
    //   } else if (!validatePassword(e.target.value)) {
    //       error.userPassword = '대문자(영문자), 소문자(영문자), 숫자, 특수문자 각각 한문자 이상 포함하는 8자 이상 비밀번호를 정하셔야 합니다.';
    //       setFontSize(true)
    //   } else {
    //     delete error.userPassword;
    //   }

    //   setFormError(error);
    // }

    const userEmailCheck = (e) => {
      const error = { ...formError };

      if (!e.target.value.trim()) {
          error.userEmail = '이메일은 필수 입력 항목입니다.';
      } else if (!/\S+@\S+\.\S+/.test(e.target.value)) {
          error.userEmail = '이메일 형식이 올바르지 않습니다.';
      } else {
        delete error.userEmail;
      }

      setFormError(error);
    }

    // const userNameCheck = (e) => {
    //   const error = { ...formError };

    //   if (!e.target.value.trim()) {
    //     error.userName = '성명은 필수 입력 항목입니다.';
    //   } else {
    //     delete error.userName;
    //   }

    //   setFormError(error);
    // }

    // const userNickCheck = (e) => {
    //   const error = { ...formError };

    //   if (!e.target.value.trim()) {
    //     error.userNick = '닉네임은 필수 입력 항목입니다.';
    //   } else {
    //     delete error.userName;
    //   }

    //   setFormError(error);
    // }

    // const userPhoneCheck = (e) => {
    //   const error = { ...formError };
  
    //   if (!e.target.value.trim()) {
    //       error.userPhone = '연락처는 필수 입력 항목입니다.';
    //   } else if (!/^\d{3}-\d{4}-\d{4}$/.test(e.target.value)) {
    //       if (/[a-zA-Z]/.test(e.target.value)) {
    //           error.userPhone = '연락처에는 문자를 입력할 수 없습니다.';
    //       } else {
    //           error.userPhone = '연락처 형식이 올바르지 않습니다.';
    //       }
    //   } else {
    //       delete error.userPhone;
    //   }
  
    //   setFormError(error);
    // };

    
    
    const handleChangeUser = (e) => {
        let { name, value } = e.target;
        const errors = {...formError};

        if (name === "userId") {

          if (!value.trim()) {
            errors.userId = '아이디는 필수 입력 항목입니다.';
          } else if (!(/^[a-zA-Z0-9]+$/).test(value)) {
            errors.userId = '아이디는 영문자와 숫자로만 구성되어야 합니다.';
          } else if (!/^[a-zA-Z]/.test(value)) {
            errors.userId = '아이디는 영문자로 시작해야 합니다.';
          } else {
            delete errors.userId;
          }
        }

        if (name === "userPassword") {

          if (!value.trim()) {
            errors.userPassword = '비밀번호는 필수 입력 항목입니다.';
          } else if (!/[A-Z]/.test(value)) {
            errors.userPassword = '비밀번호에 대문자(영문자)를 포함해야 합니다.'; // 대문자 미포함 메시지 추가
          } else if (!/[a-z]/.test(value)) {
            errors.userPassword = '비밀번호에 소문자(영문자)를 포함해야 합니다.'; // 소문자 미포함 메시지 추가
          } else if (!/\d/.test(value)) {
            errors.userPassword = '비밀번호에 숫자를 포함해야 합니다.'; // 숫자 미포함 메시지 추가
          } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(value)) {
            errors.userPassword = '비밀번호에 특수문자를 한 문자 이상 포함해야 합니다.'; // 특수문자 미포함 메시지 추가
          } else if (value.length < 8) {
            errors.userPassword = '비밀번호는 8자 이상이어야 합니다.'; // 8자 미만인 경우 메시지 추가
          } else {
            delete errors.userPassword; // 모든 조건을 만족하는 경우 오류 메시지 삭제
          }
        }

        if (name === "userEmail") {
          if (!value.trim()) {
            errors.userEmail = '이메일은 필수 입력 항목입니다.';
          } else if (!/\S+@\S+\.\S+/.test(value)) {
              errors.userEmail = '이메일 형식이 올바르지 않습니다.';
          } else {
            delete errors.userEmail;
          }
        }







        if (name === "userPhone") {
            value = value.replace(/\-/g, "");
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }


        setFormError(errors);
        user[name] = value;
        setUser({...user});
    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        return regex.test(password);
    };

    const validateForm = () => {
        const errors = {};

        if (!user.userId.trim()) {
            errors.userId = '아이디는 필수 입력 항목입니다.';
        } else if (!(/^[a-zA-Z0-9]+$/).test(user.userId)) {
            errors.userId = '아이디는 영문자와 숫자로만 구성되어야 합니다.';
        } else if (!/^[a-zA-Z]/.test(user.userId)) {
          errors.userId = '아이디는 영문자로 시작해야 합니다.';
        }

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
        }

        if (!user.userEmail.trim()) {
            errors.userEmail = '이메일은 필수 입력 항목입니다.';
        } else if (!/\S+@\S+\.\S+/.test(user.userEmail)) {
            errors.userEmail = '이메일 형식이 올바르지 않습니다.';
        }

        if (!user.userName.trim()) {
            errors.userName = '성명은 필수 입력 항목입니다.';
        }

        if (!user.userNick.trim()) {
            errors.userNick = '닉네임은 필수 입력 항목입니다.';
        }
        
        // if (!user.userPhone.trim()) {
        //     errors.userPhone = '연락처는 필수 입력 항목입니다.';
        // }
        if (!user.userPhone.trim()) {
          errors.userPhone = '연락처는 필수 입력 항목입니다.';
        } else if (!/^\d{3}-\d{4}-\d{4}$/.test(user.userPhone)) {
            if (/[a-zA-Z]/.test(user.userPhone)) {
                errors.userPhone = '연락처에는 문자를 입력할 수 없습니다.';
            } else {
                errors.userPhone = '연락처 형식이 올바르지 않습니다.';
            }
        }

        setFormError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleJoin = () => { 
        if (validateForm()) {
            const userInfo = { ...user, userPhone: user.userPhone.replace(/\-/g, "") };
            join(userInfo).then(result => {
                alert('회원 가입 되셨습니다. 로그인 하시기 바랍니다.');
                navigate({pathname:'../../login'})
            }).catch(e=>{
                console.error(e)
            })
        }
    }

    return (
      <div className="flex flex-col items-center ">
          <div className="text-5xl pb-16 font-blackHans text-center">
              <div>회원 가입</div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 border-t-2 border-slate-100 min-w-[620px]">
              <div className="space-y-1">
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-20">
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
                              className="bg-slate-100 border-slate-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className="text-red-500 text-[10px] ml-24 mt-1">
                    {formError.userId}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-20 whitespace-nowrap">
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
                              className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
                          />
                          <div className="ml-4">
                              <input
                                  type="checkbox"
                                  checked={showPassword}
                                  onChange={() => setShowPassword(!showPassword)}
                                  className="form-checkbox h-3 w-3 text-indigo-600"
                              />
                              <label htmlFor="showPassword" className="ml-2 font-medium text-slate-700">
                                  {showPassword ? "표시" : "숨김"}
                              </label>
                          </div>
                      </div>
                  </div>
                  <label className={fontSize ? "text-red-500 text-[9px] ml-24 mt-1" : "text-red-500 text-[10px] ml-24 mt-1"}>
                    {formError.userPassword ? formError.userPassword : formError.userPassword2}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-20">
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
                              className="bg-slate-100 border-slate-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className="text-red-500 text-[10px] ml-24 mt-1">
                    {formError.userEmail}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-20">
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
                              className="bg-slate-100 border-slate-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className="text-red-500 text-[10px] ml-24 mt-1">
                    {formError.userName}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-20">
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
                              className="bg-slate-100 border-slate-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className="text-red-500 text-[10px] ml-24 mt-1">
                    {formError.userNick}
                  </label>
                  <div className="flex items-center">
                      <label className="block font-medium text-slate-700 mr-4 w-20 whitespace-nowrap">
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
                              className="bg-slate-100 border-slate-300 rounded-md p-2 w-full"
                          />
                      </div>
                  </div>
                  <label className="text-red-500 text-[10px] ml-24 mt-1">
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