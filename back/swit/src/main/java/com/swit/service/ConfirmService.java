package com.swit.service;

// import java.util.HashMap;
// import java.util.Map;
import java.util.NoSuchElementException;
// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
import java.util.Optional;
import java.util.Random;

import javax.mail.MessagingException;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
// import org.springframework.util.StringUtils;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// import com.swit.domain.User;
import com.swit.domain.Confirm;
// import com.swit.domain.Study;
import com.swit.domain.User;
// import com.swit.dto.UserDTO;
import com.swit.dto.ConfirmDTO;
import com.swit.dto.UserDTO;
import com.swit.repository.UserRepository;
import com.swit.repository.ConfirmRepository;
import com.swit.util.CustomAuditorAware;
// import com.swit.util.MailUtil;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMessage.RecipientType;
import jakarta.transaction.Transactional;
// import kotlin.reflect.jvm.internal.impl.descriptors.Visibilities.Local;
// import kotlinx.datetime.LocalDateTime;
import lombok.RequiredArgsConstructor;
// import lombok.extern.log4j.Log4j2;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.transaction.annotation.Transactional;

// import jakarta.persistence.EntityManager;

@Service
@Transactional
// @Log4j2
@RequiredArgsConstructor
public class ConfirmService {
  // 자동 주입 대상은 final로 설정
  private final ModelMapper modelMapper;
  private final UserRepository userRepository;
  private final ConfirmRepository confirmRepository;
  // private final BCryptPasswordEncoder bCryptPasswordEncoder;
  private final CustomAuditorAware customAuditorAware;
  // private final MailUtil mailUtil;

  private final JavaMailSender emailsender;


 // 아이디/비밀번호 찾기 확인 처리(이메일)
  public UserDTO userCheck3(String userId, String userName, String userEmail, String userSnsConnect) {

    // 아이디 찾기 할때는 ID 값이 없음
    if (userId == null || userId.isEmpty()) {      		
      Optional<User> result = userRepository.findByUserNameAndUserEmailAndUserSnsConnect(userName, userEmail, userSnsConnect);
      User user = result.orElse(new User());
      UserDTO userDTO = modelMapper.map(user, UserDTO.class);
      return userDTO;
    } 
    // 비밀번호 찾기
    Optional<User> result = userRepository.findByUserIdAndUserNameAndUserEmailAndUserSnsConnect(userId, userName, userEmail, userSnsConnect);
    User user = result.orElse(new User());
    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    return userDTO;

  }

  // 아이디/비밀번호 찾기 확인 처리(핸드폰)
  public UserDTO userCheck4(String userId, String userName, String userPhone, String userSnsConnect) {

    // 아이디 찾기 할때는 ID 값이 없음
    if (userId == null || userId.isEmpty()) {      		
      Optional<User> result = userRepository.findByUserNameAndUserPhoneAndUserSnsConnect(userName, userPhone, userSnsConnect);
      User user = result.orElse(new User());
      UserDTO userDTO = modelMapper.map(user, UserDTO.class);
      return userDTO;
    } 
    // 비밀번호 찾기
    Optional<User> result = userRepository.findByUserIdAndUserNameAndUserPhoneAndUserSnsConnect(userId, userName, userPhone, userSnsConnect);
    User user = result.orElse(new User());
    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    return userDTO;
  }


  // 아이디/비밀번호 찾기 처리
  // @Transactional
  public ConfirmDTO confirmIns(ConfirmDTO confirmDTO) {
    
    // 시스템 시간에 5분 추가 여부 설정
    boolean addFiveMinutes = true; // 또는 false로 변경 가능

    // CustomAuditorAware를 사용하여 시스템 시간에 5분을 추가한 값을 설정
    customAuditorAware.setAddFiveMinutes(addFiveMinutes);

    Optional<LocalDateTime> confirmLimitDate = customAuditorAware.getCurrentAuditor();

    Confirm confirm = new Confirm();
    
    confirm.setUserId(confirmDTO.getUserId());
    confirm.setConfirmTarget(confirmDTO.getConfirmTarget());
    confirm.setConfirmPath(confirmDTO.getConfirmPath());
    // confirm.setConfirmLimitDate(confirmLimitDate);
    confirm.setConfirmLimitDate(confirmLimitDate.orElse(LocalDateTime.now()));

    Boolean isExist = true;
    isExist = confirmRepository.existsByUserIdAndConfirmTargetAndConfirmPath(confirmDTO.getUserId()
                                                          , confirmDTO.getConfirmTarget()
                                                          , confirmDTO.getConfirmPath());

    // 존재하면 Select -> update 
    if (isExist) {
      
      Optional<Confirm> result = confirmRepository.findByUserIdAndConfirmTargetAndConfirmPath(confirmDTO.getUserId()
                                                                                            , confirmDTO.getConfirmTarget()
                                                                                            , confirmDTO.getConfirmPath());
      Confirm temp = result.orElse(new Confirm());
      // ConfirmDTO  temp2 = modelMapper.map(temp, ConfirmDTO.class);
      confirm.setConfirmNo(temp.getConfirmNo());
    }

    confirm.setConfirmNum(confirmDTO.getConfirmNum());

    confirm = confirmRepository.saveAndFlush(confirm);

    confirmDTO = modelMapper.map(confirm, ConfirmDTO.class);
    
    return confirmDTO;
  }

  // 아이디/비밀번호 찾기 처리 인증번호 확인
  public ConfirmDTO confirmSel(ConfirmDTO confirmDTO) {
    
    String userId = confirmDTO.getUserId();
    String confirmNum = confirmDTO.getConfirmNum();
    
    Confirm confirm = confirmRepository.findById(confirmDTO.getConfirmNo())
                                       .orElseThrow(() -> new NoSuchElementException("Confirm not found"));
    
    LocalDateTime confirmLimitDate = confirm.getConfirmLimitDate();
    LocalDateTime now = LocalDateTime.now();
    
    // 인증번호 입력시간을 초과하면 (confirmNo = "" or 0 or Null)
    if (confirmLimitDate.isBefore(now)) {
        ConfirmDTO ret = new ConfirmDTO();
        return ret;
    }

    // 인증번호가 맞으면
    if (confirmNum.equals(confirm.getConfirmNum())) {
      confirmDTO = modelMapper.map(confirm, ConfirmDTO.class);
      return confirmDTO;
    }

    // 인증번호가 틀리면
    // (confirmNum = "" or Null)
    confirmDTO.setConfirmNum(null);

    return confirmDTO;
  }

  // // 
  // public Map sendMail(Map params) throws Exception{
  //     Map result = new HashMap();

  //     result.put("data", new HashMap<>());
  //     if (mailUtil.sendMail(params.get("email").toString())) {
  //         result.put("code", 200);
  //         result.put("message", "success");
  //     } else {
  //         result.put("code", 500);
  //         result.put("message", "fail");
  //     }

  //     return result;
  // }

  // 메일 내용 작성
	public MimeMessage createMessage(String userEmail, String confirmNum) throws MessagingException, UnsupportedEncodingException {
        
        System.out.println("보내는 대상 : " + userEmail);
        System.out.println("인증 번호 : " + confirmNum);

        MimeMessage message = emailsender.createMimeMessage();

        try {

            message.addRecipients(RecipientType.TO, userEmail);// 보내는 대상

            message.setSubject("[Swit] 아이디 찾기 이메일 인증");// 제목

            String msgg = "";
            msgg += "<div style='margin:100px;'>";
            msgg += "<h1> 안녕하세요</h1>";
            msgg += "<h1> 통합 취업 정보 포탈 GoodJob 입니다</h1>";
            msgg += "<br>";
            msgg += "<p>아래 코드를 회원가입 창으로 돌아가 입력해주세요<p>";
            msgg += "<br>";
            msgg += "<p>항상 당신의 꿈을 응원합니다. 감사합니다!<p>";
            msgg += "<br>";
            msgg += "<div align='center' style='border:1px solid black; font-family:verdana';>";
            msgg += "<h3 style='color:blue;'>회원가입 인증 코드입니다.</h3>";
            msgg += "<div style='font-size:130%'>";
            msgg += "CODE : <strong>";
            msgg += confirmNum + "</strong><div><br/> "; // 메일에 인증번호 넣기
            msgg += "</div>";
            message.setText(msgg, "utf-8", "html");// 내용, charset 타입, subtype
            // 보내는 사람의 이메일 주소, 보내는 사람 이름
            // message.setFrom(new InternetAddress("goodjobproject@naver.com", "GoodJob_Admin"));// 보내는 사람
            
            message.setFrom(new InternetAddress("fullstack21@naver.com", "Swit Admin"));// 보내는 사람
        } catch (Exception e) {
            e.printStackTrace();
            throw new MessagingException();
        }

		return message;
	}

	// 랜덤 인증 코드 전송
	// @Override
	public String createKey() {
		StringBuffer key = new StringBuffer();
		Random rnd = new Random();

		for (int i = 0; i < 8; i++) { // 인증코드 8자리
			int index = rnd.nextInt(3); // 0~2 까지 랜덤, rnd 값에 따라서 아래 switch 문이 실행됨

			switch (index) {
			case 0:
				key.append((char) ((int) (rnd.nextInt(26)) + 97));
				// a~z (ex. 1+97=98 => (char)98 = 'b')
				break;
			case 1:
				key.append((char) ((int) (rnd.nextInt(26)) + 65));
				// A~Z
				break;
			case 2:
				key.append((rnd.nextInt(10)));
				// 0~9
				break;
			}
		}

		return key.toString();
	}

	// 메일 발송
	// sendSimpleMessage 의 매개변수로 들어온 to 는 곧 이메일 주소가 되고,
	// MimeMessage 객체 안에 내가 전송할 메일의 내용을 담는다.
	// 그리고 bean 으로 등록해둔 javaMail 객체를 사용해서 이메일 send!!
	// @Override
	public String sendSimpleMessage(String userEmail, String confirmNum) throws Exception {

    // controller 에서 처리함
		// ePw = createKey(); // 랜덤 인증번호 생성

		// TODO Auto-generated method stub
		MimeMessage message = createMessage(userEmail, confirmNum); // 메일 발송
		try {// 예외처리
			emailsender.send(message);
		} catch (MailException e) {
			e.printStackTrace();
			throw new IllegalArgumentException();
		}


		return confirmNum; // 메일로 보냈던 인증 코드를 서버로 반환
	}

}
