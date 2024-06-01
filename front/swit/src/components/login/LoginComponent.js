import { useEffect, useState } from "react";
import { API_SERVER_HOST, postOne, getOne } from "../../api/loginApi"

const initState = { 
    user_id:'', 
    user_password:''
}

const initStateNaver = { 
    naverURL:''
}

const LoginComponent =() => {
    const [user, setUser] = useState({...initState})
    const [naver, setNaver] = useState({...initStateNaver})

    // 로그인 화면 최초 Host 호출
    useEffect(() => {
        console.info("aaa");
        getOne().then(data => setNaver(data))
    },[])

    const handleChangeUser = (e) => {
        user[e.target.name] = e.target.value
        setUser({...user})
    }

    const handleClickLogin = () => { 
        console.log(user)
        postOne(user).then(result => {
            console.log(result)
            setUser({...initState})
        }).catch(e=>{
            console.error(e)
        })
    }

    return (
        <>
            <div className="divide-y divide-slate-100">
                <div className="mb-4">
                    <label className="block mb-1">아이디</label>
                    <input type={"text"} placeholder="아이디" name='user_id' className="w-full border border-gray-300 p-2 rounded" value={user.user_id} onChange={handleChangeUser}></input>
                    
                </div>
                <div className="mb-4">
                    <label className="block mb-1">비밀번호</label>
                    <input type={"password"} placeholder="비밀번호" name='user_password' className="w-full border border-gray-300 p-2 rounded" value={user.user_password} onChange={handleChangeUser}></input>
                </div>
                <div className="mb-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded w-full" onClick={handleClickLogin}>로그인</button>
                </div>
                <div className="mb-4 flex flex-wrap">
                    <a href={naver.naverURL}>
                        <img
                            src={`${process.env.PUBLIC_URL}/naver.svg`}
                            className='Naver'
                            alt='React'
                        />
                    </a>
                    <a href="https://github.com/wnsgur1855">
                        <img
                            
                            src={`${process.env.PUBLIC_URL}/free-icon-kakao-talk-3669973.png`}
                            className='Kakao'
                            alt='React'
                        />
                    </a>
                </div>
            </div>
        </>
    )

}
export default LoginComponent;
