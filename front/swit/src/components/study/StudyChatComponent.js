// StudyChatComponent.js

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";

function StudyChatComponent({ studyNo }) {
    const stompClient = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const connect = () => {
        const socket = new WebSocket(`ws://localhost:8181/ws`);
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            stompClient.current.subscribe(`/sub/chatroom/${studyNo}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        });
    };

    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.disconnect();
        }
    };

    const fetchMessages = () => {
      return axios.get(`http://localhost:8181/chat/${studyNo}`)
          .then(response => {setMessages(response.data)})
          .catch(error => console.error('Error fetching messages:', error));
  };
  

    useEffect(() => {
        connect();
        fetchMessages();
        return () => disconnect();
    }, [studyNo]);

    const sendMessage = () => {
      if (stompClient.current && inputValue) {
          const body = {
              studyNo: studyNo, // studyNo를 포함해서 전달
              name: "테스트1", //추후 사용자 이름으로 수정해야할듯
              message: inputValue //메시지 내용 
          };
          stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
          setInputValue('');
      }
  };

    return (
        <div className="flex flex-col h-96">
            {/* 메시지 표시 영역 */}
            <div className="flex-grow overflow-auto px-4 py-2 bg-gray-100">
                {messages.map((item, index) => (
                    <div key={index} className="mb-2">
                        <div className="bg-white p-2 rounded-lg shadow">{item.message}</div>
                    </div>
                ))}
            </div>
            {/* 입력 필드와 입력 버튼 */}
            <div className=" border-t border-gray-300 px-4 py-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-grow border rounded-lg py-2 px-4 mr-2 focus:outline-none"
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none my-3">입력</button>
            </div>
        </div>
    );
}

export default StudyChatComponent;
