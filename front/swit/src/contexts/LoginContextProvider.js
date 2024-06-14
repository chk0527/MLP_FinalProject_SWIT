import React, { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import api from "../api/api";
import * as auth from "../api/loginApi";

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

        try {
            const response = await auth.info();
            const data = response.data;

            console.log(`data : ${data}`);

            if (data === 'UNAUTHORIZED' || response.status === 401) {
                console.error(`accessToken(jwt) 이 만료되었거나 인증에 실패하였습니다.`);
                refreshAccessToken();
                return;
            }

            console.log(`accessToken(jwt) 토큰으로 사용자 인증 정보 요청 성공!`);
            loginSetting(data, accessToken);
        } catch (error) {
            console.log(`error : ${error}`);
            refreshAccessToken();
        }
    };

    const refreshAccessToken = async () => {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
            logoutSetting();
            return;
        }

        try {
            const response = await api.post('/api/refresh', null, {
                headers: {
                    'RefreshToken': refreshToken
                }
            });

            const newAccessToken = response.headers['authorization'].replace("Bearer ", "");
            sessionStorage.setItem('accessToken', newAccessToken);
            Cookies.set("accessToken", newAccessToken);
            loginCheck();
        } catch (error) {
            console.log('Error refreshing access token:', error);
            logoutSetting();
        }
    };

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
            const refreshToken = headers['refreshtoken'];

            console.log(`login data : ${data}`);
            console.log(`login status : ${status}`);
            console.log(`login headers : ${headers}`);
            console.log(`login jwt : ${accessToken}`);

            if (status === 200) {
                Cookies.set("accessToken", accessToken);
                Cookies.set("refreshToken", refreshToken);
                sessionStorage.setItem("accessToken", accessToken);
                sessionStorage.setItem("refreshToken", refreshToken);
                loginCheck();
                alert('로그인 성공');
            }

        } catch (error) {
            alert('로그인 실패!');
        }
    };

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
        Cookies.remove("refreshToken");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        setLogin(false);
        sessionStorage.removeItem("isLogin");
        setUserInfo(null);
        setRoles(null);
        window.location.href = '/'; //메인페이지로 이동
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const accessToken = Cookies.get("accessToken");
            if (accessToken) {
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                const exp = payload.exp * 1000;
                const now = Date.now();
                const timeLeft = exp - now;

                if (timeLeft < 5 * 1000 && timeLeft > 0) { // Less than 5 seconds left but still valid
                    refreshAccessToken();
                }
            }
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, []);

    return (
        <LoginContext.Provider value={{ isLogin, userInfo, roles, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
}

export default LoginContextProvider;
