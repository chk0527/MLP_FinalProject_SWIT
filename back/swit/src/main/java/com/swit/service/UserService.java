package com.swit.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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
        // User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
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
	public UserDTO userCheck(String userName, String userEmail) {
        Optional<User> result = userRepository.findByUserNameAndUserEmail(userName, userEmail);
        User user = result.orElseThrow();
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
		return userDTO;
	}

    // 회원 가입
    public void join(UserDTO userDTO) {

        String userId = userDTO.getUserId();
        String userName = userDTO.getUserName();
        String password = userDTO.getUserPassword();

        Boolean isExist = userRepository.existsByUserId(userId);

        if (isExist) {
            log.info("가입된 고객입니다.");

            return;
        }

        User data = new User();

        data.setUserId(userId);
        data.setUserName(userName);
        data.setUserPassword(bCryptPasswordEncoder.encode(password));
        data.setUserDeleteChk(true);           // 회원상태 true(1, 정상)
        data.setUserRole("ROLE_USER");              // 권한 USER

        userRepository.save(data);
    }
}
