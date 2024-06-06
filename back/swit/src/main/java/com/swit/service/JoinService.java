package com.swit.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.swit.domain.User;
import com.swit.dto.JoinDTO;
import com.swit.repository.UserRepository;



@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {


        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void joinProcess(JoinDTO joinDTO) {

        String userName = joinDTO.getUserName();
        String password = joinDTO.getUserPassword();

        Boolean isExist = userRepository.existsByUserName(userName);

        if (isExist) {

            return;
        }

        User data = new User();

        data.setUserName(userName);
        data.setUserPassword(bCryptPasswordEncoder.encode(password));
        data.setUserRole("ROLE_ADMIN");

        userRepository.save(data);
    }
}