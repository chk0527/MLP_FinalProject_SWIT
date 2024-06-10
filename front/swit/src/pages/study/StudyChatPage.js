import StudyChatComponent from "../../components/study/StudyChatComponent";
import { useParams } from "react-router-dom";

const StudyChatPage = () => {
  const{ studyNo } = useParams();
    return (
      <div className="border border-gray-300 rounded-lg h-full flex flex-col">
                <StudyChatComponent studyNo={studyNo}/>
            </div>

    );
}

export default StudyChatPage;
