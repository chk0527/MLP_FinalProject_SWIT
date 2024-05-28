import BasicLayout from "../layouts/BasicLayout";
import MyProfileComponent from "../components/myPage/MyProfileComponent";
import MyStudyComponent from "../components/myPage/MyStudyComponent";
import MyFavoritesComponent from "../components/myPage/MyFavoritesComponent";
import MyPostComponent from "../components/myPage/MyPostComponent";
import { useParams } from "react-router-dom";

const MyPage = () => {
    const { user_id } = useParams();
    return (
        <BasicLayout>
            <div className="text-3xl">
                <div>마이페이지</div>
            </div>
            <MyProfileComponent user_id={user_id}></MyProfileComponent>
            <MyStudyComponent/>
            <MyFavoritesComponent/>
            <MyPostComponent/>
        </BasicLayout>       
    )
}

export default MyPage;