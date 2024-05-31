import { Link } from "react-router-dom";
import image from "../../img/logoWhite.png"

const BasicMenu = () => {
    return (
        <nav id='navbar' className="flex bg-blue-300">
            <div className="w-1/5 A4CEF5  text-white font-bold p-4">
                <Link to={'/'}><Link to={'/'}><img className="w-4/5" src={image} style={{width:"100px", padding:"20"}}></img></Link>
</Link>
            </div> 
            <div className="w-4/5 flex justify-end A4CEF5">
                <ul className="flex p-4 text-white font-bold">
                    <li className="pr-6 text-1xl">
                        <Link to={'/studyDetail'}>스터디</Link>
                    </li>
                    <li className="pr-6 text-1xl">
                        <Link to={'/'}>스터디 장소</Link>
                    </li>
                    <li className="pr-6 text-1xl">
                        <Link to={'/exam'}>시험 및 채용</Link>
                    </li>
                    <li className="pr-6 text-1xl">
                        <Link to={'/'}>Q&A</Link>
                    </li>
                    <li>
                        --- 
                        {/* 아이콘 임포트? */}
                    </li>
                </ul>
            </div>
            {/* <div className="w-1/5 flex justify-end A4CEF5 p-4 font-medium">
                <div className="text-white text-sm m-1 rounded">
                    Login
                </div>
            </div> */}
        </nav>
    )
}

export default BasicMenu;