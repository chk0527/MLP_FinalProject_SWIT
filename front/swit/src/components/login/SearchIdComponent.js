import React, { useState, useEffect } from 'react';

function SearcIdComponent() {
  const [certifyType, setCertifyType] = useState('1');
  const [name, setName] = useState('');
  const [emailHead, setEmailHead] = useState('');
  const [emailDetail, setEmailDetail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');

  const [mobilePrefix, setMobilePrefix] = useState('010');
  const [mobile1, setMobile1] = useState('');
  const [mobile2, setMobile2] = useState('');

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

  const handleSendVerificationCode = () => {
    // 실제 인증 코드 전송 로직 작성
    console.log('인증 코드 전송');
    setTimeRemaining(300); // 남은 시간 5분으로 초기화
    clearVerificationTimer();
    setIsVerificationCodeSent(true);
    startVerificationTimer();
  };

  const startVerificationTimer = () => {
    const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
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
    clearInterval(verificationTimeout);
    setIsVerificationCodeSent(false);
    setTimeRemaining(300);
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

  return (
    <div id="wrap">
      <div id="container">
        <div id="content">
          <h1 className="skip">아이디찾기</h1>
          <div className="mbrSec mbrSch mbrSchID">
            <form name="pageForm" method="post" onSubmit={handleSubmit}>
              <input type="hidden" id="userName" name="userName" />
              <input type="hidden" id="userEmail" name="userEmail" />
              <input type="hidden" id="userPhone" name="userPhone" />
              <input type="hidden" id="Certifytype" name="Certifytype" value="1" />
              <div className="mbrCertifyData mbrCertifyDataGG">
                <fieldset>
                  <legend>회원가입시 등록된 핸드폰 번호/이메일로만 찾을 수 있습니다.</legend>
                  <div className="mbrTplBox">
                    <ul className="mbrTplData1">
                      <li>
                        <div className="option">
                          <input
                            type="radio"
                            id="lb_certifytype_email"
                            name="lb_certifytype"
                            value="1"
                            checked={certifyType === '1'}
                            onChange={handleCertifyTypeChange}
                          />
                          <label htmlFor="lb_certifytype_email">이메일 인증</label>
                          <input
                            type="radio"
                            id="lb_certifytype_mobile"
                            name="lb_certifytype"
                            value="2"
                            checked={certifyType === '2'}
                            onChange={handleCertifyTypeChange}
                          />
                          <label htmlFor="lb_certifytype_mobile">휴대폰 인증</label>
                        </div>
                      </li>
                      <li id="devName">
                        <label htmlFor="lb_name" className="title">
                          이름
                        </label>{' '}
                        <input
                          type="text"
                          name="lb_name"
                          id="lb_name"
                          maxLength={50}
                          style={{ width: '308px', imeMode: 'active' }}
                          className="ipText"
                          value={name}
                          onChange={handleNameChange}
                        />
                      </li>
                      {certifyType === '1' && (
                        <li id="devEmailForm">
                          <label htmlFor="lb_email_head" className="title">
                            이메일 주소
                          </label>
                          <input
                            type="text"
                            name="lb_email_head"
                            id="lb_email_head"
                            maxLength={30}
                            style={{ width: '80px' }}
                            className="ipText"
                            value={emailHead}
                            onChange={handleEmailHeadChange}
                          />
                          <span className="delimiter">@</span>
                          <input
                            type="text"
                            name="lb_email_detail"
                            id="lb_email_detail"
                            maxLength={20}
                            style={{ width: '80px' }}
                            className="ipText"
                            title="e-메일 서비스 입력"
                            value={emailDetail}
                            onChange={handleEmailDetailChange}
                          />
                          <select
                            title="e-메일 사업자"
                            name="lb_email_select"
                            id="lb_email_select"
                            className="ipSelect ipSelect_1"
                            value={emailDomain}
                            onChange={handleEmailDomainChange}
                          >
                            <option value="">선택하세요</option>
                            <option value="naver.com">naver.com</option>
                            <option value="hanmail.net">hanmail.net</option>
                            <option value="nate.com">nate.com</option>
                            <option value="daum.net">daum.net</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="dreamwiz.com">dreamwiz.com</option>
                            <option value="etc">직접입력</option>
                          </select>
                        </li>
                      )}
                      {certifyType === '2' && (
                        <li style={{ display: 'block' }} id="devMobileForm">
                          <label htmlFor="lb_mobile1" className="title">
                            휴대폰 번호
                          </label>
                          <select
                            title="휴대폰 국번"
                            name="lb_mobile1"
                            id="lb_mobile1"
                            style={{ width: '94px' }}
                            className="ipSelect"
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
                          <span className="delimiter">-</span>
                          <input
                            type="text"
                            name="lb_mobile2"
                            id="lb_mobile2"
                            value={mobile1}
                            maxLength="4"
                            title="휴대폰 앞자리"
                            style={{ width: '94px' }}
                            className="ipText"
                            onChange={handleMobile1Change}
                          />
                          <span className="delimiter">-</span>
                          <input
                            type="text"
                            name="lb_mobile3"
                            id="lb_mobile3"
                            value={mobile2}
                            maxLength="4"
                            title="휴대폰 뒷자리"
                            style={{ width: '94px' }}
                            className="ipText"
                            onChange={handleMobile2Change}
                          />
                          <button onClick={handleSendVerificationCode}>인증 코드 받기</button>
                            {isVerificationCodeSent && (
                            <>
                                <input type="text" placeholder="인증 코드 입력" />
                                <button onClick={handleVerifyCode}>인증 코드 확인</button>
                                남은 시간: {Math.floor(timeRemaining / 60)}분 {timeRemaining % 60}초
                            </>
                            )}
                        </li>
                        )}
                    </ul>
                  </div>
                </fieldset>
              </div>
              <p className="mbrBtnFunc">
                <span className="mbrBtn mbrBtnSearch_4">
                  <button type="submit">
                    <span>아이디찾기</span>
                  </button>
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}
export default SearcIdComponent;
