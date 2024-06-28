package com.swit.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import com.swit.domain.User;
import com.swit.dto.CustomUserDetails;
import com.swit.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
				log.info("customuserdetailservice 로딩 완료");
		//DB에서 조회
        //User userData = userRepository.findByUserId(userName);
        Optional<User> userData = userRepository.findByUserId(userName);
        User user = userData.orElseThrow();

        System.out.println("loadUserByUsername user " + user);
        
        if (user != null) {
			log.info(" 사용자 인증 정보 CustomUserDetails로 반환 성공");
			//UserDetails에 담아서 return하면 AutneticationManager가 검증 함
            return new CustomUserDetails(user);
        }

        return null;
    }
}