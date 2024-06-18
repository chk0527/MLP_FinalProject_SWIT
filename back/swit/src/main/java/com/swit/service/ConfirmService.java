package com.swit.service;

// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
// import org.springframework.util.StringUtils;
// import org.springframework.web.multipart.MultipartFile;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// import com.swit.domain.User;
import com.swit.domain.Confirm;
import com.swit.domain.User;
// import com.swit.dto.UserDTO;
import com.swit.dto.ConfirmDTO;
import com.swit.dto.UserDTO;
import com.swit.repository.UserRepository;
import com.swit.repository.ConfirmRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
// import lombok.extern.log4j.Log4j2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

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
  @Transactional
  public Integer confirmIns(ConfirmDTO confirmDTO) {

    Confirm confirm = new Confirm();

    confirm.setUserId(confirmDTO.getUserId());
    confirm.setConfirmTarget(confirmDTO.getConfirmTarget());
    confirm.setConfirmPath(confirmDTO.getConfirmPath());

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
    
    return confirmRepository.persist(confirm);
  }
}
