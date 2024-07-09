package com.swit.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.swit.domain.User;
import com.swit.dto.UserDTO;
import com.swit.jwt.JWTUtil;
import com.swit.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/user")
public class UserController {
    private final UserService service;
    private final JWTUtil jwtUtil;

    // 아이디로 유저 프로필 조회
    @GetMapping("/{userId}")
    public UserDTO get(@PathVariable(name = "userId") String userId) {
        return service.get(userId);
    }
   

// 아이디로 조회한 유저 데이터 수정
@PutMapping("/{userId}")
public ResponseEntity<Map<String, String>> modify(
        @PathVariable(name = "userId") String userId,
        @RequestBody UserDTO userDTO) {
    userDTO.setUserId(userId);
    log.info("Modify : " + userDTO);
    try {
        service.modify(userDTO, null);
        log.info("Modified UserDTO with Image URL: " + userDTO);

        // 닉네임 변경 후 새로운 토큰 발급
        String newAccessToken = jwtUtil.createJwt(userDTO.getUserNo().toString(), userDTO.getUserId(), userDTO.getUserNick(), userDTO.getUserRole(), 3 * 60 * 60 * 1000L); // 3시간 유효
        String newRefreshToken = jwtUtil.createRefreshToken(userDTO.getUserNo().toString(), userDTO.getUserId(), userDTO.getUserNick(), userDTO.getUserRole(), 7 * 24 * 60 * 60 * 1000L); // 7일 유효

        // 새로운 토큰 반환
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        tokens.put("refreshToken", newRefreshToken);
        tokens.put("RESULT", "SUCCESS");

        return ResponseEntity.ok(tokens);
    } catch (IOException e) {
        log.error("Error updating profile", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("RESULT", "FAILURE"));
    }
}


    // 프로필 이미지 업로드 및 수정
    // !! 이미 사용자의 프사가 폴더에 있으면, 그걸 지우고 새로 추가
    @PostMapping("/{userId}/image")
    public ResponseEntity<User> modifyImage(
            @PathVariable(name = "userId") String userId,
            @RequestParam("userImage") MultipartFile userImage) {
        try {
            User updatedUser = service.modifyImage(userId, userImage);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            log.error("Error updating profile image", e);
            return ResponseEntity.status(500).build();
        }
    }

    // 이미지 파일 조회하기
    @GetMapping("/{userId}/image")
    public ResponseEntity<Resource> getImage(
            @PathVariable(name = "userId") String userId) throws IOException {
        try {
            String fileName = service.getUserImageName(userId);
            Path path = Paths.get("upload", fileName);

            if (Files.exists(path)) {
                String mimeType = Files.probeContentType(path);
                ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(mimeType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving profile image", e);
            return ResponseEntity.status(500).build();
        }
    }
    //수정 시 중복 체크
    @GetMapping("/check_duplicate")
    public Map<String, Boolean> checkDuplicate(
            @RequestParam String userNick,
            @RequestParam String userPhone,
            @RequestParam String userEmail,
            @RequestParam String currentUserId) {
        return service.checkDuplicate(userNick, userPhone, userEmail, currentUserId);
    }

    // 패스워드 확인
    @PostMapping("/validate_password")
    public ResponseEntity<Boolean> validatePassword(
            @RequestParam String userId,
            @RequestParam String currentPassword) {
        boolean isValid = service.validateCurrentPassword(userId, currentPassword);
        return ResponseEntity.ok(isValid);
    }

  

}
