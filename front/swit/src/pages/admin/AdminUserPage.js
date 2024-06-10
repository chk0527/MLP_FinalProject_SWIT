import BasicLayout from "../../layouts/BasicLayout";
import AdminUserComponent from "../../components/admin/AdminUserComponent";

const AdminUserPage = () => {
    return (
        <BasicLayout>
            <div className="text-3xl">
                <div>관리자 페이지 _ 사용자</div>
            </div>
            <AdminUserComponent />
        </BasicLayout>       
    )
}

export default AdminUserPage;