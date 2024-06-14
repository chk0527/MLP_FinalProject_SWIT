import SearchIdComponent from "../../components/login/SearchIdComponent";
import BasicLayout from "../../layouts/BasicLayout";

const SearchId = () => {
    return (
        <BasicLayout>
            <div className="text-2xl font-medium ">
                <div>아이디 찾기</div>
            </div>
            <SearchIdComponent/>
        </BasicLayout>
        
    )
}
export default SearchId;