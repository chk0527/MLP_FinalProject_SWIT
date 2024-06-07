package com.swit.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import com.swit.domain.User;
import com.swit.dto.CustomUserDetails;


public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {

        this.jwtUtil = jwtUtil;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
				
		//request에서 Authorization 헤더를 찾음
        String authorization= request.getHeader("Authorization");
        System.out.println("doFilterInternal authorization : " + authorization);
				
		//Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer ")) {

            System.out.println("token null");
            filterChain.doFilter(request, response);
						
			//조건이 해당되면 메소드 종료 (필수)
            return;
        }
			
        System.out.println("authorization now");
		//Bearer 부분 제거 후 순수 토큰만 획득
        String token = authorization.split(" ")[1];

        System.out.println("doFilterInternal token : " + token);
			
		//토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {

            System.out.println("token expired");
            filterChain.doFilter(request, response);

			//조건이 해당되면 메소드 종료 (필수)
            return;
        }
        System.out.println("여기???????");
		//토큰에서 username과 role 획득
        String userName = jwtUtil.getUsername(token);
        System.out.println("여기222222222222222222???????");
        String userRole = jwtUtil.getRole(token);

        System.out.println("userName : " + userName);
        System.out.println("userRole : " + userRole);
				
		//userEntity를 생성하여 값 set
        User user = new User();
        user.setUserName(userName);
        user.setUserPassword("temppassword");
        user.setUserRole(userRole);
		System.out.println("userRole2222 : " + userRole);		
		//UserDetails에 회원 정보 객체 담기
        CustomUserDetails customUserDetails = new CustomUserDetails(user);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
		//세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);
        System.out.println("userRole3333 : " + userRole);		
        filterChain.doFilter(request, response);
        System.out.println("userRole4444 : " + userRole);		
    }
}