import BasicLayout from "../layouts/BasicLayout";
import MyProfileComponent from "../components/myPage/MyProfileComponent";
import MyStudyComponent from "../components/myPage/MyStudyComponent";
import MyFavoritesComponent from "../components/myPage/MyFavoritesComponent";
import MyPostComponent from "../components/myPage/MyPostComponent";
import { useParams } from "react-router-dom";

const MyPage = () => {
  const { userId } = useParams();
  return (
    <BasicLayout>
      <div className="flex flex-col items-center">
        <div className="w-full pr-2 font-GSans">마이페이지</div>
        <MyProfileComponent userId={userId} />
        <MyStudyComponent />
        <MyFavoritesComponent />
        <MyPostComponent />
      </div>
    </BasicLayout>
  );
};

export default MyPage;
