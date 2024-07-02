package com.swit.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.swit.domain.User;
import com.swit.dto.UserDTO;
import com.swit.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class UserService {
  // 자동 주입 대상은 final로 설정
  private final ModelMapper modelMapper;
  private final UserRepository userRepository;
  private final BCryptPasswordEncoder bCryptPasswordEncoder;

  // 프로필 정보 조회(마이페이지)
  public UserDTO get(String userId) {
    // Optional<UserDTO> result = userRepository.findById(userId);
    // Optional<User> result = userRepository.findById(userId);
    Optional<User> result = userRepository.findByUserId(userId);
    User user = result.orElseThrow();
    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    return userDTO;
  }

  // 닉네임으로 유저 조회
  public UserDTO getUserByNick(String userNick) {
    Optional<User> result = userRepository.findByUserNick(userNick);
    User user = result.orElseThrow();
    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    return userDTO;
  }

  // 프로필 수정(모달창)
  public void modify(UserDTO userDTO, MultipartFile userImage) throws IOException {
    // Optional<User> result = userRepository.findById(userDTO.getUserId());
    Optional<User> result = userRepository.findByUserId(userDTO.getUserId());
    User user = result.orElseThrow();
    user.setUserName(userDTO.getUserName());
    user.setUserNick(userDTO.getUserNick());
    user.setUserPhone(userDTO.getUserPhone());
    user.setUserEmail(userDTO.getUserEmail());
    userRepository.save(user);
  }

  // 프로필 이미지 수정(모달창)
  public User modifyImage(String userId, MultipartFile userImage) throws IOException {
    // User user = userRepository.findById(userId).orElseThrow(() -> new
    // RuntimeException("User not found"));
    User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("User not found"));

    // 기존 이미지 파일 삭제
    String oldImageName = user.getUserImage();
    log.info(user.getUserName() + "님의 현재 이미지: " + oldImageName);
    if (oldImageName != null) {
      removeOldImage(oldImageName);
    }
    // 새로운 이미지 파일 저장
    String imageName = saveUserImage(userId, userImage);
    user.setUserImage(imageName);
    log.info("저장된 새 이미지: " + imageName);

    return userRepository.save(user);
  }

  // upload 폴더에 이미지 저장 메서드
  public String saveUserImage(String userId, MultipartFile userImage) throws IOException {
    String originalFileName = userImage.getOriginalFilename(); // 업로드할 이미지 원래 파일명
    String newFileName = userId + "_" + originalFileName; // db에 담을 새로운 파일명(유저id+원래 파일명)
    Path imagePath = Paths.get("upload", newFileName); // upload 폴더 경로 지정
    Files.createDirectories(imagePath.getParent());
    Files.write(imagePath, userImage.getBytes());
    return newFileName;
  }

  // 사용자 프로필 이미지 파일명 조회 메서드
  public String getUserImageName(String userId) {
    User user = userRepository
        // .findById(userId)
        .findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
    return user.getUserImage();
  }

  // upload 폴더의 기존 이미지 파일 삭제
  public void removeOldImage(String fileName) {
    try {
      Path oldImagePath = Paths.get("upload", fileName);
      Files.delete(oldImagePath);
    } catch (IOException e) {
      log.error("Error deleting old image file", e);
    }
  }

  // 로그인 확인 처리(네이버 소셜 로그인)
  public UserDTO userCheck(String userName, String userEmail, String userSnsConnect) {
    Optional<User> result = userRepository.findByUserNameAndUserEmailAndUserSnsConnect(userName, userEmail,
        userSnsConnect);
    User user = result.orElse(new User());
    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    return userDTO;
  }

  // 로그인 확인 처리(카카오 소셜 로그인)
  public UserDTO userCheck2(String userNick, String userEmail, String userSnsConnect) {
    // Optional<User> result =
    // userRepository.findByUserNickNameAndUserEmailAndUserSnsConnect(userNickName,
    // userEmail, userSnsConnect);
    Optional<User> result = userRepository.findByUserNickAndUserEmailAndUserSnsConnect(userNick, userEmail,
        userSnsConnect);
    User user = result.orElse(new User());
    UserDTO userDTO = modelMapper.map(user, UserDTO.class);
    return userDTO;
  }

  // 회원 가입
  public void join(UserDTO userDTO) {
    Integer userNo = userDTO.getUserNo();
    String userId = userDTO.getUserId();
    String userName = userDTO.getUserName();
    String password = userDTO.getUserPassword();
    String userNick = userDTO.getUserNick();

    String userEmail = userDTO.getUserEmail();
    String snsConnect = userDTO.getUserSnsConnect();

    Boolean isExist = true;
    if (snsConnect.isEmpty()) {
      isExist = userRepository.existsByUserId(userId);
    } else if (snsConnect.equals("NAVER")) {
      isExist = userRepository.existsByUserNameAndUserEmailAndUserSnsConnect(userName, userEmail, snsConnect);
    } else if (snsConnect.equals("KAKAO")) {
      isExist = userRepository.existsByUserNickAndUserEmailAndUserSnsConnect(userNick, userEmail, snsConnect);
    }

    User data = new User();

    if (isExist) {
      // sns 로그인시 userID update 처리
      if (snsConnect.equals("NAVER") || snsConnect.equals("KAKAO")) {
        data.setUserNo(userNo);
        data.setUserCreateDate(userDTO.getUserCreateDate());
      } else {
        log.info("가입된 고객입니다.");
        return;
      }
    }
    // System.out.println("pw [" + password + "] " +
    // bCryptPasswordEncoder.encode(password));
    // sns 로그인시 없는 경우 존재
    Optional<String> optionalUserNick = Optional.ofNullable(userNick);
    if (optionalUserNick.map(String::isEmpty).orElse(true)) {
      log.info("userNick1 " + userNick);
      data.setUserNick(userName);
    } else {
      log.info("userName1 " + userName);
      data.setUserNick(userNick);
    }
    Optional<String> optionalUserName = Optional.ofNullable(userName);
    if (optionalUserName.map(String::isEmpty).orElse(true)) {
      log.info("userNick2 " + userNick);
      data.setUserName(userNick);
    } else {
      log.info("userName2 " + userName);
      data.setUserName(userName);
    }

    data.setUserId(userId);
    data.setUserPassword(bCryptPasswordEncoder.encode(password));
    data.setUserEmail(userDTO.getUserEmail());
    data.setUserPhone(userDTO.getUserPhone());
    data.setUserSnsConnect(userDTO.getUserSnsConnect()); // "" 홈페이지 가입, "naver" , "kakao"
    // data.setUserImage(userDTO.getUserImage());
    data.setUserDeleteChk(userDTO.isUserDeleteChk());
    data.setUserRole("ROLE_USER");

    // 기본 이미지 파일 설정
    if (userDTO.getUserImage() == null || userDTO.getUserImage().isEmpty()) {
      Path defaultImagePath = Paths.get("back/swit/upload", "userBlank.png");
      System.out.println("기본 이미지 파일 경로: " + defaultImagePath);

      if (Files.exists(defaultImagePath)) {
        // 유저 ID를 포함하여 파일명 생성
        String defaultImageFileName = userId + "_userBlank.png";
        Path targetPath = Paths.get("upload", defaultImageFileName);

        try {
          Files.copy(defaultImagePath, targetPath);
          data.setUserImage(defaultImageFileName); // 이미지 필드에 파일 이름 설정
          System.out.println("기본 이미지 설정 완료: " + defaultImageFileName);
        } catch (IOException e) {
          System.out.println("기본 이미지 파일 복사 중 오류 발생: " + e.getMessage());
          data.setUserImage(null);
        }
      } else {
        System.out.println("기본 이미지 파일이 존재하지 않습니다: " + defaultImagePath);
      }
    } else {
      data.setUserImage(userDTO.getUserImage());
    }

    userRepository.save(data);
  }

}
