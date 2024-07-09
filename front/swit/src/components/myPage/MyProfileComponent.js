import { useState, useEffect, useContext, useCallback } from "react";
import {
  API_SERVER_HOST,
  getUserProfile,
  putUserProfile,
  postUserImage,
  getUserImage,
  checkDuplicate,
} from "../../api/UserApi";
import { FaPen } from "react-icons/fa";
import { LoginContext } from "../../contexts/LoginContextProvider";
import Cookies from "js-cookie";
import debounce from "lodash/debounce";

const initState = {
  userName: "",
  userNick: "",
  userPhone: "",
  userEmail: "",
  userPassword: "",
  userImage: "",
};

const MyProfileComponent = ({ userId }) => {
  const [user, setUser] = useState(initState);
  const [modalUser, setModalUser] = useState(initState);
  const [userImage, setUserImage] = useState(null);
  const [isSocialLogin, setIsSocialLogin] = useState(false);


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUserProfile(userId);
        setUser(userData);
        setModalUser({ ...userData });
        const imageUrl = await getUserImage(userId);
        setUserImage(imageUrl);

        if (
          userData &&
          (userData.userSnsConnect === "NAVER" ||
            userData.userSnsConnect === "KAKAO")
        ) {
          setIsSocialLogin(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInfo();
  }, [userId]);



  return (
    <>
      <div className="py-20 rounded shadow border w-full">
        <div className="flex justify-center items-center gap-10">
          <div className="w-52 h-52 rounded bg-gray-00 shadow flex items-center justify-center relative overflow-hidden">
            <img
              src={
                userImage
                  ? userImage
                  : `${process.env.PUBLIC_URL}/user0_blank.png`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center  gap-5">
            <div className="flex justify-between ">
              <div className="w-52 flex  items-center gap-9 ">
                <span className="text-gray-400">이름 </span>
                <span className="text-xl text-black">{user.userName}</span>
              </div>
              <div className="w-96 flex items-center gap-5">
                <span className="text-gray-400">전화번호 </span>
                <span className="text-xl text-black">
                  {user.userPhone.replace(
                    /(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
                    "$1-$2-$3"
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between ">
              <div className="w-52 flex items-center gap-5">
                <span className="text-gray-400">닉네임 </span>
                <span className="text-xl text-black">{user.userNick}</span>
              </div>
              <div className="w-96 flex items-center gap-9">
                <span className="text-gray-400">이메일 </span>
                <span className="text-xl text-black">{user.userEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfileComponent;
