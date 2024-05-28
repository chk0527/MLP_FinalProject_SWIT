// eslint-disable-next-line
import { Link } from "react-router-dom";

const LoginComponent = () => {
    return (
        <div>
            <div className="divide-y divide-slate-100">

                  <label for="M_ID" id="lb_id" class="label-form label-id">아이디</label>
						      <input type="text" placeholder="아이디" name="user_id" id="user_id" size="25" maxlength="25" title="아이디 입력" required/><br/>
						      <label for="M_PWD" id="lb_pw" class="label-form label-password">비밀번호</label>
						      <input type="password" class="inpTxt" placeholder="비밀번호" name="user_password" id="user_password" size="25" title="비밀번호 입력" required/><br/>
						      <button type="submit" class="login-button">로그인</button>

            </div>
        </div>
    )
}

export default LoginComponent;
