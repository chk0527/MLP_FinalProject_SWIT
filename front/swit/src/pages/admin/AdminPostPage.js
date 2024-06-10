import BasicLayout from "../../layouts/BasicLayout";
import AdminUserComponent from "../../components/admin/AdminUserComponent";

const AdminPostPage = () => {
    return (
        <BasicLayout>
            <div className="text-3xl">
                <div>관리자 페이지 _ 게시글</div>
            </div>
            <AdminUserComponent />
        </BasicLayout>       
    )
}

export default AdminPostPage;