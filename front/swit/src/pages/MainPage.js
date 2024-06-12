import BasicLayout from "../layouts/MainLayout";
import BannerComponent from "../components/main/BannerComponent";
import PlaceRecommend from "../components/main/PlaceRecommend";
import MyStudy from "../components/main/MyStudy";

const MainPage = () => {
    return (
        <BasicLayout>
            <BannerComponent />
            <MyStudy />
            <PlaceRecommend />
        </BasicLayout>
       
    )
}

export default MainPage;