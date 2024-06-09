import React, { useContext } from "react";
import { LoginContext } from "../../contexts/LoginContextProvider";

const JoinComponent =() => {
    const onJoin = () => {
        
    }

    return (
        <>
            <div className="divide-y divide-slate-100">
                <form className="divide-y divide-slate-100" onSubmit={ (e) => onJoin}>
                    <div className="mb-4">
                        <label>아이디</label>
                        <input type="text"
                               id="userId"
                               placeholder="id" 
                               name="userId"
                               autoComplete="id"
                               required

                        />
                    </div>
                    <div className="mb-4">
                        <label>비밀번호</label>
                        <input type="password"
                               id="userPassword"
                               placeholder="password" 
                               name="userPassword"
                               autoComplete="password"
                               required
                        />
                    </div>
                    <div className="mb-4">
                        <label>이메일</label>
                        <input type="text"
                               id="userEamil"
                               placeholder="eamil" 
                               name="userEamil"
                               autoComplete="eamil"
                               required
                        />
                    </div>
                    <div className="mb-4">
                        <label>성명</label>
                        <input type="text"
                               id="userName"
                               placeholder="name" 
                               name="userName"
                               autoComplete="name"
                               required
                        />
                    </div>
                    <div className="mb-4">
                        <label>닉네임</label>
                        <input type="text"
                               id="userNick"
                               placeholder="Nick" 
                               name="userNick"
                               autoComplete="Nick"
                               required
                        />
                    </div>
                    <div className="mb-4">
                        <label>연락처</label>
                        <input type="text"
                               id="userPhone"
                               placeholder="phone" 
                               name="userPhone"
                               autoComplete="phone"
                               required
                        />
                    </div>

                    <button className='btn btn--form btn-login'>
                        Join
                    </button>

                
                </form>
            </div>
        </>
    )
}
export default JoinComponent;
