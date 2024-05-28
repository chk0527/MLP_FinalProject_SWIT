package com.swit.controller;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import lombok.AllArgsConstructor;

import org.springframework.web.bind.annotation.RestController;

import com.swit.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.net.URL;
import java.net.URLEncoder;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/login")
public class LoginController {
    private final UserService userService;
    
    @GetMapping("/")
    public void get(HttpSession session, Model model) {
		
		log.info("login in~out \n");

        //naverLogin(session, model);
        //kakaoLogin(session, model);
        //googleLogin(session, model);

    }

    public  void naverLogin(HttpSession session, Model model ) {
		try {
		    String clientId = "L5I5wLWO4xVWs4nssClM";//애플리케이션 클라이언트 아이디값";
            String redirectURI = URLEncoder.encode("http://localhost:8080/naverLogin/callbank", "UTF-8");
		    //String redirectURI = URLEncoder.encode("http://localhost:8080/naverLogin/callback", "UTF-8");
		    SecureRandom random = new SecureRandom();
		    String state = new BigInteger(130, random).toString();
		    String apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
		    apiURL += "&client_id=" + clientId;
		    apiURL += "&redirect_uri=" + redirectURI;
		    apiURL += "&state=" + state;
		    session.setAttribute("state", state);
		    
		    model.addAttribute("naver", apiURL);
		} catch (Exception e) {
		      System.out.println(e);
		}
	}

    @GetMapping("/callback")
	public String callback(@RequestParam ("code") String code,
						   @RequestParam ("state") String state,
						   RedirectAttributes rttr,
						   HttpServletRequest request) {
		
		return "redirect:/naverLogin/success";

	}
    
    @GetMapping("/success")
    public void success() {
    	log.info("success로 이동 ..........");
    }
   
















    public  void kakaoLogin(HttpSession session, Model model ) {

    }

    

}
