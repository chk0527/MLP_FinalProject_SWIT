import React, { useContext, useEffect, useState, useCallback } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";
//import { useEffect, useState } from "react";
import { getOne } from "../../api/LoginApi";
import { Link } from "react-router-dom";

const initState = {
  username: "",
  password: "",
};

const initStateSnsUrl = {
  naverURL: "",
  kakaoURL: "",
};

const LoginComponent = () => {
  const [user, setUser] = useState({ ...initState });
  const [snsUrl, setSnsUrl] = useState({ ...initStateSnsUrl });
  // const navigate = useNavigate()

  const { login } = useContext(LoginContext);

  // 로그인 화면 최초 Host 호출
  useEffect(() => {
    // StrictMode(코드 검사 등) 에 의해 2회 실행
    // (index.js 파일에서 StrictMode 지우면 1회 실행)

    // 완성 되기 전까지 snslogin 잠시 주석 처리
    getOne().then((data) => setSnsUrl(data));
  }, []);

  const handleChangeUser = (e) => {
    user[e.target.name] = e.target.value;
    setUser({ ...user });
  };

  // const handleClickIdSearch = useCallback(() => {
  //     navigate({ pathname: '../../searchId' });
  // }, [navigate]);

  // const handleClickPasswordSearch = useCallback(() => {
  //     navigate({ pathname: '../../searchPw' });
  // }, [navigate]);

  const onLogin = (e) => {
    console.info(`${user.username}`) 

    if (!user.username.trim()) {
      alert('아이디를 입력해 주세요.');
      return;
    }
    if (!user.password.trim()) {
      alert('패스워드를 입력해 주세요.');
      return;
    }

    login(user.username, user.password)
        
  }

  return (
    <div className="flex flex-col items-center ">
      <div className="text-5xl pb-16 font-blackHans text-center">
        <div>로그인</div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-8 border-t-2 border-slate-200">
        <div className="space-y-6">
          <div className="flex items-center">
            <label className="block font-medium text-slate-700 mr-4 w-24">
              아이디
            </label>
            <input
              type="text"
              id="username"
              placeholder="아이디"
              name="username"
              value={user.username}
              onChange={handleChangeUser}
              className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
            />
          </div>
          <div className="flex items-center">
            <label className="block font-medium text-slate-700 mr-4 w-24">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              name="password"
              value={user.password}
              onChange={handleChangeUser}
              className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700"
              onClick={() => onLogin()}
            >
              로그인
            </button>
          </div>
          <div className="flex justify-center space-x-4">
            <a href={snsUrl.kakaoURL}>
              <img
                src={`${process.env.PUBLIC_URL}/kakao.png`}
                className="w-10"
                alt="Kakao"
              />
            </a>
            <a href={snsUrl.naverURL}>
              <img src={`${process.env.PUBLIC_URL}/naver.svg`} alt="Naver" />
            </a>
          </div>
          <div className="flex justify-center space-x-4">
            <Link to="/login/searchId" className="font-bold">
              아이디 찾기
            </Link>
            <Link to="/login/searchPw" className="font-bold">
              비밀번호 찾기
            </Link>
            <Link to="/Join" className="font-bold">
              회원 가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;

//  이메일 인증
//  이메일 인증
//  이메일 인증
//  이메일 인증
//  이메일 인증
//  이메일 인증
//  이메일 인증
//  이메일 인증
//  이메일 인증

// import React, { useState } from 'react';
// import axios from 'axios';

// const EmailConfirm = () => {
//   const [email, setEmail] = useState('');
//   const [emailConfirm, setEmailConfirm] = useState('');
//   const [emailConfirmStatus, setEmailConfirmStatus] = useState('');

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handleEmailConfirmChange = (e) => {
//     setEmailConfirm(e.target.value);
//   };

//   const handleEmailConfirm = async () => {
//     try {
//       const response = await axios.post('/login/mailConfirm', { email });
//       const data = response.data;
//       alert('해당 이메일로 인증번호 발송이 완료되었습니다. \n 확인부탁드립니다.');
//       console.log('data:', data);
//       chkEmailConfirm(data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const chkEmailConfirm = (data) => {
//     if (data !== emailConfirm) {
//       setEmailConfirmStatus('인증번호가 잘못되었습니다');
//     } else {
//       setEmailConfirmStatus('인증번호 확인 완료');
//     }
//   };

//   return (
//     <div>
//       <div className="form-group last mb-4 email_input">
//         <label htmlFor="memail" id="mailTxt">
//           이메일을 입력해주세요
//         </label>
//         <input
//           type="text"
//           className="form-control"
//           name="memail"
//           id="memail"
//           value={email}
//           onChange={handleEmailChange}
//         />
//       </div>
//       <button className="btn btn-outline-primary" type="button" onClick={handleEmailConfirm}>
//         인증번호
//       </button>
//       <div className="form-group last mb-4 check_input">
//         <label htmlFor="memailconfirm" id="memailconfirmTxt">
//           인증번호를 입력해주세요
//         </label>
//         <input
//           type="text"
//           className="form-control"
//           id="memailconfirm"
//           value={emailConfirm}
//           onChange={handleEmailConfirmChange}
//         />
//         {emailConfirmStatus && (
//           <span id="emconfirmchk" style={{ color: emailConfirmStatus === '인증번호 확인 완료' ? '#0D6EFD' : '#FA3E3E', fontWeight: 'bold', fontSize: '10px' }}>
//             {emailConfirmStatus}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmailConfirm;
