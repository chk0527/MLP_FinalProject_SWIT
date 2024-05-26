import BasicLayout from "../layouts/BasicLayout";
import MyProfileComponent from "../components/myPage/MyProfileComponent";
import MyStudyComponent from "../components/myPage/MyStudyComponent";
import MyFavoritesComponent from "../components/myPage/MyFavoritesComponent";
import MyPostComponent from "../components/myPage/MyPostComponent";

const MyPage = () => {
    return (
        <BasicLayout>
            <div className="text-3xl">
                <div>마이페이지</div>
            </div>
            <MyProfileComponent/>
            <MyStudyComponent/>
            <MyFavoritesComponent/>
            <MyPostComponent/>
        </BasicLayout>       
    )
}

export default MyPage;