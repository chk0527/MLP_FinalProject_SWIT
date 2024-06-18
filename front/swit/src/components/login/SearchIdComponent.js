import React, { useState, useEffect } from 'react';
import { searchId, send_sms } from "../../api/LoginApi"

const requestData = {
  certifyType: "",
  id: "",
  name: "",
  email: "",
  phone: "",
};

function SearcIdComponent() {
  const [certifyType, setCertifyType] = useState('1');
  const [name, setName] = useState('');
  const [emailHead, setEmailHead] = useState('');
  const [emailDetail, setEmailDetail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [userEmail, setUserEmail] = useState('');


  const [mobilePrefix, setMobilePrefix] = useState('010');
  const [mobile1, setMobile1] = useState('');
  const [mobile2, setMobile2] = useState('');
  const [requestData, setRequestData] = useState('');

  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5분 (300초)
  const [verificationTimeout, setVerificationTimeout] = useState(null);

  const handleCertifyTypeChange = (e) => {
    setCertifyType(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailHeadChange = (e) => {
    setEmailHead(e.target.value);
  };

  const handleEmailDetailChange = (e) => {
    setEmailDetail(e.target.value);
  };

  const handleEmailDomainChange = (e) => {
    setEmailDomain(e.target.value);
  };

  const handleMobilePrefixChange = (e) => {
    setMobilePrefix(e.target.value);
  };

  const handleMobile1Change = (e) => {
    setMobile1(e.target.value);
  };

  const handleMobile2Change = (e) => {
    setMobile2(e.target.value);
  };

  const handleSendVerificationCode = (e) => {
    // 실제 인증 코드 전송 로직 작성
    console.log('인증 코드 전송 timeRemaining' + timeRemaining);
    // setTimeRemaining(300); // 남은 시간 5분으로 초기화
    
    // 이름 필수 입력 체크
    if (!name.trim()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    // 휴대폰 번호 필수 입력 체크
    if (!mobile1.trim() || !mobile2.trim()) {
      alert('휴대폰 번호를 입력해 주세요.');
      return;
    }

    // 이메일 주소 
    if (emailDomain === "") {
      setUserEmail(`${emailHead}@${emailDetail}`);
    } else {
      setUserEmail(`${emailHead}@${emailDomain}`);
    }

    setRequestData(certifyType, "", name, userEmail, mobilePrefix+mobile1.trim()+mobile2.trim())
    // 구분(1: 이메일, 2: 핸드폰), 고객명, 이메일 핸드폰 검수
    searchId(requestData)
            .then((data) => {
              // 고객정보 확인, 인증번호 얻기, sms 발송
              send_sms(data);
              console.log("sms 발송");
            })
            .catch((error) => {
              console.log("회원명, 핸드폰번호 확인하시기 바랍니다.");

              return;
            });
    

    clearVerificationTimer();             // 초기화
    setIsVerificationCodeSent(true);      // 활성화
    startVerificationTimer();             // 타이머 카운트 시작
  };

  const startVerificationTimer = () => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          clearVerificationTimer();
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setVerificationTimeout(timer);
  };

  const handleVerifyCode = () => {
    // 실제 인증 코드 확인 로직 작성
    console.log('인증 코드 확인');
    // 인증 성공 시
    setTimeRemaining(300); // 남은 시간 5분으로 초기화
    clearVerificationTimer();
    // 인증 실패 시
    // setIsVerificationCodeSent(false);
    // setTimeRemaining(300);
  };

  const clearVerificationTimer = () => {
    console.log('verificationTimeout' + verificationTimeout);
    clearInterval(verificationTimeout);   // 타이머 중단  5분, 4분59초,~~~ 중단
    console.log('verificationTimeout' + verificationTimeout);
    setIsVerificationCodeSent(false);     // false 화면 인증코드 입력, 타이머 안보이기
    setTimeRemaining(300);                // 화면에 보이는 시간 clear
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 form 데이터를 서버로 전송하는 로직 작성
    if (certifyType == '1') {
        console.log("aaaa")
    } else {


    }


    console.log({
      certifyType,
      name,
      email: `${emailHead}@${emailDetail} or  ${emailDomain}`,
      mobile: `${mobilePrefix}-${mobile1}-${mobile2}`,
    });
  };

  // return (
  //   <div id="wrap">
  //     <div id="container">
  //       <div id="content">
  //         <h1 className="skip">아이디찾기</h1>
  //         <div className="mbrSec mbrSch mbrSchID">
  //           <form name="pageForm" method="post" onSubmit={handleSubmit}>
  //             <input type="hidden" id="userName" name="userName" />
  //             <input type="hidden" id="userEmail" name="userEmail" />
  //             <input type="hidden" id="userPhone" name="userPhone" />
  //             <input type="hidden" id="Certifytype" name="Certifytype" value="1" />
  //             <div className="mbrCertifyData mbrCertifyDataGG">
  //               <fieldset>
  //                 <legend>회원가입시 등록된 핸드폰 번호/이메일로만 찾을 수 있습니다.</legend>
  //                 <div className="mbrTplBox">
  //                   <ul className="mbrTplData1">
  //                     <li>
  //                       <div className="option">
  //                         <input
  //                           type="radio"
  //                           id="lb_certifytype_email"
  //                           name="lb_certifytype"
  //                           value="1"
  //                           checked={certifyType === '1'}
  //                           onChange={handleCertifyTypeChange}
  //                         />
  //                         <label htmlFor="lb_certifytype_email">이메일 인증</label>
  //                         <input
  //                           type="radio"
  //                           id="lb_certifytype_mobile"
  //                           name="lb_certifytype"
  //                           value="2"
  //                           checked={certifyType === '2'}
  //                           onChange={handleCertifyTypeChange}
  //                         />
  //                         <label htmlFor="lb_certifytype_mobile">휴대폰 인증</label>
  //                       </div>
  //                     </li>
  //                     <li id="devName">
  //                       <label htmlFor="lb_name" className="title">
  //                         이름
  //                       </label>{' '}
  //                       <input
  //                         type="text"
  //                         name="lb_name"
  //                         id="lb_name"
  //                         maxLength={50}
  //                         style={{ width: '308px', imeMode: 'active' }}
  //                         className="ipText"
  //                         value={name}
  //                         onChange={handleNameChange}
  //                       />
  //                     </li>
  //                     {certifyType === '1' && (
  //                       <>
  //                       <li id="devEmailForm">
  //                         <label htmlFor="lb_email_head" className="title">
  //                           이메일 주소
  //                         </label>
  //                         <input
  //                           type="text"
  //                           name="lb_email_head"
  //                           id="lb_email_head"
  //                           maxLength={30}
  //                           style={{ width: '80px' }}
  //                           className="ipText"
  //                           value={emailHead}
  //                           onChange={handleEmailHeadChange}
  //                         />
  //                         <span className="delimiter">@</span>
  //                         <input
  //                           type="text"
  //                           name="lb_email_detail"
  //                           id="lb_email_detail"
  //                           maxLength={20}
  //                           style={{ width: '80px' }}
  //                           className="ipText"
  //                           title="e-메일 서비스 입력"
  //                           value={emailDetail}
  //                           onChange={handleEmailDetailChange}
  //                         />
  //                         <select
  //                           title="e-메일 사업자"
  //                           name="lb_email_select"
  //                           id="lb_email_select"
  //                           className="ipSelect ipSelect_1"
  //                           value={emailDomain}
  //                           onChange={handleEmailDomainChange}
  //                         >
  //                           <option value="">선택하세요</option>
  //                           <option value="naver.com">naver.com</option>
  //                           <option value="hanmail.net">hanmail.net</option>
  //                           <option value="nate.com">nate.com</option>
  //                           <option value="daum.net">daum.net</option>
  //                           <option value="gmail.com">gmail.com</option>
  //                           <option value="dreamwiz.com">dreamwiz.com</option>
  //                           <option value="etc">직접입력</option>
  //                         </select>
  //                       </li>
  //                       </>
  //                     )}
  //                     {certifyType === '2' && (
  //                       <>
  //                       <li style={{ display: 'block' }} id="devMobileForm">
  //                         <label htmlFor="lb_mobile1" className="title">
  //                           휴대폰 번호
  //                         </label>
  //                         <select
  //                           title="휴대폰 국번"
  //                           name="lb_mobile1"
  //                           id="lb_mobile1"
  //                           style={{ width: '94px' }}
  //                           className="ipSelect"
  //                           value={mobilePrefix}
  //                           onChange={handleMobilePrefixChange}
  //                         >
  //                           <option value="010">010</option>
  //                           <option value="011">011</option>
  //                           <option value="016">016</option>
  //                           <option value="017">017</option>
  //                           <option value="018">018</option>
  //                           <option value="019">019</option>
  //                         </select>
  //                         <span className="delimiter">-</span>
  //                         <input
  //                           type="text"
  //                           name="lb_mobile2"
  //                           id="lb_mobile2"
  //                           value={mobile1}
  //                           maxLength="4"
  //                           title="휴대폰 앞자리"
  //                           style={{ width: '94px' }}
  //                           className="ipText"
  //                           onChange={handleMobile1Change}
  //                         />
  //                         <span className="delimiter">-</span>
  //                         <input
  //                           type="text"
  //                           name="lb_mobile3"
  //                           id="lb_mobile3"
  //                           value={mobile2}
  //                           maxLength="4"
  //                           title="휴대폰 뒷자리"
  //                           style={{ width: '94px' }}
  //                           className="ipText"
  //                           onChange={handleMobile2Change}
  //                         />
  //                         <button onClick={handleSendVerificationCode}>인증 코드 받기</button>
                            
  //                       </li>
  //                       <li>
                          
  //                         <input type="text" placeholder="인증 코드 입력" />
  //                         <button onClick={handleVerifyCode}>확인</button>
  //                         {isVerificationCodeSent && (
  //                           <>
  //                               남은 시간: {Math.floor(timeRemaining / 60)}분 {timeRemaining % 60}초
  //                           </>
  //                         )}
  //                       </li>
  //                       </>
  //                       )}
                        
                        

  //                   </ul>
  //                 </div>
  //               </fieldset>
  //             </div>
  //             <p className="mbrBtnFunc">
  //               <span className="mbrBtn mbrBtnSearch_4">
  //                 <button type="submit">
  //                   <span>아이디찾기</span>
  //                 </button>
  //               </span>
  //             </p>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //     <hr />
  //   </div>
  // );
  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">아이디찾기</h1>
        <form name="pageForm" method="post" onSubmit={handleSubmit}>
          {/* <input type="hidden" id="userName" name="userName" />
          <input type="hidden" id="userEmail" name="userEmail" />
          <input type="hidden" id="userPhone" name="userPhone" /> */}
          <input type="hidden" id="Certifytype" name="Certifytype" value="2" />
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-2">
                <input
                  type="radio"
                  id="lb_certifytype_email"
                  name="lb_certifytype"
                  value="1"
                  checked={certifyType === '1'}
                  onChange={handleCertifyTypeChange}
                  className="mr-2"
                />
                이메일 인증
              </label>
              <label className="block font-medium mb-2">
                <input
                  type="radio"
                  id="lb_certifytype_mobile"
                  name="lb_certifytype"
                  value="2"
                  checked={certifyType === '2'}
                  onChange={handleCertifyTypeChange}
                  className="mr-2"
                />
                휴대폰 인증
              </label>
            </div>
            <div>
              <label htmlFor="lb_name" className="block font-medium mb-2">
                이름
              </label>
              <input
                type="text"
                name="lb_name"
                id="lb_name"
                maxLength={50}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            {certifyType === '1' && (
              <div>
                <label htmlFor="lb_email_head" className="block font-medium mb-2">
                  이메일 주소
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="lb_email_head"
                    id="lb_email_head"
                    maxLength={30}
                    className="border border-gray-300 rounded-md px-4 py-2 w-1/3 mr-2"
                    value={emailHead}
                    onChange={handleEmailHeadChange}
                  />
                  <span className="font-medium">@</span>
                  <input
                    type="text"
                    name="lb_email_detail"
                    id="lb_email_detail"
                    maxLength={30}
                    className="border border-gray-300 rounded-md px-4 py-2 w-1/3 mx-2"
                    value={emailDetail}
                    onChange={handleEmailDetailChange}
                  />
                  <select
                    name="lb_email_domain"
                    id="lb_email_domain"
                    className="border border-gray-300 rounded-md px-4 py-2 w-1/3 ml-2"
                    value={emailDomain}
                    onChange={handleEmailDomainChange}
                  >
                    <option value="">직접입력</option>
                    <option value="naver.com">naver.com</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="naver.com">naver.com</option>
                   </select>
                </div>
              </div>
            )}
            {certifyType === '2' && (
              <>
              <div>
                <label htmlFor="lb_mobile" className="block font-medium mb-2">
                  휴대폰 번호
                </label>
                <div className="flex items-center">
                  <select
                    name="lb_mobile_prefix"
                    id="lb_mobile_prefix"
                    className="border border-gray-300 rounded-md px-4 py-2 w-1/4 mr-2"
                    value={mobilePrefix}
                    onChange={handleMobilePrefixChange}
                  >
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="016">016</option>
                    <option value="017">017</option>
                    <option value="018">018</option>
                    <option value="019">019</option>
                  </select>
                  <input
                    type="text"
                    name="lb_mobile1"
                    id="lb_mobile1"
                    maxLength={4}
                    className="border border-gray-300 rounded-md px-4 py-2 w-1/4 mx-2"
                    value={mobile1}
                    onChange={handleMobile1Change}
                  />
                  <span className="font-medium">-</span>
                  <input
                    type="text"
                    name="lb_mobile2"
                    id="lb_mobile2"
                    maxLength={4}
                    className="border border-gray-300 rounded-md px-4 py-2 w-1/4 mx-2"
                    value={mobile2}
                    onChange={handleMobile2Change}
                  />
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                    onClick={handleSendVerificationCode}
                  >
                    인증번호 (재)발송
                    
                  </button>
                </div>
                <div>
                          
                           <input type="text" className="border border-gray-300 rounded-md px-4 py-2 w-1/4 mx-2" placeholder="인증 코드 입력" />
                           <button type="button"
                              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                              onClick={handleVerifyCode}>확인</button>
                           {isVerificationCodeSent && (
                             <>
                                 남은 시간: {Math.floor(timeRemaining / 60)}분 {timeRemaining % 60}초
                             </>
                           )}
                         </div>
              </div>
              </>
            )}

            
          </div>
          <p className="mbrBtnFunc">
                 <span className="mbrBtn mbrBtnSearch_4">
                   <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
                     <span>아이디찾기</span>
                   </button>
                 </span>
          </p>
        </form>
      </div>
    </div>
  );
}
export default SearcIdComponent;
