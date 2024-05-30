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
import java.io.IOException;

import org.json.JSONObject;
// SpringBoot 3.x 부터는 jakarta 사용
// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.AllArgsConstructor;

import com.swit.dto.UserDTO;
import com.swit.service.UserService;
import com.swit.domain.User;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/login")
public class LoginController {
    private final UserService userService;

    @GetMapping("/")
	public Map<String, String> get(HttpSession session) {
		log.info("login --------- start");
		Map<String, String> map = new HashMap<>();
		
		// map = naverLogin(session);  개발중 
		// kakaoLogin(session);

		return map;

    }

	@PostMapping("/")
    public Map<String, String> postOne(@RequestBody UserDTO userDTO, HttpSession session) {
		log.info("Login --------- user_id, user_password : "+ userDTO.getUser_id() + userDTO.getUser_password());
		String  user_id    = userDTO.getUser_id();
		
		UserDTO searchUser = new UserDTO();
        searchUser = userService.get(userDTO.getUser_id());
		
		if (userDTO.getUser_id().equalsIgnoreCase(searchUser.getUser_id())
		&&  userDTO.getUser_password().equals(searchUser.getUser_password())) {
			session.setAttribute("userId", searchUser.getUser_id());
			session.setAttribute("userEmail", searchUser.getUser_email());

			log.info("UserDTO33333333333333333333333333333333 : "+ searchUser);

		}

        return Map.of("user_id", user_id);
    }

    public  Map<String, String> naverLogin(HttpSession session) {
		log.info("naver --------- start");
		String naverURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
		try {
		    String clientId = "L5I5wLWO4xVWs4nssClM";//애플리케이션 클라이언트 아이디값";
            String redirectURI = URLEncoder.encode("http://localhost:8080/naverLogin/callbank", "UTF-8");

		    SecureRandom random = new SecureRandom();
		    String state = new BigInteger(130, random).toString();
		    
		    naverURL += "&client_id=" + clientId;
		    naverURL += "&redirect_uri=" + redirectURI;
		    naverURL += "&state=" + state;
		    session.setAttribute("state", state);
		    
		} catch (Exception e) {
		      System.out.println(e);
		}
		log.info("naverURL : ["+ naverURL + "]");

		return Map.of("naverURL", naverURL);
	}

	//ApiExamMemberProfile 예제 코드의 메소드들  
	//main()에 필요한 정보는 access_token, 
	// JSON 파싱한 결과를 맵에 저장 name : ***, email: ***
	private Map<String, String> getProfile(String token){
		
		//token = "AAAAOrXtAM1-RiZbjZWv-IcH4YjavGDrQuGAdF_UFnY2010j5J-0wKHlIV-ZZluBBhf0sPd-wZjfDYMzMWGM_tYUTDE"; // 네이버 로그인 접근 토큰;
	    String header = "Bearer " + token; // Bearer 다음에 공백 추가


	    String apiURL = "https://openapi.naver.com/v1/nid/me";


	    Map<String, String> requestHeaders = new HashMap<>();
	    requestHeaders.put("Authorization", header);
	    JSONObject responseBody = get(apiURL,requestHeaders);

		Map<String, String> map = new HashMap<String, String>();
		map.put("name", responseBody.getString("name"));
		map.put("email", responseBody.getString("email"));
		return map;
		
//	    System.out.println(responseBody);
		
	}

	private static JSONObject get(String apiUrl, Map<String, String> requestHeaders){
        HttpURLConnection con = connect(apiUrl);
        try {
            con.setRequestMethod("GET");
            for(Map.Entry<String, String> header :requestHeaders.entrySet()) {
                con.setRequestProperty(header.getKey(), header.getValue());
            }


            int responseCode = con.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) { // 정상 호출
                return readBody(con.getInputStream());
            } else { // 에러 발생
                return readBody(con.getErrorStream());
            }
        } catch (IOException e) {
            throw new RuntimeException("API 요청과 응답 실패", e);
        } finally {
            con.disconnect();
        }
    }

	private static HttpURLConnection connect(String apiUrl){
        try {
            URL url = new URL(apiUrl);
            return (HttpURLConnection)url.openConnection();
        } catch (MalformedURLException e) {
            throw new RuntimeException("API URL이 잘못되었습니다. : " + apiUrl, e);
        } catch (IOException e) {
            throw new RuntimeException("연결이 실패했습니다. : " + apiUrl, e);
        }
    }

    private static JSONObject readBody(InputStream body){
        InputStreamReader streamReader = new InputStreamReader(body);


        try (BufferedReader lineReader = new BufferedReader(streamReader)) {
            StringBuilder responseBody = new StringBuilder();


            String line;
            while ((line = lineReader.readLine()) != null) {
                responseBody.append(line);
            }
            
            JSONObject obj = new JSONObject(responseBody.toString());
            obj.getJSONObject("response");

            return obj.getJSONObject("response");
        } catch (IOException e) {
            throw new RuntimeException("API 응답을 읽는데 실패했습니다.", e);
        }
    }

    @GetMapping("/success")
    public void success() {
    	log.info("success로 이동 ..........");

	}


    public  void kakaoLogin(HttpSession session, Model model ) {

    }

    

}
