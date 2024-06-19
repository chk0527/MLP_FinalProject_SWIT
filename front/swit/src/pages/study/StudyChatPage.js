import StudyChatComponent from "../../components/study/StudyChatComponent";
import { useParams } from "react-router-dom";

const StudyChatPage = () => {
  const { studyNo } = useParams();
  return (
    <div className="border-2 border-gray-300 rounded flex flex-col">
      <StudyChatComponent studyNo={studyNo} />
    </div>
  );
};

export default StudyChatPage;
