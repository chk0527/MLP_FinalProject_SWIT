// package com.swit;

// import java.io.BufferedReader;
// import java.io.IOException;
// import java.io.InputStreamReader;
// import java.net.*;
// import java.time.LocalDate;
// import java.time.format.DateTimeFormatter;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// import javax.xml.parsers.DocumentBuilderFactory;

// import org.json.simple.JSONArray;
// import org.json.simple.JSONObject;
// import org.json.simple.parser.JSONParser;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.context.annotation.PropertySource;
// import org.springframework.stereotype.Component;
// import org.springframework.stereotype.Service;
// import org.springframework.test.context.TestPropertySource;
// import org.w3c.dom.Document;
// import org.w3c.dom.Element;
// import org.w3c.dom.Node;
// import org.w3c.dom.NodeList;

// import com.swit.domain.Exam;
// import com.swit.domain.Job;

// import com.swit.repository.ExamRepository;
// import com.swit.repository.JobRepository;
// import com.swit.service.ExamjobService;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.log4j.Log4j2;

// @Log4j2
// @SpringBootTest(properties = "spring.config.location=" +
//         "classpath:/application.yml" +
//         ",classpath:/application-apiKey.yml")
// @RequiredArgsConstructor

// public class CallExamJobApi {
//     @Autowired
//     private ExamRepository examRepository;
//     @Autowired
//     private JobRepository jobRepository;

//     @Value("${apiKey.saramin_KEY}")
//     private String saraminKey;
//     @Value("${apiKey.data_KEY}")
//     private String dataKey;

//     @Test
//     public void examApi() throws IOException {
//         String key = dataKey;
//         System.out.println("공공데이터키: " + key);
//         String[] aUrl = { "http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getPEList", // 기술사
//                 "http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getMCList", // 기능장
//                 "http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getEList", // 기사, 산업기사
//                 "http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getCList" }; // 기능사

//         for (int j = 0; j < aUrl.length; j++) {
//             StringBuilder urlBuilder = new StringBuilder(aUrl[j]); /* URL */
//             urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=" + key); /* Service Key */
//             apiExplorer(urlBuilder);

//             try {
//                 Document documentInfo = null;
//                 documentInfo = (Document) DocumentBuilderFactory.newInstance().newDocumentBuilder()
//                         .parse(urlBuilder.toString());
//                 documentInfo.getDocumentElement().normalize();
//                 System.out.println("===============================");
//                 System.out.println(documentInfo.getDocumentElement().getNodeName()); // response
//                 System.out.println("===============================");

//                 Element root = documentInfo.getDocumentElement();
//                 NodeList nList = root.getElementsByTagName("items").item(0).getChildNodes();
//                 DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

//                 for (int i = 0; i < nList.getLength(); i++) {
//                     Node nNode = nList.item(i);
//                     Element eElement = (Element) nNode;

//                     if (getTagValue("docexamdt", eElement).equals("XXXXXXXX")) {
//                         Exam exam = Exam.builder()
//                                 .examTitle(getTagValue("description", eElement))
//                                 .examPracEnd(LocalDate.parse(getTagValue("pracexamenddt", eElement), formatter))
//                                 .examPracStart(LocalDate.parse(getTagValue("pracexamstartdt", eElement), formatter))
//                                 .examPracPass(LocalDate.parse(getTagValue("pracpassdt", eElement), formatter))
//                                 .examPracRegEnd(LocalDate.parse(getTagValue("pracregenddt", eElement), formatter))
//                                 .examPracRegStart(LocalDate.parse(getTagValue("pracregstartdt", eElement), formatter))
//                                 .build();
//                         examRepository.save(exam);
//                     } else {
//                         Exam exam = Exam.builder()
//                                 .examTitle(getTagValue("description", eElement))
//                                 .examDocEnd(LocalDate.parse(getTagValue("docexamdt", eElement), formatter))
//                                 .examDocPass(LocalDate.parse(getTagValue("docpassdt", eElement), formatter))
//                                 .examDocRegEnd(LocalDate.parse(getTagValue("docregenddt", eElement), formatter))
//                                 .examDocRegStart(LocalDate.parse(getTagValue("docregstartdt", eElement), formatter))
//                                 .examPracEnd(LocalDate.parse(getTagValue("pracexamenddt", eElement), formatter))
//                                 .examPracStart(LocalDate.parse(getTagValue("pracexamstartdt", eElement), formatter))
//                                 .examPracPass(LocalDate.parse(getTagValue("pracpassdt", eElement), formatter))
//                                 .examPracRegEnd(LocalDate.parse(getTagValue("pracregenddt", eElement), formatter))
//                                 .examPracRegStart(LocalDate.parse(getTagValue("pracregstartdt", eElement), formatter))
//                                 .build();
//                         examRepository.save(exam);
//                     }
//                 }
//             } catch (Exception e) {
//                 e.getMessage();
//             }
//         }
//     }

//     // api 불러오기
//     private void apiExplorer(StringBuilder urlBuilder) throws IOException {
//         URL url = new URL(urlBuilder.toString());
//         HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//         conn.setRequestMethod("GET");
//         conn.setRequestProperty("Content-type", "application/json");
//         System.out.println("Response code: " + conn.getResponseCode());
//         BufferedReader rd;
//         if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
//             rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
//         } else {
//             rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
//         }
//         StringBuilder sb = new StringBuilder();
//         String line;
//         while ((line = rd.readLine()) != null) {
//             sb.append(line);
//         }
//         rd.close();
//         conn.disconnect();
//         System.out.println(sb.toString());
//     }

//     // 태그값 불러오기
//     private static String getTagValue(String tag, Element eElement) {
//         NodeList nList = null;
//         Node nValue = null;
//         try {
//             nList = eElement.getElementsByTagName(tag).item(0).getChildNodes();
//             nValue = (Node) nList.item(0);
//         } catch (Exception e) {
//             e.printStackTrace();
//         }
//         if (nValue == null)
//             return null;
//         return nValue.getNodeValue();
//     }

//     // 채용 api
//     @Test
//     public void jobApi() throws Exception {

//         String accessKey = saraminKey; // 발급받은 accessKey";
//         String apiURL = "https://oapi.saramin.co.kr/job-search?access-key=" + accessKey
//                 + "&stock=kospi+kosdaq+konex&job_type=&edu_lv=&fields=posting-date+expiration-date+keyword-code+count&start=1&count=100";

//         try {
//             // String text = URLEncoder.encode("", "UTF-8");
//             // String apiURL =
//             // "https://oapi.saramin.co.kr/job-search?access-key="+accessKey+"&keyword="+
//             // text;

//             URL url = new URL(apiURL);
//             HttpURLConnection con = (HttpURLConnection) url.openConnection();
//             con.setRequestMethod("GET");
//             con.setRequestProperty("Accept", "application/json");

//             int responseCode = con.getResponseCode();
//             BufferedReader br;

//             if (responseCode == 200) { // 정상 호출
//                 br = new BufferedReader(new InputStreamReader(con.getInputStream()));
//             } else { // 에러 발생
//                 br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
//             }

//             String inputLine;
//             StringBuffer response = new StringBuffer();
//             while ((inputLine = br.readLine()) != null) {
//                 response.append(inputLine);
//             }
//             br.close();
//             // System.out.println(response.toString());

//             JSONParser jsonParser = new JSONParser();
//             JSONObject jsonObject = (JSONObject) jsonParser.parse(response.toString());
//             JSONObject jobs = (JSONObject) jsonObject.get("jobs");

//             JSONArray job = (JSONArray) jobs.get("job");

//             for (int i = 0; i < job.size(); i++) {

//                 JSONObject tmp = (JSONObject) job.get(i);
//                 JSONObject companyObject = (JSONObject) jsonParser.parse(tmp.get("company").toString());
//                 JSONObject companyDetail = (JSONObject) companyObject.get("detail");
//                 JSONObject positionObject = (JSONObject) jsonParser.parse(tmp.get("position").toString());

//                 String loc = (((JSONObject) jsonParser.parse(positionObject.get("location").toString())).get("name"))
//                         .toString();
//                 loc = loc.replace(" &gt; ", " "); // 근무지

//                 String expirationDate = (tmp.get("expiration-date")).toString();
//                 expirationDate = expirationDate.substring(0, 10); // 마감날짜

//                 Job aJob = Job.builder()
//                         .jobTitle((positionObject.get("title")).toString())
//                         .jobCompany((companyDetail.get("name")).toString())
//                         .jobField((((JSONObject) jsonParser.parse(positionObject.get("job-mid-code").toString()))
//                                 .get("name")).toString())
//                         .jobLoc(loc)
//                         .jobDeadline(LocalDate.parse(expirationDate, DateTimeFormatter.ISO_DATE))
//                         .jobActive(Integer.parseInt((tmp.get("active")).toString()))
//                         .jobExperience(
//                                 (((JSONObject) jsonParser.parse(positionObject.get("experience-level").toString()))
//                                         .get("name")).toString())
//                         .jobType(
//                                 (((JSONObject) jsonParser.parse(positionObject.get("job-type").toString())).get("name"))
//                                         .toString())
//                         .jobUrl((companyDetail.get("href")).toString())
//                         .build();
//                 jobRepository.save(aJob);
//             }
//         } catch (Exception e) {
//             System.out.println(e);
//         }
//     }
// }
