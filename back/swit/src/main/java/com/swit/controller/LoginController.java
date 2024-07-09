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
import java.util.Optional;

import org.json.JSONObject;
// SpringBoot 3.x 부터는 jakarta 사용
// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpSession;
// --------
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import com.swit.dto.UserDTO;
// import com.mysql.cj.xdevapi.JsonParser;
// import com.fasterxml.jackson.core.JsonParser;
import com.swit.domain.User;
import com.swit.service.UserService;
import com.swit.jwt.JWTUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;  // 추가: 새로운 방식으로 SecretKey 생성을 위한 클래스

// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
// import org.springframework.boot.json.JsonParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;



@RestController
@RequiredArgsConstructor
@Log4j2

public class LoginController {

    private final UserService userService;

    private final JWTUtil JWTUtil;

	@Value("${api.naver.clientKey}")
    private String naverClientKey;
    @Value("${api.naver.secretKey}")
    private String naverClientSecret;
    @Value("${api.naver.redirectUrl}")
    private String naverRedirectUrl;

	@Value("${api.kakao.clientKey}")
    private String kakaoClientKey;
	@Value("${api.kakao.redirectUrl}")
	private String kakaoRedirectUrl;


    @GetMapping("/snslogin")
	public Map<String, String> snsLogin(HttpSession session) {
		log.info("snslogin --------- start");

		String naverURL = naverLogin(session);  
		String kakaoURL = kakaoLogin(session);  
		
		return Map.of("naverURL", naverURL, "kakaoURL", kakaoURL);

    }

	// @PostMapping("/")
    // public Map<String, String> postOne(@RequestBody UserDTO userDTO, HttpSession session) {
	// 	log.info("login --------- start" );
	// 	String  user_id    = userDTO.getUserId();
		
	// 	UserDTO searchUser = new UserDTO();
    //     searchUser = userService.get(userDTO.getUserId());
		
	// 	if (userDTO.getUserId().equalsIgnoreCase(searchUser.getUserId())
	// 	&&  userDTO.getUserPassword().equals(searchUser.getUserPassword())) {

	// 		log.info("UserDTO : "+ searchUser);

	// 	}

    //     return Map.of("user_id", user_id);
    // }

/**
     * 🔐➡👩‍💼 JWT 를 해석하는 요청
     * 
     * @param header
     * @return
     */
    @GetMapping("/api/login_user")
    public ResponseEntity<?> userInfo(@RequestHeader(name="Authorization") String header) {

        log.info("===== header =====");
        log.info("Authorization : " + header);

        String jwt = header.substring(7);           // "Bearer " + jwt  ➡ jwt 추출

        log.info("jwt : " + jwt);

        SecretKey secretKey = JWTUtil.getSecretKey();
        // byte[] signingKey = JWTUtil.getSecretKey().getBytes();

        log.info("secretKey : " + secretKey);
        // log.info("signingKey : " + signingKey);

        // TODO : deprecated 업애기 (version: before 1.0)
        // Jws<Claims> parsedToken = Jwts.parser()
        //                                 .setSigningKey(signingKey)
        //                                 .build()
        //                                 .parseClaimsJws(jwt);

        // OK : deprecated 된 코드 업데이트 (version : after 1.0)
        // - setSigningKey(byte[]) ➡ verifyWith(SecretKey)
        // - parseClaimsJws(CharSequence) ➡ parseSignedClaims(CharSequence)
        Jws<Claims> parsedToken = Jwts.parser()
                                        .verifyWith(secretKey)
                                        .build()
                                        .parseSignedClaims(jwt);
        log.info("parsedToken : " + parsedToken);
                
		String userNo = parsedToken.getPayload().get("userNo").toString();
		int no = (userNo == null ? 0 : Integer.parseInt(userNo));
		String userId = parsedToken.getPayload().get("userId").toString();
		String userNick = parsedToken.getPayload().get("userNick").toString();
		String userRole = parsedToken.getPayload().get("userRole").toString();

		UserDTO userDTO = new UserDTO();
		userDTO.setUserNo(no);
		userDTO.setUserId(userId);
		userDTO.setUserNick(userNick);
		userDTO.setUserRole(userRole);

        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PostMapping("/api/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("Refreshtoken") String refreshToken) {
      log.info("!!!!!!!!!!!!!!!!!!!!refresh실행");
        try {
            String userNo = JWTUtil.getNo(refreshToken);
            String userId = JWTUtil.getUserId(refreshToken);
            String userNick = JWTUtil.getNick(refreshToken);
            String userRole = JWTUtil.getRole(refreshToken);
            String newAccessToken = JWTUtil.createJwt(userNo, userId, userNick, userRole, 3 * 60 * 60 * 1000L); // 3시간 유효

            return ResponseEntity.ok().header("Authorization", "Bearer " + newAccessToken).body("New token generated");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }

    public  String naverLogin(HttpSession session) {
		log.info("naver --------- start");
		String naverURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
		try {
		    String clientId = naverClientKey;
			String url = naverRedirectUrl;
            String redirectURI = URLEncoder.encode(url, "UTF-8");

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

		return naverURL;
	}

	public  String kakaoLogin(HttpSession session) {
		log.info("kakao --------- start");
		String kakaoURL = "https://kauth.kakao.com/oauth/authorize?response_type=code";
		try {
		    String clientId = kakaoClientKey;
			String url = kakaoRedirectUrl;
            String redirectURI = URLEncoder.encode(url, "UTF-8");

		    // SecureRandom random = new SecureRandom();
		    // String state = new BigInteger(130, random).toString();
		    
		    kakaoURL += "&client_id=" + clientId;
		    kakaoURL += "&redirect_uri=" + redirectURI;
		    // kakaoURL += "&state=" + state;
		    // session.setAttribute("state", state);
		    
		} catch (Exception e) {
		      System.out.println(e);
		}
		log.info("kakaoURL : ["+ kakaoURL + "]");

		return kakaoURL;
	}

	@GetMapping("/snslogin/naver_callback")
	// public ModelAndView callback(@RequestParam ("code") String code,
	// public String callback(@RequestParam ("code") String code,
	public RedirectView  callback(@RequestParam ("code") String code,
						   @RequestParam ("state") String state,
						   RedirectAttributes rttr,
						   HttpServletRequest request) {
		Map<String, String> profile = null;
        UserDTO user = new UserDTO();
		String access_token = "";
		String password = "";
		String userNo = "";

	    try {
		    String clientId = naverClientKey;
			String url_2 = naverRedirectUrl;
		    String clientSecret = naverClientSecret;
		    String redirectURI = URLEncoder.encode(url_2, "UTF-8");
		    String apiURL;
		    apiURL = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&";
		    apiURL += "client_id=" + clientId;
		    apiURL += "&client_secret=" + clientSecret;
		    apiURL += "&redirect_uri=" + redirectURI;
		    apiURL += "&code=" + code;
		    apiURL += "&state=" + state;

            // String refresh_token = "";
		    // System.out.println("apiURL="+apiURL);

            URL url = new URL(apiURL);
	        HttpURLConnection con = (HttpURLConnection)url.openConnection();
	        con.setRequestMethod("GET");
	        int responseCode = con.getResponseCode();
	        BufferedReader br;
	        // System.out.print("responseCode="+responseCode);
	        if(responseCode==200) { // 정상 호출
	            br = new BufferedReader(new InputStreamReader(con.getInputStream()));
	        } else {  // 에러 발생
	            br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
	        }
	        String inputLine;
	        StringBuffer res = new StringBuffer();
	        while ((inputLine = br.readLine()) != null) {
	            res.append(inputLine);
	        }
            
	        JSONObject obj = new   JSONObject(res.toString());
		    access_token = obj.getString("access_token");
		    //System.out.print("access_token="+access_token);
		  
            profile = getProfile(access_token);

			System.out.println("user="+profile.get("userName") + profile.get("userEmail") + profile.get("userSnsConnect"));
		
			user = userService.userCheck((String)profile.get("userEmail")); 
			
			password = access_token.substring(12, 29);

			System.out.println("user1111="+user);
			// Optional<UserDTO> optionalUser = Optional.ofNullable(user);				// UserId 숫자형일때
			// if (optionalUser.map(UserDTO::getUserId).orElse(0L) == 0) {  			
			// if (user.getUserId().equals(null) || user.getUserId().length() == 0) {  	// 에러 발생
			// if (StringUtils.isEmpty(user.getUserId())) {								// 문자일때 방법 1
			// if (user.getUserId() == null || user.getUserId().isEmpty()) {      		// 문자일때 방법 2
			Optional<String> optionalUserId = Optional.ofNullable(user.getUserId());	// 문자일때 방법 3
			if (optionalUserId.map(String::isEmpty).orElse(true)) {
				
				System.out.println("user2222="+user);
				user.setUserName((String)profile.get("userName"));
				user.setUserEmail((String)profile.get("userEmail"));
				user.setUserSnsConnect((String)profile.get("userSnsConnect"));  // "NAVER"

				user.setUserPassword(password);
				// 저장
				System.out.println("user3333="+user);
				userService.join(user);
				System.out.println("user4444="+user);
				// 저장 후 다시 조회
				user = userService.userCheck((String)profile.get("userEmail")); 
				System.out.println("user5555="+user);						   
				// userId 를 update 한다.
				user.setUserId(user.getUserNo().toString());
				// password가 암호화 있으므로 다시 set 해서 동일한 비번으로 처리한다.
				user.setUserPassword(password);
				System.out.println("user6666="+user);	
				userService.join(user);
			} else {
				user.setUserPassword(password);
				userService.join(user);

			}
			System.out.println("user7777="+user);
			System.out.println("tok="+password);
            br.close();
	        if(responseCode==200) {
    	        System.out.println("responseCode == 200" + res.toString());
	        }
	    } catch (Exception e) {
	      System.out.println(e);
	    }
	    String userId = user.getUserId();
	    rttr.addFlashAttribute("tok", password);
        rttr.addFlashAttribute("name", userId);
		// log.info("Transferred data: user={}, msg={}", user, "naver계정으로 로그인 성공!!!");
		// 원복KYW
		return new RedirectView("http://swit.kro.kr:15270/callback?tok=" + access_token + "&name=" + userId);
		// return new RedirectView("http://localhost:3000/callback?tok=" + access_token + "&name=" + userId);

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
		map.put("userName", responseBody.getString("name"));
		map.put("userEmail", responseBody.getString("email"));
		map.put("userSnsConnect", "NAVER");
		return map;
	
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

    // @GetMapping("/success")
    // public void success() {
    // 	log.info("success로 이동 ..........");
    //     return ;

	// }


    @GetMapping("/snslogin/kakao_callback")
	public RedirectView callbackKaKao(@RequestParam ("code") String code,
						   		// @RequestParam ("state_kakao") String state,
						   		RedirectAttributes rttr,
						   		HttpServletRequest request) {
		Map<String, String> profile = null;
        UserDTO user = new UserDTO();
		String access_token = "";
		String password = "";
	    try {
		    String clientId = kakaoClientKey;
			String url_2 = kakaoRedirectUrl;
		    //String clientSecret = naverClientSecret;
		    String redirectURI = URLEncoder.encode(url_2, "UTF-8");
		    String apiURL;
		    apiURL = "https://kauth.kakao.com/oauth/token?grant_type=authorization_code&";
		    apiURL += "client_id=" + clientId;
		    //apiURL += "&client_secret=" + clientSecret;
		    apiURL += "&redirect_uri=" + redirectURI;
		    apiURL += "&code=" + code;
		    //apiURL += "&state=" + state;
		    access_token = "";
            // String refresh_token = "";
		    // System.out.println("apiURL="+apiURL);

            URL url = new URL(apiURL);
	        HttpURLConnection con = (HttpURLConnection)url.openConnection();
	        //con.setRequestMethod("GET");
			con.setDoOutput(true);     // Post 방식 처리
			con.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
			
	        int responseCode = con.getResponseCode();
	        BufferedReader br;
	        // System.out.print("responseCode="+responseCode);
	        if(responseCode==200) { // 정상 호출
	            br = new BufferedReader(new InputStreamReader(con.getInputStream()));
	        } else {  // 에러 발생
	            br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
	        }
	        String inputLine;
	        StringBuffer res = new StringBuffer();
	        while ((inputLine = br.readLine()) != null) {
	            res.append(inputLine);
	        }
            
	        JSONObject obj = new   JSONObject(res.toString());
		    access_token = obj.getString("access_token");
		    //System.out.print("access_token="+access_token);
		  
            profile = getProfileKakao(access_token);

			System.out.println("userNick="+profile.get("userNick") + profile.get("userEmail") + profile.get("userSnsConnect"));
		
			user = userService.userCheck((String)profile.get("userEmail")); 
			
			password = access_token.substring(12, 29);

			System.out.println("user1111="+user);
			// Optional<UserDTO> optionalUser = Optional.ofNullable(user);				// UserId 숫자형일때
			// if (optionalUser.map(UserDTO::getUserId).orElse(0L) == 0) {  			
			// if (user.getUserId().equals(null) || user.getUserId().length() == 0) {  	// 에러 발생
			// if (StringUtils.isEmpty(user.getUserId())) {								// 문자일때 방법 1
			// if (user.getUserId() == null || user.getUserId().isEmpty()) {      		// 문자일때 방법 2
			Optional<String> optionalUserId = Optional.ofNullable(user.getUserId());	// 문자일때 방법 3
			if (optionalUserId.map(String::isEmpty).orElse(true)) {

				System.out.println("user2222="+user);
				user.setUserNick((String)profile.get("userNick"));
				user.setUserEmail((String)profile.get("userEmail"));
				user.setUserSnsConnect((String)profile.get("userSnsConnect"));  // "KAKAO"

				user.setUserPassword(password);
				// 저장
				System.out.println("user3333="+user);
				userService.join(user);
				System.out.println("user4444="+user);
				// 저장 후 다시 조회
				user = userService.userCheck((String)profile.get("userEmail")); 
				System.out.println("user5555="+user);						   
				// userId 를 update 한다.
				user.setUserId(user.getUserNo().toString());
				// password가 암호화 있으므로 다시 set 해서 동일한 비번으로 처리한다.
				user.setUserPassword(password);
				System.out.println("user6666="+user);	
				userService.join(user);
			} else {
				user.setUserPassword(password);
				userService.join(user);

			}
			System.out.println("user7777="+user);
			System.out.println("tok="+password);
            br.close();
	        if(responseCode==200) {
    	        System.out.println("responseCode == 200" + res.toString());
	        }
	    } catch (Exception e) {
	      System.out.println(e);
	    }
	    String userId = user.getUserId();
	    rttr.addFlashAttribute("tok", password);
        rttr.addFlashAttribute("name", userId);
		// log.info("Transferred data: user={}, msg={}", user, "naver계정으로 로그인 성공!!!");
		// 원복KYW
		return new RedirectView("http://swit.kro.kr:15270/callback?tok=" + access_token + "&name=" + userId);
		// return new RedirectView("http://localhost:3000/callback?tok=" + access_token + "&name=" + userId);

	}

		  
        //     br.close();
	    //     if(responseCode==200) {
    	//         System.out.println("responseCode == 200" + res.toString());
	    //     }
	    // } catch (Exception e) {
	    //   System.out.println(e);
	    // }
	      
	    // // rttr.addFlashAttribute("user", user);
        // // rttr.addFlashAttribute("msg", "naver계정으로 로그인 성공!!!");

		// // return new RedirectView("http://localhost:3000/callback?tok=" + access_token + "&name=" + userId);
		// return new RedirectView("http://localhost:3000/callback");
	// }

	private Map<String, String> getProfileKakao(String token){

		HashMap<String, String> userInfo = new HashMap<>();
		String reqUrl = "https://kapi.kakao.com/v2/user/me";
    try{
        URL url = new URL(reqUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + token);
        // conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        int responseCode = conn.getResponseCode();
        log.info("[KakaoApi.getUserInfo] responseCode : {}",  responseCode);

        BufferedReader br;
        if (responseCode == 200) {
			br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
        } else {
            br = new BufferedReader(new InputStreamReader(conn.getErrorStream(), "utf-8"));
        }


        String line = "";
        StringBuilder responseSb = new StringBuilder();
        while((line = br.readLine()) != null){
            responseSb.append(line);
        }
        String result = responseSb.toString();
        log.info("responseBody = {}", result);

        JsonParser parser = new JsonParser();
        JsonElement element = parser.parse(result);

        JsonObject properties = element.getAsJsonObject().get("properties").getAsJsonObject();
        JsonObject kakaoAccount = element.getAsJsonObject().get("kakao_account").getAsJsonObject();
		System.out.println("getProfileKakao properties= "+ properties);
        String userEmail = kakaoAccount.getAsJsonObject().get("email").getAsString();
		// // String nick = properties.getAsJsonObject().get("nickname").getAsString();
		// String nick = null;
		// if (properties.getAsJsonObject().has("nickname")) {
    	// 	nick = properties.getAsJsonObject().get("nickname").getAsString();
		// 	// 한글이 깨짐
		// 	System.out.println("getProfileKakao nick= "+nick);
		// 	nick = new String(nick.getBytes("UTF-8"), "UTF-8");
		// 	System.out.println("getProfileKakao nick= "+nick);
		// }
		// String userNick = nick == null ? "noName" : nick;

		String nick = properties.getAsJsonObject().get("nickname").getAsString();
		String userNick = nick == null ? "noName" : nick;

		System.out.println("getProfileKakao userNick= "+userNick);
		System.out.println("getProfileKakao userEmail= "+userEmail);

        userInfo.put("userNick", userNick);
        userInfo.put("userEmail", userEmail);
		userInfo.put("userSnsConnect", "KAKAO");
		
        br.close();

    }catch (Exception e){
        e.printStackTrace();
    }
    return userInfo;
    
	}

    

}
