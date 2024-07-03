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
    
    const navigate = useNavigate()

    // const handleChangeUser = (e) => {
    //     user[e.target.name] = e.target.value
    //     setUser({...user})
    // }

    const handleChangeUser = (e) => {
        let { name, value } = e.target;
        if (name === "userPhone") {
            value = value.replace(/\-/g, "");
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }
        user[name] = value;
        setUser({...user});
    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        return regex.test(password);
    };

    const validateForm = () => {

        if (!user.userId.trim()) {
            alert('아이디는 필수 입력 항목입니다.');
            return false;
        }

        const userIdRegex = /^[a-zA-Z0-9]+$/;
        if (!userIdRegex.test(user.userId)) {
            alert('아이디는 영문자와 숫자로만 구성되어야 합니다.');
            return false;
        }

        if (!user.userPassword.trim()) {
            alert('비밀번호는 필수 입력 항목입니다.');
            return false;
        }

        if (!validatePassword(user.userPassword)) {
            alert("대문자(영문자), 소문자(영문자), 숫자, 특수문자 각각 한문자 이상 포함하는 8자 이상 비밀번호를 정하셔야 합니다.");
            return false;
        }

        if (!user.userEmail.trim()) {
            alert('이메일은 필수 입력 항목입니다.');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(user.userEmail)) {
            alert('이메일 형식이 올바르지 않습니다.');
            return false;
        }

        if (!user.userName.trim()) {
            alert('성명은 필수 입력 항목입니다.');
            return false;
        }

        if (!user.userPhone.trim()) {
            alert('연락처는 필수 입력 항목입니다.');
            return false;
        }
        return true;
        
    };

    const handleJoin = () => { 
        console.info("들어왔니?")
        if (validateForm()) {
            const userInfo = { ...user, userPhone: user.userPhone.replace(/\-/g, "") };
            console.log(userInfo)
            join(userInfo).then(result => {
                alert('회원 가입 되셨습니다. 로그인 하시기 바랍니다.');
                console.log(result)
                navigate({pathname:'../../login'})
            }).catch(e=>{
                console.error(e)
            })
        }
    }

    return (
      <>
        <div className="text-5xl pb-16 font-blackHans text-center">
          <div>회원 가입</div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8 border-t-2 border-slate-100">
          <div className="space-y-6">
            <div className="flex items-center">
              <label className="block font-medium text-slate-700 mr-4 w-24">
                아이디 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userId"
                placeholder="id"
                name="userId"
                autoComplete="id"
                value={user.userId}
                onChange={handleChangeUser}
                required
                className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="block font-medium text-slate-700 mr-4 w-24 whitespace-nowrap">
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
            <div className="flex items-center">
              <label className="block font-medium text-slate-700 mr-4 w-24">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userEmail"
                placeholder="email"
                name="userEmail"
                autoComplete="email"
                value={user.userEmail}
                onChange={handleChangeUser}
                required
                className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="block font-medium text-slate-700 mr-4 w-24">
                성명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userName"
                placeholder="name"
                name="userName"
                autoComplete="name"
                value={user.userName}
                onChange={handleChangeUser}
                required
                className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="block font-medium text-slate-700 mr-4 w-24">
                닉네임
              </label>
              <input
                type="text"
                id="userNick"
                placeholder="Nick"
                name="userNick"
                autoComplete="nickname"
                value={user.userNick}
                onChange={handleChangeUser}
                className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
              />
            </div>
            <div className="flex items-center">
              <label className="block font-medium text-slate-700 mr-4 w-24">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userPhone"
                placeholder="phone"
                name="userPhone"
                autoComplete="phone"
                value={user.userPhone}
                onChange={handleChangeUser}
                required
                className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
              />
            </div>
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
      </>
    );
    


    // return (
    //   <>
    //     <div className="text-5xl pb-16 font-blackHans text-center">
    //       <div>회원 가입</div>
    //     </div>
    //     <div className="bg-white shadow-md rounded-lg p-8 border-t-2 border-slate-400">
    //       <div className="divide-y divide-slate-200">
    //         <div className="mb-6 flex items-center">
    //           <label className="block font-medium text-slate-700 mr-4 w-24">
    //             아이디 <span className="text-red-500">*</span>
    //           </label>
    //           <input
    //             type="text"
    //             id="userId"
    //             placeholder="id"
    //             name="userId"
    //             autoComplete="id"
    //             value={user.userId}
    //             onChange={handleChangeUser}
    //             required
    //             className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //           />
    //         </div>
    //         <div className="mb-6 flex items-center">
    //           <label className="block font-medium text-slate-700 mr-4 w-24 whitespace-nowrap">
    //             비밀번호 <span className="text-red-500">*</span>
    //           </label>
    //           <div className="flex items-center flex-1">
    //             <input
    //               type={showPassword ? "text" : "password"}
    //               id="userPassword"
    //               placeholder="password"
    //               name="userPassword"
    //               autoComplete="password"
    //               value={user.userPassword}
    //               onChange={handleChangeUser}
    //               required
    //               className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //             />
    //             <div className="ml-4">
    //               <input
    //                 type="checkbox"
    //                 checked={showPassword}
    //                 onChange={() => setShowPassword(!showPassword)}
    //                 className="form-checkbox h-3 w-3 text-indigo-600"
    //               />
    //               <label htmlFor="showPassword" className="ml-2 font-medium text-slate-700">
    //                 {showPassword ? "표시" : "숨김"}
    //               </label>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="mb-6 flex items-center">
    //           <label className="block font-medium text-slate-700 mr-4 w-24">
    //             이메일 <span className="text-red-500">*</span>
    //           </label>
    //           <input
    //             type="text"
    //             id="userEmail"
    //             placeholder="email"
    //             name="userEmail"
    //             autoComplete="email"
    //             value={user.userEmail}
    //             onChange={handleChangeUser}
    //             required
    //             className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //           />
    //         </div>
    //         <div className="mb-6 flex items-center">
    //           <label className="block font-medium text-slate-700 mr-4 w-24">
    //             성명 <span className="text-red-500">*</span>
    //           </label>
    //           <input
    //             type="text"
    //             id="userName"
    //             placeholder="name"
    //             name="userName"
    //             autoComplete="name"
    //             value={user.userName}
    //             onChange={handleChangeUser}
    //             required
    //             className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //           />
    //         </div>
    //         <div className="mb-6 flex items-center">
    //           <label className="block font-medium text-slate-700 mr-4 w-24">
    //             닉네임
    //           </label>
    //           <input
    //             type="text"
    //             id="userNick"
    //             placeholder="Nick"
    //             name="userNick"
    //             autoComplete="nickname"
    //             value={user.userNick}
    //             onChange={handleChangeUser}
    //             className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //           />
    //         </div>
    //         <div className="mb-6 flex items-center">
    //           <label className="block font-medium text-slate-700 mr-4 w-24">
    //             연락처 <span className="text-red-500">*</span>
    //           </label>
    //           <input
    //             type="text"
    //             id="userPhone"
    //             placeholder="phone"
    //             name="userPhone"
    //             autoComplete="phone"
    //             value={user.userPhone}
    //             onChange={handleChangeUser}
    //             required
    //             className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //           />
    //         </div>
    //         <div className="flex justify-end">
    //           <button
    //             className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700"
    //             onClick={handleJoin}
    //           >
    //             회원 가입
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </>
    // );
    
    
    // return (
    //     <>
    //       <div className="text-5xl pb-16 font-blackHans">
    //           <div>회원 가입</div>
    //       </div>
    //       <div className="bg-white shadow-md rounded-lg p-8">
    //         <div className="divide-y divide-slate-200">
    //           <div className="mb-6 flex items-center">
    //             <label className="block font-medium text-slate-700 mr-4 w-24">
    //               아이디 <span className="text-red-500">*</span>
    //             </label>
    //             <input
    //               type="text"
    //               id="userId"
    //               placeholder="id"
    //               name="userId"
    //               autoComplete="id"
    //               value={user.userId}
    //               onChange={handleChangeUser}
    //               required
    //               className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //             />
    //           </div>
    //           <div className="mb-6 flex items-center">
    //             <label className="block font-medium text-slate-700 mr-4 w-24 whitespace-nowrap">
    //               비밀번호 <span className="text-red-500">*</span>
    //             </label>
    //             <div className="flex items-center flex-1">
    //               <input
    //                 type={showPassword ? "text" : "password"}
    //                 id="userPassword"
    //                 placeholder="password"
    //                 name="userPassword"
    //                 autoComplete="password"
    //                 value={user.userPassword}
    //                 onChange={handleChangeUser}
    //                 required
    //                 className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //               />
    //               <div className="ml-4">
    //                 <input
    //                   type="checkbox"
    //                   checked={showPassword}
    //                   onChange={() => setShowPassword(!showPassword)}
    //                   className="form-checkbox h-3 w-3 text-indigo-600"
    //                 />
    //                 <label
    //                   htmlFor="showPassword"
    //                   className="ml-2 font-medium text-slate-700"
    //                 >
    //                   {showPassword ? "표시" : "숨김"}
    //                 </label>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="mb-6 flex items-center">
    //             <label className="block font-medium text-slate-700 mr-4 w-24">
    //               이메일 <span className="text-red-500">*</span>
    //             </label>
    //             <input
    //               type="text"
    //               id="userEmail"
    //               placeholder="email"
    //               name="userEmail"
    //               autoComplete="email"
    //               value={user.userEmail}
    //               onChange={handleChangeUser}
    //               required
    //               className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //             />
    //           </div>
    //           <div className="mb-6 flex items-center">
    //             <label className="block font-medium text-slate-700 mr-4 w-24">
    //               성명 <span className="text-red-500">*</span>
    //             </label>
    //             <input
    //               type="text"
    //               id="userName"
    //               placeholder="name"
    //               name="userName"
    //               autoComplete="name"
    //               value={user.userName}
    //               onChange={handleChangeUser}
    //               required
    //               className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //             />
    //           </div>
    //           <div className="mb-6 flex items-center">
    //             <label className="block font-medium text-slate-700 mr-4 w-24">
    //               닉네임
    //             </label>
    //             <input
    //               type="text"
    //               id="userNick"
    //               placeholder="Nick"
    //               name="userNick"
    //               autoComplete="nickname"
    //               value={user.userNick}
    //               onChange={handleChangeUser}
    //               className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //             />
    //           </div>
    //           <div className="mb-6 flex items-center">
    //             <label className="block font-medium text-slate-700 mr-4 w-24">
    //               연락처 <span className="text-red-500">*</span>
    //             </label>
    //             <input
    //               type="text"
    //               id="userPhone"
    //               placeholder="phone"
    //               name="userPhone"
    //               autoComplete="phone"
    //               value={user.userPhone}
    //               onChange={handleChangeUser}
    //               required
    //               className="bg-slate-100 border-slate-300 rounded-md p-2 flex-1"
    //             />
    //           </div>
    //           <div className="flex justify-end">
    //             <button
    //               className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700"
    //               onClick={handleJoin}
    //             >
    //               회원 가입
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </>
    // );
}  
export default JoinComponent;
