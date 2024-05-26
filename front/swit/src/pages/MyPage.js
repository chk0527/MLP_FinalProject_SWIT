import BasicLayout from "../layouts/BasicLayout";
import MyProfileComponent from "../components/myPage/MyProfileComponent";

const MyPage = () => {
    return (
        <BasicLayout>
            <div className="text-3xl">
                <div>마이페이지</div>
            </div>
            <MyProfileComponent/>
        </BasicLayout>
       
    )
}

export default MyPage;