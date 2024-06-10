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
    <div className="meeting-container">
      <p>
        확인용 URL:{" "}
        <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
          {meetingUrl}
        </a>
      </p>
      <button className="join-button" onClick={handleJoinMeeting}>
        회의 참가
      </button>
    </div>
  );
};

export default GroupMeetingComponent;
