import SearchPwComponent from "../../components/login/SearchPwComponent"
import BasicLayout from "../../layouts/BasicLayout";

const SearchPw = () => {
    return (
        <BasicLayout>
            <div className="text-2xl font-medium ">
                <div>비밀번호 찾기</div>
            </div>
            <SearchPwComponent/>
        </BasicLayout>
        
    )
}
export default SearchPw;