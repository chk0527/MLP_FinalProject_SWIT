package com.swit.controller;

// import javax.mail.MessagingException;

import java.security.SecureRandom;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
// import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
// import org.w3c.dom.UserDataHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.swit.dto.ConfirmDTO;
import com.swit.dto.UserDTO;
import com.swit.service.ConfirmService;
import com.swit.service.EmailService;
import com.swit.service.UserService;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

@ResponseBody
@RestController
@RequestMapping("/api/confirm")
public class ConfirmController {

    final DefaultMessageService messageService;
    final UserService userService;
    final ConfirmService confirmService;
    final EmailService emailService;
    final String sendPhone;

    public ConfirmController(
        @Value("${api.sms.clientKey}") String smsClientKey,
        @Value("${api.sms.secretKey}") String snsClientSecret,
        @Value("${api.sms.sendPhone}") String sendPhone,
        UserService userService,
        EmailService emailService,
        ConfirmService confirmService) {
            this.messageService = NurigoApp.INSTANCE.initialize(smsClientKey, snsClientSecret, "https://api.coolsms.co.kr");
        this.userService = userService;
        this.confirmService = confirmService;
        this.emailService = emailService;
        this.sendPhone = sendPhone;
    }

    @GetMapping("userCheck")
    public ResponseEntity<?> userCheck(@RequestParam ("certifyType") String certifyType
                                      ,@RequestParam ("userId") String id
                                      ,@RequestParam ("userName") String userName
                                      ,@RequestParam ("userEmail") String userEmail
                                      ,@RequestParam ("userPhone") String userPhone) {
        System.out.println("userCheck start");

        System.out.println("certifyType  " + certifyType);
        System.out.println("id  " + id);
        System.out.println("name  " + userName);
        System.out.println("email  " + userEmail);
        System.out.println("phone  " + userPhone);


        ConfirmDTO confirmDTO = new ConfirmDTO();
        UserDTO userDTO = new UserDTO();

        if (certifyType.equals("1")) {  // 이메일로 회원 확인
            System.out.println("userCheck Email start");
            userDTO = confirmService.userCheck3(id
                                           ,userName
                                           ,userEmail
                                           ,"");

            // 고객이 존재 여부 확인
            if (userDTO.getUserId() == null || userDTO.getUserId().isEmpty()) {
                return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
            }

            confirmDTO.setUserId(userDTO.getUserId());
            // confirmDTO.setConfirmTarget("1"); // "1" 아이디 찾기 제외
            // "1" 이메일 id찾기, "2", SMS id찾기, "3" 이메일 pw 찾기, "4" SMS pw 찾기
            confirmDTO.setConfirmPath(certifyType);         
    
            String randomString = emailService.createKey();  // 랜덤 인증번호 생성
            System.out.println("Generated random string: " + randomString);
    
            confirmDTO.setConfirmNum(randomString);         // 8자리 소문자, 대문자, 숫자 랜덤 생성
    
            // 저장 후 PK(confirmNO)를 객체에 저장 후 front에 return
            confirmDTO = confirmService.confirmIns(confirmDTO);
            System.out.println("confirmDTO.getConfirmNo(): " + confirmDTO.getConfirmNo());
            System.out.println("confirmDTO: " + confirmDTO);

            try {
                // 이메일 발송
                String code = emailService.sendSimpleMessage(userEmail, randomString);
                System.out.println("인증코드 : " + code);

            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
             }
            
        } else if (certifyType.equals("2")) {  // 핸드폰 번호로 회원 확인
            System.out.println("userCheck Phone start");
            userDTO = confirmService.userCheck4(id
                                           ,userName
                                           ,userPhone
                                           ,"");

            // 고객이 존재 여부 확인
            if (userDTO.getUserId() == null || userDTO.getUserId().isEmpty()) {
                return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
            }
    
            confirmDTO.setUserId(userDTO.getUserId());
            // confirmDTO.setConfirmTarget("1"); // "1" 아이디 찾기
            // "1" 이메일 id찾기, "2", SMS id찾기, "3" 이메일 pw 찾기, "4" SMS pw 찾기
            confirmDTO.setConfirmPath(certifyType);
    
            String randomString = generateRandomSixDigitString();
            System.out.println("Generated random string: " + randomString);
    
            confirmDTO.setConfirmNum(randomString);         // 000000~999999 난수
    
            // 저장 후 PK(confirmNO)를 객체에 저장 후 front에 return
            confirmDTO = confirmService.confirmIns(confirmDTO);
            System.out.println("confirmDTO.getConfirmNo(): " + confirmDTO.getConfirmNo());
            System.out.println("confirmDTO: " + confirmDTO);
    
            // return new ResponseEntity<>(confirmDTO, HttpStatus.OK);

        } else if (certifyType.equals("3")) {  // 이메일로 회원 확인
            System.out.println("userCheck Email start");
            userDTO = confirmService.userCheck3(id
                                           ,userName
                                           ,userEmail
                                           ,"");

            // 고객이 존재 여부 확인
            if (userDTO.getUserId() == null || userDTO.getUserId().isEmpty()) {
                return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
            }

            confirmDTO.setUserId(userDTO.getUserId());
            // confirmDTO.setConfirmTarget("1"); // "1" 아이디 찾기
            // "1" 이메일 id찾기, "2", SMS id찾기, "3" 이메일 pw 찾기, "4" SMS pw 찾기
            confirmDTO.setConfirmPath(certifyType);
    
            String randomString = emailService.createKey();  // 랜덤 인증번호 생성
            System.out.println("Generated random string: " + randomString);
    
            confirmDTO.setConfirmNum(randomString);         // 8자리 소문자, 대문자, 숫자 랜덤 생성
    
            // 저장 후 PK(confirmNO)를 객체에 저장 후 front에 return
            confirmDTO = confirmService.confirmIns(confirmDTO);
            System.out.println("confirmDTO.getConfirmNo(): " + confirmDTO.getConfirmNo());
            System.out.println("confirmDTO: " + confirmDTO);

            try {
                // 이메일 발송
                String code = emailService.sendSimpleMessage(userEmail, randomString);
                System.out.println("인증코드 : " + code);

            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
             }
            
        } else if (certifyType.equals("4")) {  // 핸드폰 번호로 회원 확인
            System.out.println("userCheck Phone start");
            userDTO = confirmService.userCheck4(id
                                           ,userName
                                           ,userPhone
                                           ,"");

            // 고객이 존재 여부 확인
            if (userDTO.getUserId() == null || userDTO.getUserId().isEmpty()) {
                return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
            }
    
            confirmDTO.setUserId(userDTO.getUserId());
            // confirmDTO.setConfirmTarget("1"); // "1" 아이디 찾기
            // "1" 이메일 id찾기, "2", SMS id찾기, "3" 이메일 pw 찾기, "4" SMS pw 찾기
            confirmDTO.setConfirmPath(certifyType);
    
            String randomString = generateRandomSixDigitString();
            System.out.println("Generated random string: " + randomString);
    
            confirmDTO.setConfirmNum(randomString);         // 000000~999999 난수
    
            // 저장 후 PK(confirmNO)를 객체에 저장 후 front에 return
            confirmDTO = confirmService.confirmIns(confirmDTO);
            System.out.println("confirmDTO.getConfirmNo(): " + confirmDTO.getConfirmNo());
            System.out.println("confirmDTO: " + confirmDTO);
    
            // return new ResponseEntity<>(confirmDTO, HttpStatus.OK);

        } else {
            System.out.println("이메일/핸드폰 인증 구분 에러");
            return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(confirmDTO, HttpStatus.OK);

    }

    public static String generateRandomSixDigitString() {
        SecureRandom random = new SecureRandom();
        int randomNumber = random.nextInt(1000000);
        return String.format("%06d", randomNumber);
    }

    // 단일 메시지 발송 예제
    @PostMapping("send")
    public SingleMessageSentResponse sendOne(@RequestBody ConfirmDTO confirmDTO) {
    // public String sendOne(@RequestBody ConfirmDTO confirmDTO) {
        System.out.println("SingleMessageSentResponse start");

        UserDTO userDTO = userService.get(confirmDTO.getUserId());
        
        Message message = new Message();
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
 
        message.setFrom(sendPhone);
        message.setTo(userDTO.getUserPhone());
        message.setText("[Swit] 인증번호 " + confirmDTO.getConfirmNum()  + " 타인 유출로 인한 피해 주의");
        System.out.println("message " + message);

        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
        System.out.println("response " + response);

        return response;
    }

    // 핸드폰 발송 인증 번호 확인
    @PostMapping("userCheck2")
    public ResponseEntity<?> userCheck2(@RequestBody ConfirmDTO confirmDTO) {
        System.out.println("userCheck2 start=================");

        System.out.println("no  " + confirmDTO.getConfirmNo());
        System.out.println("Num  " + confirmDTO.getConfirmNum());
        System.out.println("date  " + confirmDTO.getConfirmLimitDate());

        // 제한일시 확인
        // 인증번호 확인
        confirmDTO = confirmService.confirmSel(confirmDTO);
        
        int confirmNo = confirmDTO.getConfirmNo();
        String confirmNum = confirmDTO.getConfirmNum();
        String ret = confirmDTO.getConfirmTarget();  // 0 :인증번호 정상, 1 : 시간초과, 2:인증번호 틀림
        
        System.out.println("confirmNo  " + confirmNo);
        System.out.println("confirmNum  " + confirmNum);
        System.out.println("ret  " + ret);
        // 기간 만료
        if (ret.equals("1")) {
            return new ResponseEntity<>(confirmDTO, HttpStatus.GONE);  // 410 기간만료 
        }

        if (ret.equals("2")) {
            System.out.println("confirmNum check " + confirmNum);
            return new ResponseEntity<>(confirmDTO, HttpStatus.FAILED_DEPENDENCY);  // 424 인증번호 다름 처리
        }
        // 정상
        return new ResponseEntity<>(confirmDTO, HttpStatus.OK);
    }

    @PostMapping("changeInfo")
    public ResponseEntity<?> changeInfo(@RequestBody UserDTO userDTO) {
        String userId = userDTO.getUserId();
        String userPassword = userDTO.getUserPassword();
        Integer ret = userService.changePw(userId, userPassword);
        System.out.println("changeInfo " + userPassword);

        if (ret == 0) {
            System.out.println("changeInfo OK");
        } else {
            System.out.println("changeInfo ERROR");

            return new ResponseEntity<>(userDTO, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(userDTO, HttpStatus.OK);

    }



}
