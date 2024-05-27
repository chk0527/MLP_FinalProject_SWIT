package com.swit.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.swit.domain.User;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
public class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Test
    public void test() {
        log.info("---------------------");
        log.info(userRepository);
    }

    @Test
    public void testInsert() {
        for (int i = 1; i <= 100; i++) {
            User user = User.builder()
                    .user_id("user" + i).user_email("user@swit" + i + ".com")
                    .user_name("김철수" + i).user_password("1234")
                    .user_phone("010-1234-1234").user_nick("슈퍼맨")
                    .user_sns_connect("").user_image("d:/upload/profile.png")
                    .user_delete_chk(false).user_create_date(LocalDateTime.now())
                    .build();

            userRepository.save(user);

        }
    }

    //프로필 정보 조회(마이페이지 로드시)
    @Transactional
    @Test
    public void testRead() {
        String user_id = "user1";
        Optional<User> result = userRepository.findById(user_id);
        User user = result.orElseThrow();
        log.info(user);
        log.info(user.getUser_image());
    }

    // //프로필 정보 수정
    // @Test
    // public void testModify() {
    //     String user_id = "user1";
    //     User user = userRepository.select
    //     user.setPname("10번 상품");
    //     product.setPdesc("10번 상품 설명");
    //     product.setPrice(5000);
    //     product.clearList(); // 기존의 첨부파일 삭제
    //     product.addImageString(UUID.randomUUID().toString() + "_" + "newimage1.jpg");
    //     product.addImageString(UUID.randomUUID().toString() + "_" + "newimage2.jpg");
    //     product.addImageString(UUID.randomUUID().toString() + "_" + "newimage3.jpg");
    //     productRepository.save(product);
    // }

}
