package com.swit.jwt;


import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.swit.dto.CustomUserDetails;
import com.swit.jwt.JWTUtil;


public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        System.out.println("attemptAuthentication start");
        String username = obtainUsername(request);
        String password = obtainPassword(request);

        System.out.println("attemptAuthentication username : " + username);
        System.out.println("attemptAuthentication password : " + password);

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
        
        return authenticationManager.authenticate(authToken);
    }

    @Override
protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
    System.out.println("successfulAuthentication success");
    
    CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

    String userNo = customUserDetails.getUser().getUserNo().toString();
    String userId = customUserDetails.getUsername();
    String userNick = customUserDetails.getUser().getUserNick();
    
    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
    Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
    GrantedAuthority auth = iterator.next();

    String userRole = auth.getAuthority();
    System.out.println("successfulAuthentication userNo : " + userNo.toString());
    System.out.println("successfulAuthentication userId : " + userId);
    System.out.println("successfulAuthentication userNick : " + userNick);
    System.out.println("successfulAuthentication userRole : " + userRole);

    String token = jwtUtil.createJwt(userNo, userId, userNick, userRole, 60 * 60 * 1000L); // 1시간 유효
    String refreshToken = jwtUtil.createRefreshToken(userNo, userId, userNick,userRole, 7 * 24 * 60 * 60 * 1000L); // 7일 유효
    System.out.println("successfulAuthentication token : " + token);
    System.out.println("successfulAuthentication refreshToken : " + refreshToken);

    response.addHeader("Authorization", "Bearer " + token);
    response.addHeader("refreshtoken", refreshToken);
}

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {

        response.setStatus(401);
    }
}

