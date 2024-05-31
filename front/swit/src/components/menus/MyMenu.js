import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import profile from "../../img/profileEx.jpg";

const MyMenu = ({ callbackFn }) => {
  return (
      <AnimatePresence>
      <motion.aside
      initial={{ opacity:0, width:"250px",position:"absolute",top:0,right:0,height:"100lvh",zIndex:1,
      backgroundColor:"white",display:"flex",justifyContent:"center",borderLeft:"1px solid gray"
      }}
      animate={{ opacity:1,width:"384px"}}
      transition={{ duration: 0.5 }}>

    {/* <div className="absolute z-50 top-0 right-0 w-96 flex justify-center h-dvh  bg-white border-l border-gray-300"> */}
      <button className="absolute p-5 pb-10 right-0 " onClick={callbackFn}>
        🤍
      </button>
      <div className="pt-24">
        <div className="flex pb-2">
          <p className="pr-12 text-2xl">윈터님</p>
          <p className="pt-2">환영합니다.</p>
        </div>
        <img className="object-cover size-52" src={profile} alt="이미지"></img>
        <div className="text-2xl pt-8" >
          <Link to={"/"}>
            <p className="py-2">내 정보</p>
          </Link>
          <Link to={"/"}>
            <p className="py-2">스터디 만들기</p>
          </Link>
          <button className="py-2">내 스터디</button>
        </div>
      </div>
      <div className="absolute bottom-0 pb-24">
        <button>로그아웃</button>
      </div>
 

    </motion.aside></AnimatePresence>
  );
};
export default MyMenu;
