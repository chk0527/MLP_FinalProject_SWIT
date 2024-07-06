import logo from "../../img/logoBlack.png";

const Footer = () => {
  return (
    <div className="flex justify-center bg-gray-100 w-full py-12 text-gray-500">
      <div className="w-5/6 flex items-center justify-between">
      <div>
        <div className="w-16 mb-4">
          <img src={logo}></img>
        </div>
        <div className="w-96">Contact github.com/chk0527/MLP_FinalProject_SWIT</div>
        <div>Copyright SWit. All rights reserved</div>
      </div>
      <div className="flex justify-between w-450" >
        {/* <p>이용약관</p>
        <p>운영정책</p>
        <p>개인정보처리방침</p>
        <p>고객센터</p> */}
      </div>
      </div>
    </div>
  );
};

export default Footer;
