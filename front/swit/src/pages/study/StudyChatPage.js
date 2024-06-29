import StudyChatComponent from "../../components/study/StudyChatComponent";
import { useParams } from "react-router-dom";

const StudyChatPage = () => {
  const { studyNo } = useParams();
  return (
    <div className="rounded flex flex-col font-GSans">
      <p className="text-xl m-2">채팅</p>
      <StudyChatComponent studyNo={studyNo} />
    </div>
  );
};

export default StudyChatPage;
