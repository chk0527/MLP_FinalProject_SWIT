import { Outlet, useNavigate} from "react-router-dom";
import DateTestComponent from "../../components/study/TestComponent";
const DummyPage = () => {
    return(
        <div className="text-3xl">
            DummyPage
            <DateTestComponent/>
            <Outlet />
        </div>
    );
}

export default DummyPage;