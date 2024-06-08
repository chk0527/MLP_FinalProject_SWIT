// StudyChatComponent.js

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";

function StudyChatComponent({ studyNo }) {
    const stompClient = useRef(null); //웹소켓 클라이언트 객체 정의
    const [messages, setMessages] = useState([]); //메시지 상태 정의
    const [inputValue, setInputValue] = useState(''); //입력값 상태 정의

    const handleInputChange = (event) => { //입력 필드에 변화가 있을 경우 처리하는 함수
        setInputValue(event.target.value);
    };

    const connect = () => { //웹소켓 연결 함수
        const socket = new WebSocket(`ws://localhost:8181/ws`); //WebSocket객체 생성
        stompClient.current = Stomp.over(socket); //STOMP는 websocket기반으로 동작하기에 stompClient를 웹소켓 객체 위에 생성하는 함수
        //stompClient.current는 현재 stomp클라이언트를 가리키는 참조 (useRef)
        stompClient.current.connect({}, () => { //stompClient.current.connect 메소드를 호출하여 STOMP 클라이언트를 서버에 연결
          //첫 번째 인자 - 연결에 필요한 헤더 정보 여기서는 필요 없음
          //두 번째 인자 - 연결이 성공했을때의 콜백함수
            stompClient.current.subscribe(`/sub/chatroom/${studyNo}`, (message) => { ///sub/chatroom/${studyNo}경로 topic을 subscribe함
              //stompClient는 웹소켓(ws://localhost:8181/ws) 위에 등록되었기 때문에 엔드포인트만 작성하면 해당 주소의 엔드포인트로 연결)
              //두 번째 인자(message)는 메시지를 수신했을 때 콜백 되는 함수 -> message를 호출
                const newMessage = JSON.parse(message.body); //응답으로 받은 message의 본문(body)를 JSON형식으로 파싱하여 변수에 저장
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                //이전 메시지에 새로운 메시지를 추가하여 상태에 저장
            });
        });
    };

    const disconnect = () => { //웹소켓 연결 해제
        if (stompClient.current) {
            stompClient.current.disconnect();
        }
    };

    const fetchMessages = () => { //서버로부터 DB에 저장된 이전 메시지 내역을 불러오는 함수
      return axios.get(`http://localhost:8181/chat/${studyNo}`) //컨트롤러와 연결할 링크
          .then(response => {setMessages(response.data)}) //응답을 메시지 상태에 저장
          .catch(error => console.error('Error fetching messages:', error));
  };
  
//useEffect는 컴포넌트가 렌더링 될 때 특정 작업 실행하도록 해준다. 이 경우에는 웹소켓에 연결하고 이전 메시지를 불러오고 연결을 해제해줌
//studyNo가 변경될 때 실행
    useEffect(() => {
        connect();
        fetchMessages();
        return () => disconnect();
    }, [studyNo]);

    const sendMessage = () => { //메시지 전송 함수
      if (stompClient.current && inputValue) { //웹소켓 연결이 되어있고 메시지 입력값이 있다면 실행
          const body = { //전달할 데이터
              studyNo: studyNo, // studyNo를 포함해서 전달
              name: "테스트1", //추후 사용자 이름으로 수정필요
              message: inputValue //메시지 내용 
          };
          stompClient.current.send(`/pub/message`, {}, JSON.stringify(body)); //현재 구독중인 topic에 메시지 전송
          //첫 번째 인자 - 메시지를 보낼 대상 경로(웹 소켓위에 생성된 stompClient)
          //두 번째 인자 - 헤더 정보(현재 코드에선 사용하지 않음, 빈 배열)
          //세 번째 인자 - 메시지의 본문 body객체를 JSON형식으로 변환하여 전달
          setInputValue(''); //입력 필드 초기화
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
