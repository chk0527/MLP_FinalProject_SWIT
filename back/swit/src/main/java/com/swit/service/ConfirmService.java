package com.swit.service;

import java.util.NoSuchElementException;
// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
import java.util.Optional;
import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
// import org.springframework.util.StringUtils;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// import com.swit.domain.User;
import com.swit.domain.Confirm;
import com.swit.domain.Study;
import com.swit.domain.User;
// import com.swit.dto.UserDTO;
import com.swit.dto.ConfirmDTO;
import com.swit.dto.UserDTO;
import com.swit.repository.UserRepository;
import com.swit.repository.ConfirmRepository;
import com.swit.util.CustomAuditorAware;

import jakarta.transaction.Transactional;
import kotlin.reflect.jvm.internal.impl.descriptors.Visibilities.Local;
// import kotlinx.datetime.LocalDateTime;
import lombok.RequiredArgsConstructor;
// import lombok.extern.log4j.Log4j2;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

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

}
