import { Outlet, useNavigate} from "react-router-dom";
const DummyPage = () => {
    return(
        <div className="text-3xl">
            DummyPage
            <Outlet />
        </div>
    );
}

export default DummyPage;