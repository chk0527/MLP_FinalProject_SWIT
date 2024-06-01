package com.swit.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    // 프로필 정보 조회(마이페이지)
    public UserDTO get(String user_id) {
        Optional<User> result = userRepository.findById(user_id);
        User user = result.orElseThrow();
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        return userDTO;
    }

    // 프로필 수정(모달창)
    public void modify(UserDTO userDTO, MultipartFile userImage) throws IOException {
        Optional<User> result = userRepository.findById(userDTO.getUser_id());
        User user = result.orElseThrow();
        user.setUser_name(userDTO.getUser_name());
        user.setUser_nick(userDTO.getUser_nick());
        user.setUser_phone(userDTO.getUser_phone());
        user.setUser_email(userDTO.getUser_email());
        userRepository.save(user);
    }

    // 프로필 이미지 수정(모달창)
    public User modifyImage(String user_id, MultipartFile user_image) throws IOException {
        User user = userRepository.findById(user_id).orElseThrow(() -> new RuntimeException("User not found"));
        
        // 기존 이미지 파일 삭제
        String oldImageName = user.getUser_image();
        log.info(user.getUser_name() + "님의 현재 이미지: " + oldImageName);
        if (oldImageName != null) {
            removeOldImage(oldImageName);
        }
        // 새로운 이미지 파일 저장
        String imageName = saveUserImage(user_id, user_image);
        user.setUser_image(imageName);
        log.info("저장된 새 이미지: " + imageName);

        return userRepository.save(user);
    }

    // upload 폴더에 이미지 저장 메서드
    public String saveUserImage(String user_id, MultipartFile user_image) throws IOException {
        String originalFileName = user_image.getOriginalFilename(); // 업로드할 이미지 원래 파일명
        String newFileName = user_id + "_" + originalFileName; // db에 담을 새로운 파일명(유저id+원래 파일명)
        Path imagePath = Paths.get("upload", newFileName); // upload 폴더 경로 지정
        Files.createDirectories(imagePath.getParent());
        Files.write(imagePath, user_image.getBytes());
        return newFileName;
    }

    // 사용자 프로필 이미지 파일명 조회 메서드
    public String getUserImageName(String user_id) {
        User user = userRepository
                .findById(user_id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getUser_image();
    }

    public void removeOldImage(String fileName) {
        try {
            Path oldImagePath = Paths.get("upload", fileName);
            Files.delete(oldImagePath);
        } catch (IOException e) {
            log.error("Error deleting old image file", e);
        }
    }
}
