import React, { useEffect, useState } from "react";
import "../../css/GroupMeetingComponent.css"

const GroupMeetingComponent = () => {
  const [meetingUrl, setMeetingUrl] = useState("");

  useEffect(() => {
    const domain = "meet.jit.si";
    const roomName = `Meeting_${Math.random().toString(36).substring(2, 15)}`;
    const url = `https://${domain}/${roomName}`;
    setMeetingUrl(url);
  }, []);

  const handleJoinMeeting = () => {
    window.open(meetingUrl, "_blank", "noopener noreferrer");
  };

  return (
    <div className="">
      {/* <p>
        확인용 URL(추후제거):{" "}
        <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
          {meetingUrl}
        </a>
      </p> */}
      <button className="button1 rounded p-2 px-3 text-sm bg-blue-700 text-white hover:bg-blue-800" onClick={handleJoinMeeting}>
        회의 참가
      </button>
    </div>
  );
};

export default GroupMeetingComponent;
