import React, { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import api from "../api/api";
import * as auth from "../api/loginApi"
import { useNavigate } from "react-router-dom";

export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

/*
    로그인
    - 로그인 체크
    - 로그인
    - 로그아웃
    로그인 세팅
    로그아웃 세팅
*/
const LoginContextProvider = ({ children }) => {

    // 상태
    // - 로그인 여부
    // - 유저 정보
    // - 권한 정보
    // - 아이디 저장
    // -------------------------------[state]---------------------------------
    // 로그인 여부
    const [isLogin, setLogin] = useState(false);
    // 유저 정보(권한 포함)
    const [userInfo, setUserInfo] = useState({})
    // 권한 정보
    const [roles, setRoles] = useState({isUser : false, isAdmin: false})
    // 아이디 저장
    // const [remberUserId, setRememberUserId] = useState()
    // 페이지 이동
    const navigate = useNavigate()
    // -----------------------------------------------------------------------
    
    // 로그인 체크
    // -- 쿠기에 jwt가 있는지 확인
    // -- jwt 로 사용자 정보를 요청
    const loginCheck = async () => {
        
        // 쿠키에서 jwt 토큰 가져오기
        const accessToken = Cookies.get("accessToken")
        console.info(`accessToken : ${accessToken}`);
        
        // header에 jwt 담기

        // accessToken (jwt) 이 없음
        if (!accessToken) {
            console.log(`쿠키에 accessToken(jwt)이 없음`);
            // 로그아웃 세팅
            logoutSetting()
            return 
        }
        // accessToken (jwt) 이 있음
        // header에 jwt 담기
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`

        // 사용자 정보 요청
        let response
        let data

        try {
            response = await auth.info()
        } catch (error) {
            console.log(`error : ${error}`)
            console.log(`status : ${response.status}`)
            return
        }

        

        data = response.data
        console.log(`data : ${data}`)

        // 인증 실패
        if (data == 'UNAUTHRIZED' || response.status == 401) {
            console.error(`accessToken(jwt) 이 만료되었거나 인증에 실패하였습니다.`)
            return
        }

        // 인증 성공, 로그인 세팅
        console.log(`accessToken(jwt) 토큰으로 사용자 인정정보 요청 성공!`)
        loginSetting(data, accessToken)

    }


    // 로그인
    const login = async (username, password) => {
        
        console.log(`username : ${username}`);
        console.log(`password : ${password}`);

        try {
            const response = await auth.login(username, password)
            const data = response.data
            const status = response.status
            const headers = response.headers
            const authorization = headers.authorization
            const accessToken = authorization.replace("Bearer ", "") // JWT

            console.log(`login data : ${data}`);
            console.log(`login status : ${status}`);
            console.log(`login headers : ${headers}`);
            console.log(`login jwt : ${accessToken}`);

            // .로그인 성공
            if ( status === 200) {
                // 쿠키에 accessToken(jwt) 저장
                Cookies.set("accessToken", accessToken)
                
                // 로그인 체크 ( /users/{userId} <--- userData)
                loginCheck()

                alert('로그인 성공')

                // 메이 페이지로 이동
                navigate("/")
            }

        } catch (error) {
            // .로그인 실패
            // - 아이디 또는 비밀번호가 일지 하지 않을때
            alert('로그인 실패!')

        }
        
    }

    // 로그 아웃
    const logout = () => {
        const check = window.confirm('로그아웃하시겠습니까?')

        if (check) {
            // 로그아웃 세팅
            logoutSetting()
            // 메인 페이지로 이동
            // navigate("/")
        }
    };
    
    
    // 로그인 세팅
    // userData, accessToken(jwt)
    const loginSetting = (userData, accessToken) => {
            const { userNo, userId, userRole, userNick } = userData
            
            console.log(`loginSetting userNo : ${userNo}`);
            console.log(`loginSetting userId : ${userId}`);
            console.log(`loginSetting userNick : ${userNick}`);
            console.log(`loginSetting userRole : ${userRole}`);
            
            // axios 객체의 header(Authorization : `Bearer ${accessToken}`)
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

            // 로그인 여부 : true
            setLogin(true)

            // 유저정보 세팅
            const updateUserInfo = { userNo, userId, userRole, userNick }
            setUserInfo(updateUserInfo)

            // 권한정보 세팅
            const updateRoles = { isUser : false, isAdmin : false }
            if (userRole == 'ROLE_USER') updateRoles.isUser = true
            if (userRole == 'ROLE_ADMIN') updateRoles.isAdmin = true
            setRoles(updateRoles)

    };

    // 로그아웃 세팅
    const logoutSetting = () => {
        // axios 헤더 초기화
        api.defaults.headers.common.Authorization = undefined;
        // 쿠키 초기화
        Cookies.remove("accessToken")
        // 로그인 여부 : false
        setLogin(false)
        // 유저 정보 초기화
        setUserInfo(null)
        // 권한 정보 초기화
        setRoles(null)
    };

    useEffect( () => {
        // // 3초 뒤에 로그인
        // setTimeout( () => {
        //     setLogin(true)
        // }, 3000)
    })
    return (
        <LoginContext.Provider value={{ isLogin, userInfo, roles, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;