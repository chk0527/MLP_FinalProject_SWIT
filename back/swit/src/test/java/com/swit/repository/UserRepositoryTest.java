// package com.swit.repository;

// import java.time.LocalDateTime;
// import java.util.Optional;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.transaction.annotation.Transactional;

// import com.swit.domain.User;

// import lombok.extern.log4j.Log4j2;

// @Log4j2
// @SpringBootTest
// public class UserRepositoryTest {
//     @Autowired
//     private UserRepository userRepository;
//     @Autowired
//     GroupRepository groupRepository;
//     @Autowired
//     private AdminRepository adminRepository;

//     @Test
//     public void test() {
//         log.info("---------------------");
//         log.info(userRepository);
//     }

//     @Test
//     public void testInsert() {
//         for (int i = 1; i <= 100; i++) {
//             User user = User.builder()
//                     .userId("user" + i).userEmail("user@swit" + i + ".com")
//                     .userName("김철수" + i).userPassword("1234")
//                     .userPhone("010-1234-1234").userNick("슈퍼맨")
//                     .userSnsConnect("").userDeleteChk(false)
//                     .userCreateDate(LocalDateTime.now())
//                     .build();

//             userRepository.save(user);

//         }
//     }

//     // 프로필 정보 조회(마이페이지 로드시)
//     @Transactional
//     @Test
//     public void testRead() {
//         String userId = "user1";
//         Optional<User> result = userRepository.findByUserId(userId);
//         User user = result.orElseThrow();
//         log.info(user);
//     }

//     // 프로필 정보 수정
//     @Test
//     public void testModify() {
//         String userId = "user1";
//         Optional<User> result = userRepository.findByUserId(userId);
//         User user = result.orElseThrow();
//         user.setUserName("아조나스1");
//         log.info(user);
//         userRepository.save(user);
//     }

//     // group isMember test

//     @Test
//     public void testExistsByUserAndStudy() {
//         String userId = "1234";
//         Integer studyNo = 1;

//         boolean exists = groupRepository.existsByUserUserIdAndStudyStudyNo(userId, studyNo);

//         if (exists) {
//             log.info("결과: True");
//         } else {
//             log.info("결과: False");
//         }
//     }

//     // 시큐리티 적용 후 jpa/JPQL 생성이 되지 않아 주석처리함
//     // 다른 방법으로 처리 필요
//     // @Test
//     // public void testPaging(){
//     // // User 엔티티에서 "user_id"의 실제 필드명은 "userId"임
//     // // Sort.by()에서 그대로 "user_id"로 치면 인식 X
//     // Pageable pageable = PageRequest.of(0, 10, Sort.by("userNo").descending());
//     // // Page<User> result = adminRepository.findAllUsers(pageable);
//     // Page<User> result = adminRepository.findByOrderByUserNoAsc(pageable);
//     // log.info(result.getTotalElements());
//     // result.getContent().stream().forEach(user ->log.info(user));
//     // }
// }
