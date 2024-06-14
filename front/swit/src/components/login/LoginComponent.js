import React, { useContext, useEffect, useState, useCallback } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";
//import { useEffect, useState } from "react";
import { getOne } from "../../api/LoginApi"
import { Link } from 'react-router-dom';

const initState = { 
    username:'', 
    password:''
}

const initStateSnsUrl = { 
    naverURL:'',
    kakaoURL:''
}

const LoginComponent =() => {

    const [user, setUser] = useState({...initState})
    const [snsUrl, setSnsUrl] = useState({...initStateSnsUrl})
    // const navigate = useNavigate()

    const { login } = useContext(LoginContext)

    // 로그인 화면 최초 Host 호출
    useEffect(() => {
        // StrictMode(코드 검사 등) 에 의해 2회 실행 
        // (index.js 파일에서 StrictMode 지우면 1회 실행)
        
        // 완성 되기 전까지 snslogin 잠시 주석 처리
        getOne().then(data => setSnsUrl(data))
    },[])

    const handleChangeUser = (e) => {
        user[e.target.name] = e.target.value
        setUser({...user})
    }

    // const handleClickIdSearch = useCallback(() => {
    //     navigate({ pathname: '../../searchId' });
    // }, [navigate]);
    
    // const handleClickPasswordSearch = useCallback(() => {
    //     navigate({ pathname: '../../searchPw' });
    // }, [navigate]);

    const onLogin = (e) => {

        console.info(`${user.username} ${user.password}`) 

        login(user.username, user.password)
        
    }

    return (
        <>
            <div className="divide-y divide-slate-100">
                <div className="mb-4">
                    <label className="block mb-1">아이디</label>
                    <input type={"text"} placeholder="아이디" name='username' className="w-full border border-gray-300 p-2 rounded" value={user.username} onChange={handleChangeUser}></input>
                    
                </div>
                <div className="mb-4">
                    <label className="block mb-1">비밀번호</label>
                    <input type={"password"} placeholder="비밀번호" name='password' className="w-full border border-gray-300 p-2 rounded" value={user.password} onChange={handleChangeUser}></input>
                </div>
                <div className="mb-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={() => onLogin()}>로그인</button>
                </div>
                <div className="mb-4 flex flex-wrap">
                    <a href={snsUrl.naverURL}>
                        <img
                            src={`${process.env.PUBLIC_URL}/naver.svg`}
                            className='Naver'
                            alt='React'
                        />
                    </a>
                    <a href={snsUrl.kakaoURL}>
                        <img
                            
                            src={`${process.env.PUBLIC_URL}/free-icon-kakao-talk-3669973.png`}
                            className='Kakao'
                            alt='React'
                        />
                    </a>
                </div>
                <div>
                    <Link to={ "/login/searchId"}>
                        <p className="font-bold my-2">아이디 찾기</p>
                    </Link>
                    <Link to={"/login/searchPw"}>
                        <p className="font-bold my-2">비밀번호 찾기</p>
                    </Link>
                </div>
            </div>
        </>
    )

}

// const LoginComponent =() => {
    
//     const { login } = useContext(LoginContext)
    
//     const onLogin = (e) => {
//         e.preventDefault()

//         const form = e.target
//         const username = form.username.value
//         const password = form.password.value
//         console.info(`${username} ${password}`) 

//         login(username, password)
        
//     }

//     return (
//         <>
//             <div className="divide-y divide-slate-100">
//                 <form className="divide-y divide-slate-100" onSubmit={ (e) => onLogin(e)}>
//                     <div className="mb-4">
//                         <label>아이디</label>
//                         <input type="text"
//                                id="username"
//                                placeholder="id" 
//                                name="username"
//                                autoComplete="id"
//                                required

//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label>비밀번호</label>
//                         <input type="password"
//                                id="password"
//                                placeholder="password" 
//                                name="password"
//                                autoComplete="password"
//                                required
//                         />
//                     </div>
//                     <button className='btn btn--form btn-login'>
//                         Login
//                     </button>

                
//                 </form>
//             </div>
//         </>
//     )
// }
export default LoginComponent;
