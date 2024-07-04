package com.swit.service;


import java.time.LocalDate;
import java.util.*;
import java.net.*;
import java.io.*;
import java.nio.charset.StandardCharsets;

import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import com.swit.domain.Exam;
import com.swit.domain.FavoritesExam;
import com.swit.domain.FavoritesJob;
import com.swit.domain.Job;
import com.swit.domain.User;
import com.swit.dto.ExamDTO;
import com.swit.dto.JobDTO;
import com.swit.dto.PageRequestDTO;
import com.swit.dto.PageResponseDTO;
import com.swit.repository.ExamRepository;

import com.swit.repository.JobRepository;
import com.swit.repository.UserRepository;
import com.swit.repository.FavoritesExamRepository;
import com.swit.repository.FavoritesJobRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class ExamjobService {
    private final ModelMapper modelMapper;
    private final ExamRepository examRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final FavoritesExamRepository favoritesExamRepository;
    private final FavoritesJobRepository favoritesJobRepository;

    public PageResponseDTO<ExamDTO> examList(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize(),
                Sort.by("examPracRegEnd").descending());
        System.out.println("====================");
        System.out.println(pageable);

        Page<Exam> result = examRepository.findAll(pageable);
        List<ExamDTO> dtoList = result.getContent().stream()
                .map(exam -> modelMapper.map(exam, ExamDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<ExamDTO> responseDTO = PageResponseDTO.<ExamDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }

    // jobactive 설정 -> 날짜지나면 jobactive 0으로
    @Scheduled(fixedRate = 43200000, initialDelay = 0) // 12시간마다
    public void updateJobStatus() {
        LocalDate currentDate = LocalDate.now();
        List<Job> jobsToUpdate = jobRepository.findByJobDeadlineBeforeAndJobActive(currentDate.minusDays(1), 1);
        jobsToUpdate.forEach(job -> job.setJobActive(0));
        jobRepository.saveAll(jobsToUpdate);
    }


    public PageResponseDTO<JobDTO> jobList(PageRequestDTO pageRequestDTO, String searchKeyword, String jobField, String sort) {
        Sort sorting;
        if ("deadline".equals(sort)) {
            sorting = Sort.by("jobDeadline").ascending(); // 마감 임박순
        } else {
            sorting = Sort.by("jobNo").descending(); // 기본 정렬
        }
        
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize(),
                sorting);

        Page<Job> result;
        if (searchKeyword != null && !searchKeyword.isEmpty() && jobField != null && !jobField.isEmpty()) { // 직무선택, 검색어 입력한경우
            result = jobRepository.findByJobFieldContainingAndJobTitleContainingAndJobActive(jobField, searchKeyword, 1, pageable);
        } else if (searchKeyword != null && !searchKeyword.isEmpty()) { // 검색어만 입력한경우
            result = jobRepository.findByJobTitleContainingAndJobActive(searchKeyword, 1, pageable);
        } else if (jobField != null && !jobField.isEmpty()) { // 직무만 선택한경우
            result = jobRepository.findByJobFieldContainingAndJobTitleContainingAndJobActive(jobField, "", 1, pageable);
        } else { // 기본
            result = jobRepository.findByJobActive(1, pageable);
        }

        List<JobDTO> dtoList = result.getContent().stream()
                .map(job -> modelMapper.map(job, JobDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<JobDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    public ExamDTO examRead(Integer examNo) {
        Optional<Exam> result = examRepository.findById(examNo);
        Exam exam = result.orElseThrow();
        ExamDTO dto = modelMapper.map(exam, ExamDTO.class);
        return dto;
    }

    public JobDTO jobRead(Integer jobNo) {
        Optional<Job> result = jobRepository.findById(jobNo);
        Job job = result.orElseThrow();
        JobDTO dto = modelMapper.map(job, JobDTO.class);
        return dto;
    }

    //시험 전체 불러오기
    public List<ExamDTO> examAll() {
        List<Exam> exams = examRepository.findAll();
        return exams.stream()
                    .map(exam -> modelMapper.map(exam, ExamDTO.class))
                    .collect(Collectors.toList());
    }

    //시험 검색 -> 전체 불러오기
    public List<ExamDTO> examSearchAll(String searchKeyword) {
        List<Exam> exams = examRepository.findByExamTitleContaining(searchKeyword);
        return exams.stream()
        .map(exam -> modelMapper.map(exam, ExamDTO.class))
        .collect(Collectors.toList());
    }


    // 채용 검색
    // public PageResponseDTO<JobDTO> jobSearch(PageRequestDTO pageRequestDTO, String searchKeyword) {
    //     Pageable pageable = PageRequest.of(
    //             pageRequestDTO.getPage() - 1, // 1페이지가 0
    //             pageRequestDTO.getSize(),
    //             Sort.by("jobDeadline").descending());
    //     System.out.println("====================");
    //     System.out.println(pageable);

    //     Page<Job> result = jobRepository.findByJobTitleContaining(searchKeyword, pageable);
    //     List<JobDTO> dtoList = result.getContent().stream()
    //             .map(job -> modelMapper.map(job, JobDTO.class))
    //             .collect(Collectors.toList());

    //     long totalCount = result.getTotalElements();
    //     PageResponseDTO<JobDTO> responseDTO = PageResponseDTO.<JobDTO>withAll()
    //             .dtoList(dtoList)
    //             .pageRequestDTO(pageRequestDTO)
    //             .totalCount(totalCount)
    //             .build();
    //     return responseDTO;

    // }

    // 시험 검색
    public PageResponseDTO<ExamDTO> examSearch(PageRequestDTO pageRequestDTO, String searchKeyword) {
        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1, // 1페이지가 0
                pageRequestDTO.getSize(),
                Sort.by("examPracRegEnd").descending());

        Page<Exam> result = examRepository.findByExamTitleContaining(searchKeyword, pageable);
        List<ExamDTO> dtoList = result.getContent().stream()
                .map(exam -> modelMapper.map(exam, ExamDTO.class))
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();
        PageResponseDTO<ExamDTO> responseDTO = PageResponseDTO.<ExamDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
        return responseDTO;
    }



    //시험 즐겨찾기
    @Transactional
    public boolean addFavorite(String userId, Integer examNo) {
        
            User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Usr못찾으"));
            Exam exam = examRepository.findById(examNo).orElseThrow(() -> new RuntimeException("Exam못찾음"));

            if (!favoritesExamRepository.existsByUserAndExam(user, exam)) {
                FavoritesExam favoritesExam = new FavoritesExam();
                favoritesExam.setUser(user);
                favoritesExam.setExam(exam);
                favoritesExamRepository.save(favoritesExam);
                return true;
            }
            return false;
      
    }

    @Transactional
    public boolean removeFavorite(String userId, Integer examNo) throws Exception {
        try {
            User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Usr못찾으2"));
            Exam exam = examRepository.findById(examNo).orElseThrow(() -> new RuntimeException("Exam못찾음2"));

            if (favoritesExamRepository.existsByUserAndExam(user, exam)) {
                favoritesExamRepository.deleteByUserAndExam(user, exam);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new Exception("즐겨찾기삭제에러", e);
        }
    }

    @Transactional
    public boolean isFavorite(String userId, Integer examNo) throws Exception {
        try {
            User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Usr못찾으3"));
            Exam exam = examRepository.findById(examNo).orElseThrow(() -> new RuntimeException("Exam못찾음3"));
            return favoritesExamRepository.existsByUserAndExam(user, exam);
        } catch (Exception e) {
            throw new Exception("ifFavorite에러", e);
        }
    }

    

    //채용 즐겨찾기
    @Transactional
    public boolean addJobFavorite(String userId, Integer jobNo) {
        
            User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Usr못찾으"));
            Job job = jobRepository.findById(jobNo).orElseThrow(() -> new RuntimeException("job못찾음"));

            if (!favoritesJobRepository.existsByUserAndJob(user, job)) {
                FavoritesJob favoritesJob = new FavoritesJob();
                favoritesJob.setUser(user);
                favoritesJob.setJob(job);
                favoritesJobRepository.save(favoritesJob);
                return true;
            }
            return false;
      
    }

    @Transactional
    public boolean removeJobFavorite(String userId, Integer jobNo) throws Exception {
        try {
            User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Usr못찾으2"));
            Job job = jobRepository.findById(jobNo).orElseThrow(() -> new RuntimeException("job못찾음2"));

            if (favoritesJobRepository.existsByUserAndJob(user, job)) {
                favoritesJobRepository.deleteByUserAndJob(user, job);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new Exception("즐겨찾기삭제에러", e);
        }
    }

    @Transactional
    public boolean isJobFavorite(String userId, Integer jobNo) throws Exception {
        try {
            User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Usr못찾으3"));
            Job job = jobRepository.findById(jobNo).orElseThrow(() -> new RuntimeException("job못찾음3"));
            return favoritesJobRepository.existsByUserAndJob(user, job);
        } catch (Exception e) {
            throw new Exception("ifFavorite에러", e);
        }
    }


    //캘린더 -> 즐겨찾기만 불러오기
    public List<ExamDTO> getFavoriteExams(String userId) {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("user못찾음"));
        List<FavoritesExam> favoriteExams = favoritesExamRepository.findByUser(user);
        return favoriteExams.stream()
            .map(favExam -> modelMapper.map(favExam.getExam(), ExamDTO.class))
            .collect(Collectors.toList());
    }
    

    // 즐겨찾기된 채용 목록 가져오기
    public List<JobDTO> getFavoriteJobs(String userId) {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("user못찾음"));
        List<FavoritesJob> favoriteJobs = favoritesJobRepository.findByUser(user);
        return favoriteJobs.stream()
            .map(favJob -> modelMapper.map(favJob.getJob(), JobDTO.class))
            .collect(Collectors.toList());
    }

    //주기적으로 api 불러오기
    @Value("${apiKey.saramin_KEY}")
    private String saraminKey;

    @Scheduled(fixedRate = 86400000) // 24시간마다
    public void fetchAndSaveJobData() throws Exception {
        String accessKey = saraminKey;
        String text = URLEncoder.encode("", "UTF-8");
        String apiURL = 
        "https://oapi.saramin.co.kr/job-search?access-key="+accessKey+"&stock=kospi+kosdaq+konex&sr=directhire&job_type=1&edu_lv=3%2C8&fields=posting-date+expiration-date+keyword-code+count&start=1&count=10"+"&keyword="+ text;
       
        try {
            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Accept", "application/json");

            int responseCode = con.getResponseCode();
            BufferedReader br;

            if (responseCode == 200) { // 정상 호출
                br = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8));
            } else { // 에러 발생
                br = new BufferedReader(new InputStreamReader(con.getErrorStream(), StandardCharsets.UTF_8));
            }

            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();


            //////////////
            log.info("API Response: {}", response.toString());

            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(response.toString());
            JSONObject jobs = (JSONObject) jsonObject.get("jobs");

            JSONArray job = (JSONArray) jobs.get("job");

            for (int i = 0; i < job.size(); i++) {
                JSONObject tmp = (JSONObject) job.get(i);
                JSONObject companyObject = (JSONObject) jsonParser.parse(tmp.get("company").toString());
                JSONObject companyDetail = (JSONObject) companyObject.get("detail");
                JSONObject positionObject = (JSONObject) jsonParser.parse(tmp.get("position").toString());

                String loc = (((JSONObject) jsonParser.parse(positionObject.get("location").toString())).get("name")).toString();
                loc = loc.replace(" &gt; ", " "); // 근무지

                String expirationDate = (tmp.get("expiration-date")).toString();
                expirationDate = expirationDate.substring(0, 10); // 마감날짜

                Job aJob = Job.builder()
                        .jobTitle((positionObject.get("title")).toString())
                        .jobCompany((companyDetail.get("name")).toString())
                        .jobField((((JSONObject) jsonParser.parse(positionObject.get("job-mid-code").toString())).get("name")).toString())
                        .jobLoc(loc)
                        .jobDeadline(LocalDate.parse(expirationDate, DateTimeFormatter.ISO_DATE))
                        .jobActive(Integer.parseInt((tmp.get("active")).toString()))
                        .jobExperience((((JSONObject) jsonParser.parse(positionObject.get("experience-level").toString())).get("name")).toString())
                        .jobType((((JSONObject) jsonParser.parse(positionObject.get("job-type").toString())).get("name")).toString())
                        .jobUrl((companyDetail.get("href")).toString())
                        .build();

                        //////////
                        // log.info("Saving job: {}", aJob);


                jobRepository.save(aJob);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
