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
    
    const navigate = useNavigate()


    const handleChangeUser = (e) => {
        user[e.target.name] = e.target.value
        setUser({...user})
    }

    const handleJoin = () => { 

        // e.preventDefault()

        console.log(user)
        join(user).then(result => {
            console.log(result)
            navigate({pathname:'../../login'})

        }).catch(e=>{
            console.error(e)
        })
    }

    return (
        <>
            <div className="divide-y divide-slate-100">
                    <div className="mb-4">
                        <label>아이디</label>
                        <input type="text"
                               id="userId"
                               placeholder="id" 
                               name="userId"
                               autoComplete="id"
                               value={user.userId} onChange={handleChangeUser}
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
                               value={user.userPassword} onChange={handleChangeUser}
                               required
                        />
                    </div>
                    <div className="mb-4">
                        <label>이메일</label>
                        <input type="text"
                               id="userEmail"
                               placeholder="email" 
                               name="userEmail"
                               autoComplete="email"
                               value={user.userEmail} onChange={handleChangeUser}
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
                               value={user.userName} onChange={handleChangeUser}
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
                               value={user.userNick} onChange={handleChangeUser}
                        />
                    </div>
                    <div className="mb-4">
                        <label>연락처</label>
                        <input type="text"
                               id="userPhone"
                               placeholder="phone" 
                               name="userPhone"
                               autoComplete="phone"
                               value={user.userPhone} onChange={handleChangeUser}
                               required
                        />
                    </div>

                    <button className='btn btn--form btn-login' onClick={handleJoin}>
                        Join
                    </button>
            </div>
        </>
    )
}
export default JoinComponent;
