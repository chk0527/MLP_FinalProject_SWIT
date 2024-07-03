import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import "../../css/CustomScroll.css"; // 커스텀 스크롤바 스타일을 위한 CSS 파일 임포트
import { getUserIdFromToken, getUserNickFromToken } from "../../util/jwtDecode"; // JWT 디코드 유틸리티

function StudyChatComponent({ studyNo }) {
  const stompClient = useRef(null); // WebSocket 클라이언트를 참조하는 ref
  const [messages, setMessages] = useState([]); // 채팅 메시지들을 상태로 관리
  const [inputValue, setInputValue] = useState(""); // 입력된 메시지의 상태를 관리
  const chatContainerRef = useRef(null); // 채팅 메시지 컨테이너의 DOM 요소를 참조하는 ref

  // 입력 값이 변경될 때 호출되는 함수
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // 채팅 메시지 컨테이너를 스크롤하는 함수
  const scrollToBottom = () => {
    // chatContainerRef가 현재 DOM 요소를 참조하고 있다면, 스크롤을 컨테이너의 맨 아래로 이동
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "auto", // smooth에서 auto로 변경하여 초기 로드 시 맨 아래로 이동
    });
  };

  // WebSocket 연결을 설정하는 함수
  const connect = () => {
    const socket = new WebSocket(`ws://localhost:8181/ws`); // WebSocket 연결을 생성
    stompClient.current = Stomp.over(socket); // STOMP 프로토콜을 사용하는 클라이언트로 WebSocket 래핑
    stompClient.current.connect({}, () => {
      // 연결이 성공적으로 이루어지면 특정 채팅룸을 구독
      stompClient.current.subscribe(`/sub/chatroom/${studyNo}`, (message) => {
        const newMessage = JSON.parse(message.body); // 수신된 메시지를 JSON으로 파싱
        console.log("Received message:", newMessage); // 메시지를 콘솔에 출력
        // 새로운 메시지를 기존 메시지 배열의 끝에 추가
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    });
  };

  // WebSocket 연결을 해제하는 함수
  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect(); // STOMP 클라이언트의 연결 해제
    }
  };

  // 서버로부터 초기 메시지를 가져오는 함수
  const fetchMessages = () => {
    return axios
      .get(`http://localhost:8181/chat/${studyNo}`)
      .then((response) => {
        setMessages(response.data); // 서버로부터 받은 메시지를 상태에 설정
      })
      .catch((error) => console.error("Error fetching messages:", error));
  };

  // 컴포넌트가 마운트될 때 WebSocket 연결을 설정하고, 초기 메시지를 가져오는 효과
  useEffect(() => {
    connect(); // WebSocket 연결 설정
    fetchMessages(); // 초기 메시지 가져오기
    scrollToBottom(); // 컴포넌트가 마운트될 때 한 번 스크롤을 맨 아래로 이동
    return () => disconnect(); // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
  }, [studyNo]);

  // messages 상태가 변경될 때마다 호출되어 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지를 전송하는 함수
  const sendMessage = () => {
    if (stompClient.current && inputValue.trim()) {
      const userId = getUserIdFromToken();
      const body = {
        studyNo: studyNo,
        userId: userId, // 전송자 ID
        message: inputValue.trim(), // 입력된 메시지에서 앞뒤 공백 제거
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body)); // STOMP 클라이언트를 통해 메시지 전송
      setInputValue(""); // 입력 필드를 초기화
    }
  };

  // 엔터키 이벤트
  const pressEnter = (e) => {
    if (e.nativeEvent.isComposing) { // isComposing 이 true 이면 조합 중이므로 동작을 막는다.
      return;
    }
    if (e.key === "Enter" && e.shiftKey) {
      return;
    } else if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex text-sm flex-col border border-gray-300 max-w-96 rounded-lg shadow">
      {/* 채팅 메시지 컨테이너 */}
      <div className="p-4 bg-yellow-100 rounded-t-lg">
        <div
          className="flex-grow bg-white h-96 overflow-auto p-4 custom-scrollbar rounded"
          ref={chatContainerRef}
        >
          <div className="flex flex-col">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`mb-2 flex ${
                  item.userNick === getUserNickFromToken()
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="flex flex-col">
                  <div
                    className={`text-xs text-gray-500 ${
                      item.userNick === getUserNickFromToken()
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {item.userNick === getUserNickFromToken() ? "" : item.userNick}
                  </div>
                  <div
                    className={`flex items-end ${
                      item.userNick === getUserNickFromToken()
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`p-2 rounded shadow whitespace-pre-line max-w-48 break-all ${
                        item.userNick === getUserNickFromToken()
                          ? "bg-yellow-200"
                          : "bg-white"
                      }`}
                    >
                      {item.message}
                    </div>
                    <div className="text-2xs text-gray-500 ml-1 mr-1">
                      {new Date(item.createdDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 메시지 입력 필드와 전송 버튼 */}
      <div className="flex items-center border-t border-gray-300 bg-white py-2 px-4 rounded">
        <textarea
          onKeyDown={(e) => pressEnter(e)}
          rows="1"
          value={inputValue}
          onChange={handleInputChange}
          className="flex-grow resize-none border border-gray-300 rounded py-2 px-4 mr-2 focus:outline-none focus:ring focus:border-yellow-300"
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={sendMessage}
          className="bg-yellow-600 text-white rounded shadow p-2 hover:bg-yellow-700 focus:outline-none focus:ring"
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default StudyChatComponent;
