package com.swit.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.swit.domain.User;
import com.swit.dto.UserDTO;
import com.swit.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/user")
public class UserController {
    private final UserService service;

    // 아이디로 유저 프로필 조회
    @GetMapping("/{user_id}")
    public UserDTO get(@PathVariable(name = "user_id") String user_id) {
        return service.get(user_id);
    }

    // 아이디로 조회한 유저 데이터 수정
    @PutMapping("/{user_id}")
    public Map<String, String> modify(
            @PathVariable(name = "user_id") String user_id,
            @RequestBody UserDTO userDTO) {
        userDTO.setUser_id(user_id);
        log.info("Modify : " + userDTO);
        try {
            service.modify(userDTO, null);
            log.info("Modified UserDTO with Image URL: " + userDTO);
        } catch (IOException e) {
            log.error("Error updating profile", e);
            return Map.of("RESULT", "FAILURE");
        }

        return Map.of("RESULT", "SUCCESS");
    }

    // 프로필 이미지 업로드 및 수정
    // !! 이미 사용자의 프사가 폴더에 있으면, 그걸 지우고 새로 추가
    @PostMapping("/{user_id}/image")
    public ResponseEntity<User> modifyImage(
            @PathVariable(name = "user_id") String user_id,
            @RequestParam("user_image") MultipartFile user_image) {
        try {
            User updatedUser = service.modifyImage(user_id, user_image);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            log.error("Error updating profile image", e);
            return ResponseEntity.status(500).build();
        }
    }

    // 이미지 파일 조회하기
    @GetMapping("/{user_id}/image")
    public ResponseEntity<Resource> getImage(
            @PathVariable(name = "user_id") String user_id) throws IOException {
        try {
            String fileName = service.getUserImageName(user_id);
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

}
