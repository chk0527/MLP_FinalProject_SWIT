import React, { useState, useEffect } from 'react';
import { searchId, searchId2, send_sms } from "../../api/LoginApi"

const initState = { 
  confirmNo:'',
  userId:'',
  confirmTarget:'',
  confirmPath:'',
  confirmNum:'',
  confirmLimitDate:''
}

function SearcPwComponent() {
  const [certifyType, setCertifyType] = useState('3');
  const [resultType, setResultType] = useState('1');
  
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [emailHead, setEmailHead] = useState('');
  const [emailDetail, setEmailDetail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [mobilePrefix, setMobilePrefix] = useState('010');
  const [mobile1, setMobile1] = useState('');
  const [mobile2, setMobile2] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const [confirmNum, setConfirmNum] = useState('');

  const [confirm, setConfirm] = useState({...initState})

  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5분 (300초)
  const [verificationTimeout, setVerificationTimeout] = useState('');

  useEffect(() => {
    if (emailDetail.trim()) {
      setUserEmail(`${emailHead.trim()}@${emailDetail.trim()}`);
    } else {
      setUserEmail(`${emailHead.trim()}@${emailDomain.trim()}`);
    }
  }, [emailHead, emailDetail, emailDomain]);

  const handleCertifyTypeChange = (e) => {
    setCertifyType(e.target.value);
    setIsVerified(false);
    setIsNotVerified(false);
  };

  const handleIdChange = (e) => {
    setId(e.target.value);
    setIsVerified(false);
    setIsNotVerified(false);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
    setIsVerified(false);
    setIsNotVerified(false);
  };

  const handleEmailHeadChange = (e) => {
    setEmailHead(e.target.value);
    setIsVerified(false);
    setIsNotVerified(false);
  };

  const handleEmailDetailChange = (e) => {
    setEmailDetail(e.target.value);
    setEmailDomain("");
    setIsVerified(false);
    setIsNotVerified(false);
  };

  const handleEmailDomainChange = (e) => {
    setEmailDomain(e.target.value);
    setEmailDetail("");
    setIsVerified(false);
    setIsNotVerified(false);
  };

  const handleMobilePrefixChange = (e) => {
    setMobilePrefix(e.target.value);
    setIsVerified(false);
    setIsNotVerified(false);
  };

  const handleMobile1Change = (e) => {
    setMobile1(e.target.value);
    setIsVerified(false);
    setIsNotVerified(false);
  };

  const handleMobile2Change = (e) => {
    setMobile2(e.target.value);
    setIsVerified(false);
    setIsNotVerified(false);
  };

  const handleConfirmNumChange = (e) => {
    setConfirmNum(e.target.value);
    setIsVerified(false);
    setIsNotVerified(false);

  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }
  
  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  }
  
  const handleSendVerificationCode = (e) => {
    // 실제 인증 코드 전송 로직 작성
    // console.log('인증 코드 전송 timeRemaining' + timeRemaining);
    // setTimeRemaining(300); // 남은 시간 5분으로 초기화
    setIsVerified(false);
    setIsNotVerified(false);
    

    if (!id.trim()) {
        alert('아이디를 입력해 주세요.');
        return;
    }

    // 이름 필수 입력 체크
    if (!name.trim()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (certifyType === '3' ) {
      
      // if (!emailHead.trim() || (!emailDetail.trim() && !emailDomain.trim())) {
      if (!emailHead.trim() || (!emailDetail.trim() && !emailDomain.trim())) {
          alert('이메일은 필수 입력 항목입니다.');
          return false;
      }
      if (!/\S+@\S+\.\S+/.test(userEmail)) {
        alert('이메일 형식이 올바르지 않습니다.');
        return false;
      }

    } else if (certifyType === '4' ) {
      // 휴대폰 번호 필수 입력 체크
      if (!mobile1.trim() || !mobile2.trim()) {
        alert('휴대폰 번호를 입력해 주세요.');
        return;
      }
    }

    // 회원 여부 확인
    // 이메일 검증인 경우 이메일 발송 포함

    searchId(certifyType, id, name, userEmail, `${mobilePrefix}${mobile1.trim()}${mobile2.trim()}` )
    .then((response) => {
      
      console.log("sms 발송 nework에서 확인" + response.data);
      // 임시 처리
      setConfirm(response.data);
      console.log(`setConfirm ${confirm.confirmNo}`);
      console.log(`setConfirm ${confirm.userId}`);
      console.log(`setConfirm ${confirm.confirmTarget}`);
      console.log(`setConfirm ${confirm.confirmPath}`);
      console.log(`setConfirm ${confirm.confirmNum}`);
      console.log(`setConfirm ${confirm.confirmLimitDate}`);
      if (certifyType === '3' ) {
        console.log("이메일 인증번호 발송이 성공하였습니다.");
            
        clearVerificationTimer();             // 초기화
        setIsVerificationCodeSent(true);      // 활성화
        startVerificationTimer();             // 타이머 카운트 시작
      }
      // 고객정보 확인, 인증번호 얻기, sms 발송
      if (certifyType === '4' ) {
        send_sms(response.data)
        .then((result) => {
            console.log("SMS 인증번호 발송이 성공하였습니다.");
            
            clearVerificationTimer();             // 초기화
            setIsVerificationCodeSent(true);      // 활성화
            startVerificationTimer();             // 타이머 카운트 시작
        })
        .catch((error) => {
            console.log("인증번호 발송이 실패하였습니다.");
            return;
        });
      }

    })
    .catch((error) => {
      if (certifyType === '3' ) {
        alert("아이디, 회원명, 이메일을 확인해 주세요.");
        return; 
      } else {
        alert("아이디, 회원명, 핸드폰번호를 확인해 주세요.");
        return;
      }
    });
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

  // 이메일/핸드폰 인증번호 생성
  const handleVerifyCode = () => {
    // 실제 인증 코드 확인 로직 작성
    console.log('인증 코드 확인');

    if (!confirmNum.trim()) {
      alert('인증번호를 입력해 주세요.');
      return;
    }
    try {
      console.log(`try ${confirm.confirmNo}`);
      console.log(`try ${confirm.userId}`);
      console.log(`try ${confirm.confirmTarget}`);
      console.log(`try ${confirm.confirmPath}`);
      console.log(`try ${confirmNum}`);
      console.log(`try ${confirm.confirmLimitDate}`);
      searchId2({
        confirmNo: confirm.confirmNo,
        userId: confirm.userId,
        confirmTarget: confirm.confirmTarget,
        confirmPath: confirm.confirmPath,
        confirmNum: confirmNum,
        confirmLimitDate: confirm.confirmLimitDate
      })
      .then((response) => {
        console.log("인증번호 일치입니다.");
        setConfirm(response.data);
        setIsVerificationCodeSent(false);
        alert("인증번호 일치입니다.");
        // 인증 성공 시
        // setTimeRemaining(300); // 남은 시간 5분으로 초기화
        // clearVerificationTimer();
        setIsVerified(true);
      })
      .catch((error) => {
        alert("인증번호 불일치 합니다. 다시 입력해 주세요");
        setIsNotVerified(true);
        return;
      });
    } catch (error) {
      alert("인증번호 불일치 합니다. 다시 입력해 주세요");
      setIsNotVerified(true);
    }
    
    // 인증 실패 시
    // setIsVerificationCodeSent(false);
    // setTimeRemaining(300);
  };

  const clearVerificationTimer = () => {
    clearInterval(verificationTimeout);   // 타이머 중단  5분, 4분59초,~~~ 중단
    setIsVerificationCodeSent(false);     // false 화면 인증코드 입력, 타이머 안보이기
    setTimeRemaining(300);                // 화면에 보이는 시간 clear
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(`${confirm.userId}`);

    // 여기서 form 데이터를 서버로 전송하는 로직 작성
    // "1" 이메일 검증, "2" 핸드폰 검증



    if (certifyType == '3') {
        console.log("이메일 검증")

        if (!confirm.userId.trim()) {
            alert('이메일 인증 하시기 바랍니다.');
            return;
        }

        if (!id.trim()) {
            alert('아이디를 입력해 주세요.');
            return;
        }
        // 이름 필수 입력 체크
        if (!name.trim()) {
          alert('이름을 입력해 주세요.');
          return;
        }
        if (!emailHead.trim() || (!emailDetail.trim() && !emailDomain.trim())) {
            alert('이메일은 필수 입력 항목입니다.');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(userEmail)) {
          alert('이메일 형식이 올바르지 않습니다.');
          return false;
        }


        searchId(certifyType, id, name, userEmail, `${mobilePrefix}${mobile1.trim()}${mobile2.trim()}` )
        .then((response) => {

          console.log("이메일 검증 nework에서 확인" + response.data);
          // 고객정보 확인, 이메일 발송
          // send_email(response.data)
        })
        .catch((error) => {
          console.log("아이디, 회원명, 이메일을 확인해 주세요.");
          return;
        });

        if (`${confirm.confirmPath}` == '1' || `${confirm.confirmPath}` == '3') {  
            console.log("이메일 인증번호 검증")

        } else {
            console.log("비밀번호 찾기가 이메일인지 확인해 주세요.");
            return;
        }

    } else {
        if (!confirm.userId.trim()) {
            alert('SMS 인증 하시기 바랍니다.');
            return;
        }

        if (!id.trim()) {
            alert('아이디를 입력해 주세요.');
            return;
        }
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

        if (`${confirm.confirmPath}` == '2' || `${confirm.confirmPath}` == '4' ) {
                console.log("핸드폰 인증번호 검증")
        
        } else {
            console.log("비밀번호 찾기가 핸드폰인지 확인해 주세요.");
            return;
        }
    }
    setResultType("2");
  };

  return (
    <>
    <div className="text-5xl pb-16 font-blackHans text-center">
          <div>비밀번호 찾기</div>
    </div>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8 border-t-2 border-slate-200">
        <form name="pageForm" method="post" onSubmit={handleSubmit}>
          <input type="hidden" id="Certifytype" name="Certifytype" value="2" />
          <input type="hidden" id="resultType" name="resultType" value="1" />
          {resultType === '1' && (
            <>
              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2">
                    <input
                      type="radio"
                      id="lb_certifytype_email"
                      name="lb_certifytype"
                      value="1"
                      checked={certifyType === '3'}
                      onChange={handleCertifyTypeChange}
                      className="mr-2"
                    />
                    이메일 인증
                    &emsp;
                    <input
                      type="radio"
                      id="lb_certifytype_mobile"
                      name="lb_certifytype"
                      value="2"
                      checked={certifyType === '4'}
                      onChange={handleCertifyTypeChange}
                      className="mr-2"
                    />
                    휴대폰 인증
                  </label>
                </div>
                <div>
                  <label htmlFor="lb_name" className="block font-medium mb-2">
                    아이디
                  </label>
                  <input
                    type="text"
                    name="lb_id"
                    id="lb_id"
                    maxLength={50}
                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    value={id}
                    onChange={handleIdChange}
                  />
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
                {certifyType === '3' && (
                  <>
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
                        className="border border-gray-300 rounded-md px-4 py-2 w-1/4 mr-2"
                        value={emailHead}
                        onChange={handleEmailHeadChange}
                      />
                      <span className="font-medium">@</span>
                      <input
                        type="text"
                        name="lb_email_detail"
                        id="lb_email_detail"
                        maxLength={30}
                        className="border border-gray-300 rounded-md px-4 py-2 w-1/4 mx-2"
                        value={emailDetail}
                        onChange={handleEmailDetailChange}
                      />
                      <select
                        name="lb_email_domain"
                        id="lb_email_domain"
                        className="border border-gray-300 rounded-md px-4 py-2 w-1/4 ml-2"
                        value={emailDomain}
                        onChange={handleEmailDomainChange}
                      >
                        <option value="">직접입력</option>
                        <option value="naver.com">naver.com</option>
                        <option value="gmail.com">gmail.com</option>
                        <option value="daum.net">daum.net</option>
                        <option value="naver.com">naver.com</option>
                      </select>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 w-1/4 px-4 rounded-md ml-2"
                        onClick={handleSendVerificationCode}
                      >
                        이메일 발송
                      </button>
                    </div>
                  </div>
                  </>
                )}
                {certifyType === '4' && (
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
                          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 w-1/4 rounded-md ml-2"
                          onClick={handleSendVerificationCode}
                        >
                          SMS 발송
                        </button>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center mt-4">
                      <input
                        type="text"
                        name="lb_confirmNum"
                        id="lb_confirmNum"
                        maxLength={certifyType === '3' ? 8 : 6}
                        placeholder="인증 코드 입력"
                        className="border border-gray-300 rounded-md px-4 py-2 w-1/2 mr-2"
                        value={confirmNum}
                        onChange={handleConfirmNumChange}
                      />
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                        onClick={handleVerifyCode}
                      >
                        확인
                      </button>
                      {isVerificationCodeSent && (
                        <div className="mt-2 px-4 text-gray-500">
                          남은 시간: {Math.floor(timeRemaining / 60)}분 {timeRemaining % 60}초
                        </div>
                      )}
                </div>
                {/* {isVerified && (
                  <div className="text-red-500 font-medium">
                    인증번호가 일치합니다.
                  </div>
                )}
                {isNotVerified && (
                  <div className="text-red-500 font-medium">
                    인증번호가 불일치합니다.
                  </div>
                )} */}
                <p className="mbrBtnFunc">
                <span className="mbrBtn mbrBtnSearch_4">
                   <button
                     type="submit"
                     className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                   >
                     <span>비밀번호 변경</span>
                   </button>
                 </span>
                </p>
              </div>
            </>
          )}
          {resultType === '2' && (
            <>
              <div>
                <label htmlFor="lb_password" className="block font-medium mb-2">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  name="lb_password"
                  id="lb_password"
                  maxLength={20}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <label htmlFor="lb_password_confirm" className="block font-medium mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  name="lb_password_confirm"
                  id="lb_password_confirm"
                  maxLength={20}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                />
              </div>
              <p className="mbrBtnFunc">
                <span className="mbrBtn mbrBtnSearch_4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                  >
                    <span>비밀번호 변경</span>
                  </button>
                </span>
              </p>
            </>
          )}
        </form>
      </div>
    </>
  )
  
}
export default SearcPwComponent;
