import LoginComponent from "../../components/login/LoginComponent";
import BasicLayout from "../../layouts/BasicLayout";
// import { useParams } from "react-router-dom";

const Login = () => {
    return (
        <BasicLayout>
            <div className="text-2xl font-medium ">
                <div>로그인</div>
            </div>
            <LoginComponent/>
        </BasicLayout>
        
    )
}
// IndexPage.js 부분 대처
// 02.pdf 21page Listpage.js 불필요(children 미사용) -> <Outlet> 연결 불필요
// ~ 23, 24page 불필요 (/todo 아래 하위 라우핑 작업)
export default Login;