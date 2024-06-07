package com.swit.jwt;

import io.jsonwebtoken.Jwts;
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

    public String getUsername(String token) {
        String temp = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
        System.out.println("JWTUtil username : " + temp);
        return temp;
        
    }

    public String getRole(String token) {
        String temp = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
        System.out.println("JWTUtil userRole : " + temp);
        return temp;
    }

    public Boolean isExpired(String token) {
        System.out.println("JWTUtil isExpired : start ");
        Boolean temp = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
        System.out.println("JWTUtil isExpired : [" + temp + "]");
        return temp;
    }

    public String createJwt(String username, String role, Long expiredMs) {

        String temp = Jwts.builder()
        .claim("username", username)
        .claim("role", role)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + expiredMs))
        .signWith(secretKey)
        .compact();

        System.out.println("createJwt userRole : " + temp);
        return temp;
    }
}