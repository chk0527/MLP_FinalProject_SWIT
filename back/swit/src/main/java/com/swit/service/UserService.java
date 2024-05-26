package com.swit.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    private final UserRepository userRepository;

    public UserDTO get(String user_id) {
        Optional<User> result = userRepository.selectOne(user_id);
        User user = result.orElseThrow();
        UserDTO userDTO = entityToDTO(user);
        return userDTO;
    }

    private UserDTO entityToDTO(User user) {
        UserDTO userDTO = UserDTO.builder()
                .user_id(user.getUser_id()).user_password(user.getUser_password())
                .user_name(user.getUser_name()).user_nick(user.getUser_nick())
                .user_email(user.getUser_email()).user_phone(user.getUser_phone())
                .build();
        return userDTO;
    }
}
