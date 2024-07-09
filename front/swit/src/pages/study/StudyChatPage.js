import StudyChatComponent from "../../components/study/StudyChatComponent";
import { useParams } from "react-router-dom";

const StudyChatPage = () => {
  const { studyNo } = useParams();
  return (
    <div className="rounded font-GSans">
      <div className="flex">
        <p className="text-xl m-2 shadow-highlight">채팅</p>
      </div>
      <StudyChatComponent studyNo={studyNo} />
    </div>
  );
};

export default StudyChatPage;
