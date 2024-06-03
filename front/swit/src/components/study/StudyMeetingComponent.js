import React, { useEffect, useState } from "react";
import "../../css/StudyMeetingComponent.css";

const StudyMeetingComponent = ({ studyUuid }) => {
  const [meetingUrl, setMeetingUrl] = useState("");

  useEffect(() => {
    const domain = "meet.jit.si";
    const url = `https://${domain}/${studyUuid}`;
    setMeetingUrl(url);
  }, [studyUuid]);

  const handleJoinMeeting = () => {
    window.open(meetingUrl, "_blank", "noopener noreferrer");
  };

  return (
    <div className="meeting-container">
      <h2>회의 참가</h2>
      <p>
        회의 URL:{" "}
        <a className="join-button-a" href={meetingUrl} target="_blank" rel="noopener noreferrer">
          {meetingUrl}
        </a>
      </p>
      <button className="join-button" onClick={handleJoinMeeting}>
        회의 참가
      </button>
    </div>
  );
};

export default StudyMeetingComponent;
