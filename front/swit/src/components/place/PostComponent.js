import React from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import searchIcon from "../../img/search-icon.png";

const PostComponent = ({ setAddress }) => {
  const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setAddress(fullAddress); // setAddress를 호출하여 부모 컴포넌트 상태를 업데이트(중요!)
  };

  const handleClick = () => {
    open({ onComplete: handleComplete, left: 100, top: 15 });
  };

  return (
    <div>
      <button onClick={handleClick} className=" p-2 text-2xl font-GSans flex w-full text-black" type="button">
      <span className='px-4'>주소 검색</span> <img className="size-6" src={searchIcon}/>
      </button>
    </div>
  );
};

export default PostComponent;
