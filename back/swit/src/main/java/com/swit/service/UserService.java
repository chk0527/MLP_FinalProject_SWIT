package com.swit.service;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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
    //자동 주입 대상은 final로 설정
    private final ModelMapper modelMapper;

    private final UserRepository userRepository;

    //프로필 정보 조회(마이페이지)
    public UserDTO get(String user_id) {
        Optional<User> result = userRepository.selectOne(user_id);
        User user = result.orElseThrow();
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        return userDTO;
    }

    //프로필 수정(모달창)
    public void modify(UserDTO userDTO){
        Optional<User> result = userRepository.findById(userDTO.getUser_id());
        User user = result.orElseThrow();
        user.setUser_name(userDTO.getUser_name());
        user.setUser_nick(userDTO.getUser_nick());
        user.setUser_phone(userDTO.getUser_phone());
        user.setUser_email(userDTO.getUser_email());
        userRepository.save(user);
    }

    // 로그인 확인 처리(소셜 로그인)
	public UserDTO userCheck(String name, String email) {
        Optional<User> result = userRepository.userCheck(name, email);
        User user = result.orElseThrow();
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
		return userDTO;
	}
}
