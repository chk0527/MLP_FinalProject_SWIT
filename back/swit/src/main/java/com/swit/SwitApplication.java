package com.swit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.swit.domain.User;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class SwitApplication {
  //
  public static void main(String[] args) {
    SpringApplication.run(SwitApplication.class, args);
    User user = new User();
    user.setUserId("domain_test_name2");
    log.info("sample domain test" + user.getUserId());
  }

}
