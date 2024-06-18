package com.swit.config;



import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;


import com.swit.jwt.LoginFilter;

import java.util.Arrays;
import jakarta.servlet.http.HttpServletRequest;

import com.swit.jwt.JWTFilter;
import com.swit.jwt.JWTUtil;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    //AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil) {

        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }
    //AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        http
                .cors((cors) -> cors.configurationSource(new CorsConfigurationSource() {

                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration configuration = new CorsConfiguration();

                        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                        configuration.setAllowedMethods(Collections.singletonList("*"));
                        configuration.setAllowCredentials(true);
                        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "RefreshToken"));
                        configuration.setMaxAge(3600L);
			                  configuration.setExposedHeaders(Arrays.asList("Authorization", "Refreshtoken")); // Refreshtoken 추가

                        return configuration;
                    }
                }));

        http
                .csrf((auth) -> auth.disable());

        http
                .formLogin((auth) -> auth.disable());

        http
                .httpBasic((auth) -> auth.disable());

        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/", "/api/join/**","/api/calendar/**", "/api/examjob/**", "/api/confirm/**"
                        , "/api/place/**", "/api/user/**", "/api/study/**","/api/group/isLeader/","/api/group/**","/snslogin/**", "/login/info","ws/**","/chat/**","/api/questions/","/api/answers","/api/refresh").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/**","/api/*").permitAll()    // GET 호출 인증 제외
                        .requestMatchers("/api/admin").hasRole("ADMIN")
                        .anyRequest().authenticated());

// //시큐리티 사용방법 추후 수정 공개 엔드포인트
// .requestMatchers("/").permitAll()
//  // GET 요청 공개
// .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
// // 인증된 사용자만 접근 가능한 엔드포인트
// .requestMatchers("/api/private/**").authenticated()
// // ADMIN 권한이 필요한 엔드포인트
// .requestMatchers("/api/admin/**").hasRole("ADMIN")
// // 나머지 모든 요청은 인증 필요
// .anyRequest().authenticated());

        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil), UsernamePasswordAuthenticationFilter.class);

        //JWTFilter 등록
        http
                .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        http
        .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));


        return http.build();
    }
}