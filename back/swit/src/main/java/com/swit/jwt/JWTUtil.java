package com.swit.jwt;

import io.jsonwebtoken.Jwts;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {

    private SecretKey secretKey;

    public JWTUtil(@Value("${jwt.secret}")String secret) {


        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        System.out.println("JWTUtil secretKey : " + secretKey);
    }

    public SecretKey getSecretKey() {
        return secretKey;
    }

    public String getNo(String token) {
        String temp = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userNo", String.class);
        System.out.println("JWTUtil no : " + temp);
        return temp;
    }

    public String getUserId(String token) {
        String temp = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userId", String.class);
        System.out.println("JWTUtil userId : " + temp);
        return temp;
        
    }

    // public String getUsername(String token) {
    //     String temp = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userName", String.class);
    //     System.out.println("JWTUtil username : " + temp);
    //     return temp;
        
    // }

    public String getNick(String token) {
        String temp = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userNick", String.class);
        System.out.println("JWTUtil userNick : " + temp);
        return temp;
    }

    public String getRole(String token) {
        String temp = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userRole", String.class);
        System.out.println("JWTUtil userRole : " + temp);
        return temp;
    }

    public Boolean isExpired(String token) {
        System.out.println("JWTUtil isExpired : start ");
        Boolean temp = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
        System.out.println("JWTUtil isExpired : [" + temp + "]");
        return temp;
    }

    public String createJwt(String userNo, String userId, String userNick, String userRole, Long expiredMs) {
        System.out.println("createJwt start ");
        
        String temp = Jwts.builder()
        .claim("userNo", userNo)
        .claim("userId", userId)
        // .claim("userName", username)
        .claim("userNick", userNick)
        .claim("userRole", userRole)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + expiredMs)) //1시간
        .signWith(secretKey)
        .compact();

        System.out.println("createJwt userRole : " + temp);
        return temp;
    }

    public String createRefreshToken(String userNo, String userId, String userNick, String userRole, Long expiredMs) {
      System.out.println("createRefreshToken start ");
      
      String temp = Jwts.builder()
          .claim("userNo", userNo)
          .claim("userId", userId)
          .claim("userNick", userNick)
          .claim("userRole", userRole)
          .issuedAt(new Date(System.currentTimeMillis()))
          .expiration(new Date(System.currentTimeMillis() + expiredMs)) //7일
          .signWith(secretKey)
          .compact();
  
      System.out.println("createRefreshToken : " + temp);
      return temp;
  }
}