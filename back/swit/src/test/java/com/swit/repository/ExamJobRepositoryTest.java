// package com.swit.repository;

// import java.time.LocalDate;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.data.domain.*;
// import com.swit.domain.Exam;
// import com.swit.domain.Job;


// import lombok.extern.log4j.Log4j2;

// @SpringBootTest
// @Log4j2
// public class ExamJobRepositoryTest {
//     @Autowired
//     private ExamRepository examRepository;
//     @Autowired
//     private JobRepository jobRepository;


//     @Test
//     public void test1(){
//         log.info("-----------");
//         log.info(examRepository);
//     }

//     //시험임시 데이터
//     @Test
//     public void examInsertTest(){
//         for(int i=1;i<=15;i++){
//             Exam exam = Exam.builder()
//             .examDesc("자격구분"+i)
//             .examTitle("시험제목"+i)
//             .examDocStart(LocalDate.of(2024, 6, i))
//             .examDocEnd(LocalDate.of(2024, 6, i+5))
//             .examDocRegStart(LocalDate.of(2024, 5, i))
//             .examDocRegEnd(LocalDate.of(2024, 5, i+5))
//             .examDocPass(LocalDate.of(2024, 6, i+10))
//             .examPracRegStart(LocalDate.of(2024, 6, i+12))
//             .examPracRegEnd(LocalDate.of(2024, 6, i+15))
//             .examPracStart(LocalDate.of(2024, 7, i))
//             .examPracEnd(LocalDate.of(2024, 7, i+5))
//             .examPracPass(LocalDate.of(2024, 7, i+10)).build();
//             examRepository.save(exam);
            
//         }
//     }

//     // 채용 임시데이터 삽입
//     @Test
//     public void jobInsertTest(){
//         for(int i=1;i<=10;i++){
//             Job job = Job.builder()
//             .jobTitle("채용제목"+i)
//             .jobCompany("회사명"+i)
//             .jobField("직무"+i)
//             .jobLoc("근무지"+i)
//             .jobDeadline(LocalDate.of(2024, 6, i))
//             .jobActive(1)
//             .jobExperience("경력조건"+i)
//             .jobType("고용형태"+i)
//             .jobUrl("사이트 url"+i).build();
//             jobRepository.save(job);
//         }
//     }

//     //데이터 조회 테스트
//     @Test
//     public void testRead(){
//         Integer examNo=2;
//         java.util.Optional<Exam> result = examRepository.findById(examNo);
//         Exam exam = result.orElseThrow();
//         log.info(exam);
//     }

//     //페이징 test
//     @Test
//     public void testPaging(){
//         Pageable pageable = PageRequest.of(0,5,Sort.by("examNo").descending());
//         Page<Exam> result = examRepository.findAll(pageable);
//         log.info(result.getTotalElements());
//         result.getContent().stream().forEach(exam -> log.info(exam));
//     }


// }
