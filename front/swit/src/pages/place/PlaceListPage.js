import BasicLayout from "../../layouts/BasicLayout";
import PlaceListComponent from "../../components/place/PlaceListComponent";

const PlaceList = () => {
    return (
        <BasicLayout>
            <div className="text-5xl pb-16 font-blackHans">
                <div>스터디 장소</div>
            </div>
            <PlaceListComponent />
        </BasicLayout>       
    )
}

export default PlaceList;