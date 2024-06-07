package com.swit.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import com.swit.domain.User;
import com.swit.dto.CustomUserDetails;
import com.swit.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
				
		//DB에서 조회
        User userData = userRepository.findByUserName(userName);

        if (userData != null) {
						
			//UserDetails에 담아서 return하면 AutneticationManager가 검증 함
            //return new CustomUserDetails(userData);
            return new CustomUserDetails(userData);
        }

        return null;
    }
}