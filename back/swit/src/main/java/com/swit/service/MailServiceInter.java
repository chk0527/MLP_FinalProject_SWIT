package com.swit.service;

import java.io.UnsupportedEncodingException;
import javax.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

public interface MailServiceInter {
    /**
     * 이메일 메시지 생성
     * @param to 수신자 이메일 주소
     * @return MimeMessage 객체
     * @throws MessagingException
     * @throws UnsupportedEncodingException
     */
    MimeMessage createMessage(String to) throws MessagingException, UnsupportedEncodingException;

    /**
     * 랜덤 인증 코드 생성
     * @return 8자리 영숫자 인증 코드
     */
    String createKey();

    /**
     * 이메일 발송
     * @param to 수신자 이메일 주소
     * @return 발송된 인증 코드
     * @throws Exception
     */
    String sendSimpleMessage(String to, String pw) throws Exception;
}
