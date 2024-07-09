package com.swit.service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

// import javax.mail.MessagingException;
// import javax.mail.internet.InternetAddress;
// import javax.mail.internet.MimeMessage;
// import javax.mail.internet.MimeMessage.RecipientType;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMessage.RecipientType;
import jakarta.mail.internet.InternetAddress;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

// import com.swit.service.MailServiceInter;

@Service
// public class MailService implements MailServiceInter {
public class MailService {

	@Autowired
	JavaMailSender emailsender; // Bean 등록해둔 MailConfig 를 emailsender 라는 이름으로 autowired

	private String ePw; // 인증번호

	
}