import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useContext, useEffect, useState  } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";

const Callback = () => {
    const location = useLocation();
    const params = useParams()
    const { isLogin, login, logout } = useContext(LoginContext)
    const [loginStatus, setLoginStatus] = useState(false);
    const navigate = useNavigate();

    console.log('location:', location);
    console.log(params.tok);
    console.log(params.name);

    // URL 쿼리 파라미터 추출
    const { tok, name } = location.search.slice(1).split('&').reduce((acc, curr) => {
        const [key, value] = curr.split('=');
        acc[key] = value;
        return acc;
    }, {});
    
    console.log('tok:', tok);
    console.log('name:', name);

    // useEffect(() => {
    //     console.info("bef isLogin" + isLogin)
    //     login(name, tok.substring(12, 29))
    //     console.info("aft isLogin" + isLogin)
    //     if (isLogin) {
    //         navigate('/');
    //     } else {
    //         navigate('/login');
    //     }
    // },[])
    useEffect(() => {
        const handleLogin = () => {
            login(name, tok.substring(12, 29));
            setLoginStatus(isLogin);
        };

        handleLogin();
    }, [login, isLogin, navigate, name, tok]);

    useEffect(() => {
        console.info("bef isLogin" + isLogin)
        console.info("loginStatus" + loginStatus)
        if (loginStatus) {
            navigate('/login');
        } else {
            navigate('/');
        }
    }, [loginStatus, navigate])

    return (
        <>
        </>
    );
};

export default Callback;