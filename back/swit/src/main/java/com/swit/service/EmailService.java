package com.swit.service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

// import javax.mail.MessagingException;
// import javax.mail.internet.InternetAddress;
// import javax.mail.internet.MimeMessage;
// import javax.mail.internet.MimeMessage.RecipientType;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMessage.RecipientType;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.swit.domain.Confirm;
import com.swit.domain.User;
import com.swit.dto.ConfirmDTO;
import com.swit.dto.UserDTO;
import com.swit.repository.ConfirmRepository;
import com.swit.repository.UserRepository;
import com.swit.util.CustomAuditorAware;
// import server.yogoyogu.entity.member.EmailAuth;
// import server.yogoyogu.repository.Member.EmailAuthRepository;

@RequiredArgsConstructor
@Service
public class EmailService {

    // private final EmailAuthRepository emailAuthRepository;
    // private final ConfirmRepository confirmRepository;
    private final JavaMailSender emailSender; 
    // private final String ePw = createKey();

    public MimeMessage createMessage(String to, String randomString) throws MessagingException, UnsupportedEncodingException {

        MimeMessage message = emailSender.createMimeMessage();

        message.addRecipients(RecipientType.TO, to);// to => 보내는 대상
        message.setSubject("[Swit] 이메일 인증");// 메일 제목

        // 메일 내용
        // 아래에서 메일의 subtype 을 html 로 지정해주었기 때문인지 html 문법을 사용가능하다
        String msgg = "";
        msgg += "<div style='margin:200px;'>";
        msgg += "<h1> 안녕하세요 회원님 Swit 입니다.</h1>";
        msgg += "<br>";
        msgg += "<h1 style='color:blue;'>인증번호 안내 메일입니다.</h1>";
        msgg += "<br>";
        msgg += "<p>해당 이메일은 아이디/비밀번호 찾기를 위한 인증번호 안내 메일입니다.<p>";
        msgg += "<br>";
        msgg += "<p>하단 인증번호를 Swit 홈페이지 '인증 코드 입력' 칸에 입력하여 가입을 완료해주세요..<p>";
        msgg += "<br>";
        msgg += "<div align='center' style='border:1px solid black; font-family:verdana';>";
        msgg += "<h3 style='color:blue;'>인증 코드입니다.</h3>";
        msgg += "<div style='font-size:130%'>";
        msgg += "CODE : <strong>";
        msgg += randomString + "</strong><div><br/> "; // 인증번호 넣기
        msgg += "</div>";
        message.setText(msgg, "utf-8", "html");// 내용, charset 타입, subtype
        message.setFrom(new InternetAddress("fullstack21@naver.com", "swit admin"));

        return message;
    }

    public String createKey() {
        StringBuffer key = new StringBuffer();
        Random rnd = new Random();

        for (int i = 0; i < 8; i++) { // 인증코드 8자리
            int index = rnd.nextInt(3); // 0~2 까지 랜덤, rnd 값에 따라서 아래 switch 문이 실행됨

            switch (index) {
                case 0:
                    key.append((char) ((int) (rnd.nextInt(26)) + 97)); // 영어 소문자
                    // a~z (ex. 1+97=98 => (char)98 = 'b')
                    break;
                case 1:
                    key.append((char) ((int) (rnd.nextInt(26)) + 65)); // 영어 대문자
                    // A~Z
                    break;
                case 2:
                    key.append((rnd.nextInt(10))); // 숫자
                    // 0~9
                    break;
            }
        }

        return key.toString();
    }

    public String sendSimpleMessage(String to, String randomString) throws Exception {

        MimeMessage message = createMessage(to, randomString);

        try {// 예외처리
            emailSender.send(message); // 메일 발송
        } catch (MailException es) {
            es.printStackTrace();
            throw new IllegalArgumentException();
        }

        // EmailAuth emailAuth = new EmailAuth(ePw, to);
        // emailAuthRepository.save(emailAuth);
        return randomString; // 메일로 보냈던 인증 코드를 서버로 반환
    }
}