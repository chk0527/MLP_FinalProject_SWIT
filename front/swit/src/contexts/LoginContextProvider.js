import React, { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import api from "../api/Api"
import * as auth from "../api/LoginApi"

export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

const LoginContextProvider = ({ children }) => {
    const [isLogin, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [roles, setRoles] = useState({ isUser: false, isAdmin: false });

    useEffect(() => {
        const loginStatus = sessionStorage.getItem("isLogin");
        if (loginStatus) {
            loginCheck();
        }
    }, []);

    const loginCheck = async () => {
        const accessToken = Cookies.get("accessToken");
        console.info(`accessToken : ${accessToken}`);

        if (!accessToken) {
            console.log(`쿠키에 accessToken(jwt)이 없음`);
            logoutSetting();
            return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        let response;
        let data;

        try {
            response = await auth.info();
        } catch (error) {
            console.log(`error : ${error}`);
            console.log(`status : ${response.status}`);
            return;
        }

        data = response.data;
        console.log(`data : ${data}`);

        if (data === 'UNAUTHRIZED' || response.status === 401) {
            console.error(`accessToken(jwt) 이 만료되었거나 인증에 실패하였습니다.`);
            return;
        }

        console.log(`accessToken(jwt) 토큰으로 사용자 인정정보 요청 성공!`);
        loginSetting(data, accessToken);
    }

    const login = async (username, password) => {
        console.log(`username : ${username}`);
        console.log(`password : ${password}`);

        try {
            const response = await auth.login(username, password);
            const data = response.data;
            const status = response.status;
            const headers = response.headers;
            const authorization = headers.authorization;
            const accessToken = authorization.replace("Bearer ", "");

            console.log(`login data : ${data}`);
            console.log(`login status : ${status}`);
            console.log(`login headers : ${headers}`);
            console.log(`login jwt : ${accessToken}`);

            if (status === 200) {
                Cookies.set("accessToken", accessToken);
                loginCheck();
                alert('로그인 성공');
            }

        } catch (error) {
            alert('아이디나 비밀번호가 틀렸습니다.');
        }
    }

    const logout = () => {
        const check = window.confirm('로그아웃하시겠습니까?');

        if (check) {
            logoutSetting();
        }
    };

    const loginSetting = (userData, accessToken) => {
        const { userNo, userId, userRole, userNick } = userData;

        console.log(`loginSetting userNo : ${userNo}`);
        console.log(`loginSetting userId : ${userId}`);
        console.log(`loginSetting userNick : ${userNick}`);
        console.log(`loginSetting userRole : ${userRole}`);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        setLogin(true);
        sessionStorage.setItem("isLogin", true);

        const updateUserInfo = { userNo, userId, userRole, userNick };
        setUserInfo(updateUserInfo);

        const updateRoles = { isUser: false, isAdmin: false };
        if (userRole === 'ROLE_USER') updateRoles.isUser = true;
        if (userRole === 'ROLE_ADMIN') updateRoles.isAdmin = true;
        setRoles(updateRoles);
    };

    const logoutSetting = () => {
        api.defaults.headers.common.Authorization = undefined;
        Cookies.remove("accessToken");
        setLogin(false);
        sessionStorage.removeItem("isLogin");
        setUserInfo(null);
        setRoles(null);
    };

    useEffect(() => {
        loginCheck();
    }, []);

    return (
        <LoginContext.Provider value={{ isLogin, userInfo, roles, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;
