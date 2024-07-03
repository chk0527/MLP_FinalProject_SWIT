package com.swit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.extern.log4j.Log4j2;

@Configuration
@EnableWebSocketMessageBroker //WebSocket을 사용하고 메시지 브로커를 활성화하는 어노테이션
@Log4j2
public class ChattingConfig implements WebSocketMessageBrokerConfigurer {
//WebSocketMessageBrokerConfigurer: WebSocket 및 메시지 브로커를 구성하는 메소드를 재정의할 수 있도록 하는 인터페이스
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // stomp 접속 주소 url = ws://localhost:8080/ws, 프로토콜이 http가 아니고 ws
        // http: ws, https: wss
        log.info("백엔드 채팅 confing호출 성공@@@@@@@@@@@@@");
        registry.addEndpoint("/ws") // 연결될 엔드포인트
            .setAllowedOrigins("*") //모든 출처 허용(특정 origin만 허용하는것이 보안적인 측면에서 맞음)
            .withSockJS(); //SockJS지원 추가
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        //메시지 브로커의 Prefix를 등록하는 부분
      
        // 메시지를 구독(수신)하는 요청 엔드포인트
        registry.enableSimpleBroker("/sub");
        //클라이언트는 토픽을 구독할 시 /sub 경로로 요청해야 함
        

        // 메시지를 발행(송신)하는 엔드포인트
        registry.setApplicationDestinationPrefixes("/pub");
        //클라이언트는 메시지 발행 시 /pub 경로로 요청해야 함
    }
}
