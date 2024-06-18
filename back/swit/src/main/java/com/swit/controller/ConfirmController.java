package com.swit.controller;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.model.Balance;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.model.StorageType;
import net.nurigo.sdk.message.request.MessageListRequest;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.MessageListResponse;
import net.nurigo.sdk.message.response.MultipleDetailMessageSentResponse;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

import org.springframework.beans.factory.annotation.Value;
// import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
// import org.w3c.dom.UserDataHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.swit.dto.ConfirmDTO;
import com.swit.dto.ConfirmReqDTO;
import com.swit.dto.UserDTO;
import com.swit.service.UserService;
import com.swit.service.ConfirmService;

import jakarta.persistence.Column;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Optional;
import java.security.SecureRandom;

@ResponseBody
@RestController
@RequestMapping("/api/confirm")
public class ConfirmController {

    final DefaultMessageService messageService;
    final UserService userService;
    final ConfirmService confirmService;
    final String sendPhone;

    public ConfirmController(
        @Value("${api.sms.clientKey}") String smsClientKey,
        @Value("${api.sms.secretKey}") String snsClientSecret,
        @Value("${api.sms.sendPhone}") String sendPhone,
        // UserService userService) {
        UserService userService,
        ConfirmService confirmService) {
            
        this.messageService = NurigoApp.INSTANCE.initialize(smsClientKey, snsClientSecret, "https://api.coolsms.co.kr");
        this.userService = userService;
        this.confirmService = confirmService;
        this.sendPhone = sendPhone;
    }
    
    // @GetMapping("userCheck")
    // // public ResponseEntity<?> userCheck(ConfirmReqDTO confirmReqDTO) {
    // public String userCheck(ConfirmReqDTO confirmReqDTO) {
    //     System.out.println("userCheck start");
    //     System.out.println("certifyType  " + confirmReqDTO.getCertifyType());
    //     System.out.println("id  " + confirmReqDTO.getId());
    //     System.out.println("name  " + confirmReqDTO.getName());
    //     System.out.println("email  " + confirmReqDTO.getEmail());
    //     System.out.println("phone  " + confirmReqDTO.getPhone());

    //     ConfirmDTO confirmDTO = new ConfirmDTO();
    //     UserDTO userDTO = new UserDTO();
        
    //     if (confirmReqDTO.getCertifyType() == "1") {  // 이메일로 회원 확인
    //         System.out.println("userCheck 2222 start");
    //         userDTO = confirmService.userCheck3(confirmReqDTO.getId()
    //                                        ,confirmReqDTO.getName()
    //                                        ,confirmReqDTO.getEmail()
    //                                        ,"LOCAL");
    //     } else if (confirmReqDTO.getCertifyType() == "2") {  // 핸드폰 번호로 회원 확인
    //         System.out.println("userCheck 3333 start");
    //         userDTO = confirmService.userCheck4(confirmReqDTO.getId()
    //                                        ,confirmReqDTO.getName()
    //                                        ,confirmReqDTO.getPhone()
    //                                        ,"LOCAL");
    //     } else {
    //         System.out.println("userCheck 4444 start");
    //         // return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
    //         return "bad1";
    //     }

    //     if (userDTO.getUserId() == null || userDTO.getUserId().isEmpty()) {
    //         System.out.println("userCheck 5555 start");
    //         // return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
    //         return "bad2";
    //     }

    //     confirmDTO.setUserId(userDTO.getUserId());
    //     confirmDTO.setConfirmTarget("1"); // "1" 아이디 찾기
    //     confirmDTO.setConfirmPath(confirmReqDTO.getCertifyType());         // "1" 이메일, "2", 핸드폰번호

    //     String randomString = generateRandomSixDigitString();
    //     System.out.println("Generated random string: " + randomString);

    //     confirmDTO.setConfirmNum(randomString);         // 000000~999999 난수

    //     confirmService.confirmIns(confirmDTO);
        
    //     // return new ResponseEntity<>(confirmDTO, HttpStatus.OK);
    //     return "OK";
    // }

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
        System.out.println("userCheck222 start");
        if (certifyType.equals("1")) {  // 이메일로 회원 확인
            System.out.println("userCheck3333 start");
            userDTO = confirmService.userCheck3(id
                                           ,userName
                                           ,userEmail
                                           ,"");
        } else if (certifyType.equals("2")) {  // 핸드폰 번호로 회원 확인
            System.out.println("userCheck4444 start");
            userDTO = confirmService.userCheck4(id
                                           ,userName
                                           ,userPhone
                                           ,"");
        } else {
            System.out.println("userCheck5555 start");
            return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
        }

        if (userDTO.getUserId() == null || userDTO.getUserId().isEmpty()) {
            return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
        }

        confirmDTO.setUserId(userDTO.getUserId());
        confirmDTO.setConfirmTarget("1"); // "1" 아이디 찾기
        confirmDTO.setConfirmPath(certifyType);         // "1" 이메일, "2", 핸드폰번호

        String randomString = generateRandomSixDigitString();
        System.out.println("Generated random string: " + randomString);

        confirmDTO.setConfirmNum(randomString);         // 000000~999999 난수

        // 저장 후 PK(confirmNO)를 객체에 저장 후 front에 return
        confirmDTO.setConfirmNo(confirmService.confirmIns(confirmDTO));

        return new ResponseEntity<>(confirmDTO, HttpStatus.OK);
    }

    public static String generateRandomSixDigitString() {
        SecureRandom random = new SecureRandom();
        int randomNumber = random.nextInt(1000000);
        return String.format("%06d", randomNumber);
    }

    /**
     * 단일 메시지 발송 예제
     */
    @PostMapping("send")
    // public SingleMessageSentResponse sendOne(@RequestBody ConfirmDTO confirmDTO) {
    public String sendOne(@RequestBody ConfirmDTO confirmDTO) {
        System.out.println("SingleMessageSentResponse start");

        UserDTO userDTO = userService.get(confirmDTO.getUserId());
        
        Message message = new Message();
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
 
        message.setFrom(sendPhone);
        // message.setFrom("01026957284");
        message.setTo(userDTO.getUserPhone());
        message.setText("[Swit] 인증번호 " + confirmDTO.getConfirmNum()  + " 타인 유출로 인한 피해 주의");
        System.out.println("message " + message);

        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
        System.out.println("response " + response);
        // return response;
        return "ok";
    }

    // 핸드폰 발송 인증 번호 확인
    @GetMapping("userCheck2")
    public ResponseEntity<?> userCheck2(@RequestBody ConfirmDTO confirmDTO) {
        System.out.println("userCheck2 start=================");

        System.out.println("no  " + confirmDTO.getConfirmNo());
        System.out.println("name  " + confirmDTO.getConfirmNum());


        
        //     userDTO = confirmService.userCheck4(id
        //                                    ,userName
        //                                    ,userPhone
        //                                    ,"");
        // } else {
        //     System.out.println("userCheck5555 start");
        //     return new ResponseEntity<>(confirmDTO, HttpStatus.BAD_REQUEST);
        // }


        // confirmDTO.setUserId(userDTO.getUserId());
        // confirmDTO.setConfirmTarget("1"); // "1" 아이디 찾기
        // confirmDTO.setConfirmPath(certifyType);         // "1" 이메일, "2", 핸드폰번호

        // String randomString = generateRandomSixDigitString();
        // System.out.println("Generated random string: " + randomString);

        // confirmDTO.setConfirmNum(randomString);         // 000000~999999 난수

        // confirmService.confirmIns(confirmDTO);
        
        return new ResponseEntity<>(confirmDTO, HttpStatus.OK);
    }

}
