package com.swit.swit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.swit.domain.Sample;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootApplication
public class SwitApplication {

  public static void main(String[] args) {
    SpringApplication.run(SwitApplication.class, args);
    Sample sample = new Sample();
    sample.setName("domain_test_name");
    log.info("sample domain test" + sample.getName());
  }

}
