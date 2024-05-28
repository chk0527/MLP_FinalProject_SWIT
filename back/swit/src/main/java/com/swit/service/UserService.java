package com.swit.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import org.modelmapper.ModelMapper;

import com.swit.domain.User;
import com.swit.dto.UserDTO;
import com.swit.repository.UserRepository;

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

    public String register(UserDTO userDTO) {
        log.info("-------------------------------------");
        User user = modelMapper.map(userDTO, User.class);
        User savedUser = userRepository.save(user);
        return savedUser.getUser_id();
    }

    public UserDTO get(String user_id) {
        Optional<User> result = userRepository.findById(user_id);
        User user = result.orElseThrow();
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        return userDTO;
    }
    
    public void modify(UserDTO userDTO) {
        Optional<User> result = userRepository.findById(userDTO.getUser_id());
        User user = result.orElseThrow();
        user.setUser_email(userDTO.getUser_email());
        user.setUser_name(userDTO.getUser_name());
        user.setUser_password(userDTO.getUser_password());
        user.setUser_phone(userDTO.getUser_phone());
        user.setUser_nick(userDTO.getUser_nick());
        user.setUser_sns_connect(userDTO.getUser_sns_connect());
        user.setUser_image(userDTO.getUser_image());
        user.setUser_delete_chk(userDTO.isUser_delete_chk());
        user.setUser_delete_date(userDTO.getUser_delete_date());
     
        userRepository.save(user);
    }

    public void remove(String user_id) {
        userRepository.deleteById(user_id);
    }
}

        // user.setUser_email("abc@abc.com");
        // user.setUser_name("이수정");
        // user.setUser_password("4321");
        // user.setUser_phone("010-4321-4321");
        // user.setUser_nick("수정수정");
        // user.setUser_sns_connect("kakao");
        // user.setUser_image("d:/upload/profile119.png");
        // user.setUser_sns_connect("kakao");
        // user.setUser_delete_chk(true);
        // user.setUser_delete_date(LocalDate.now());
